"use strict";

import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { existsSync } from "fs";
import { extname, join, normalize } from "path";
import { URL } from "url";

// Liste pour la route /coucou
let visitedNames = [];

// Dictionnaire des types MIME
const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript", // On s'assure que .js a bien le bon type
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".txt": "text/plain",
    ".mjs": "application/javascript" // Pour gérer les fichiers .mjs
};

// Fonction d’échappement simple pour éviter l'injection HTML
function escapeHTML(str) {
    return str.replace(/</g, "_").replace(/>/g, "_");
}

// Fonction principale du serveur
function webserver(request, response) {
    try {
        const urlObj = new URL(request.url, `http://${request.headers.host}`);
        const pathname = urlObj.pathname;

        // Route /
        if (pathname === "/") {
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end("<!doctype html><html><body>Server works.</body></html>");
            return;
        }

        // Route /kill
        if (pathname === "/kill") {
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end("<!doctype html><html><body>The server will stop now.</body></html>", () => {
                process.exit(0);
            });
            return;
        }

        // Route /hi?visiteur=...
        if (pathname === "/hi") {
            const name = urlObj.searchParams.get("visiteur") || "";
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end(`<!doctype html><html><body>hi ${name}</body></html>`);
            return;
        }

        // Route /coucou?nom=...
        if (pathname === "/coucou") {
            const rawName = urlObj.searchParams.get("nom") || "";
            const previousNames = visitedNames.join(", ");
            visitedNames.push(rawName);
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end(`<!doctype html><html><body>coucou ${escapeHTML(rawName)}, the following users have already visited this page: ${escapeHTML(previousNames)}</body></html>`);
            return;
        }

        // Route /clear
        if (pathname === "/clear") {
            visitedNames = [];
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end("<!doctype html><html><body>Memory cleared.</body></html>");
            return;
        }

        // Route pour servir les fichiers statiques /www/...
        if (pathname.startsWith("/www/")) {
            const basePath = process.cwd(); // répertoire actuel
            let relativePath = decodeURIComponent(pathname.slice(5)).trim();

            if (relativePath.endsWith("/")) {
                relativePath = relativePath.slice(0, -1);
            }

            const filePath = join(basePath, normalize(relativePath));

            // Sécurité : empêcher accès hors du dossier
            if (!filePath.startsWith(basePath)) {
                response.writeHead(403, { "Content-Type": "text/plain" });
                response.end("403 Forbidden");
                return;
            }

            if (!existsSync(filePath)) {
                console.error(`File not found: ${filePath}`); // Log de l'erreur
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("404 Not Found");
                return;
            }

            const ext = extname(filePath).toLowerCase();
            let mime = mimeTypes[ext];

            // Si le fichier est JS ou MJS, s'assurer que le type MIME soit correct
            if (ext === ".js" && !mime) {
                mime = "application/javascript";
            }

            stat(filePath).then(stats => {
                if (stats.isFile()) {
                    response.writeHead(200, { "Content-Type": mime });
                    readFile(filePath)
                        .then(data => response.end(data))
                        .catch((err) => {
                            console.error(`Error reading file: ${filePath}`, err); // Log d'erreur de lecture
                            response.writeHead(500, { "Content-Type": "text/plain" });
                            response.end("500 Server Error");
                        });
                } else {
                    response.writeHead(403, { "Content-Type": "text/plain" });
                    response.end("403 Forbidden");
                }
            }).catch((err) => {
                console.error(`Error with file stats: ${filePath}`, err); // Log d'erreur de stats
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.end("500 Server Error");
            });
            return;
        }

        // Si aucune route ne correspond
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("404 Not Found");

    } catch (err) {
        console.error(`Server error: ${err.message}`); // Log d'erreur du serveur
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("500 Server Error: " + err.message);
    }
}

// Port passé en argument
const port = parseInt(process.argv[2]);
if (!port) {
    console.error("Usage: node server.mjs <port>");
    process.exit(1);
}

// Lancer le serveur
const server = createServer(webserver);
server.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
