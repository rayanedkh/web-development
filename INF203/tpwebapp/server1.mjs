// server1.mjs
"use strict";

import { createServer } from "http";
import { readFile, writeFile, stat } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve, normalize } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get directory of current file
const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = resolve(__dirname);
const storagePath = join(baseDir, 'storage.json');

// Initialize storage.json if it does not exist
async function initStorage() {
    if (!existsSync(storagePath)) {
        const initial = [
            { "title": "foo", "color": "red", "value": 20 },
            { "title": "bar", "color": "ivory", "value": 100 }
        ];
        await writeFile(storagePath, JSON.stringify(initial));
    }
}

// Create HTTP server
const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Handle /
    if (pathname === "/") {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end("PieChart Server v1.0");
        return;
    }

    // Kill server
    if (pathname === "/kill") {
        res.end("Server stopped");
        server.close(() => process.exit(0));
        return;
    }

    // Serve static files from /WWW/
    if (pathname.startsWith("/WWW/")) {
        const filePath = join(baseDir, normalize(pathname.substring(5)));
        try {
            const data = await readFile(filePath);
            const ext = filePath.split('.').pop();
            const mime = {
                html: "text/html",
                js: "application/javascript",
                css: "text/css",
                json: "application/json",
                svg: "image/svg+xml"
            }[ext] || "text/plain";
            res.setHeader("Content-Type", mime);
            res.end(data);
        } catch {
            res.statusCode = 404;
            res.end("File not found");
        }
        return;
    }

    // GET /Data => send JSON
    if (pathname === "/Data") {
        try {
            const data = await readFile(storagePath, "utf8");
            res.setHeader("Content-Type", "application/json");
            res.end(data);
        } catch {
            res.statusCode = 500;
            res.end("Server error");
        }
        return;
    }

    // GET /add?title=..&value=..&color=..
    if (pathname === "/add") {
        const title = url.searchParams.get("title");
        const value = Number(url.searchParams.get("value"));
        const color = url.searchParams.get("color");

        if (!title || !color || isNaN(value) || value <= 0) {
            res.statusCode = 400;
            res.end("Invalid parameters");
            return;
        }

        try {
            const json = JSON.parse(await readFile(storagePath, "utf8"));
            json.push({ title, color, value });
            await writeFile(storagePath, JSON.stringify(json));
            res.end("OK");
        } catch {
            res.statusCode = 500;
            res.end("Server error");
        }
        return;
    }

    // GET /remove?index=..
    if (pathname === "/remove") {
        const index = Number(url.searchParams.get("index"));
        try {
            const json = JSON.parse(await readFile(storagePath, "utf8"));
            if (isNaN(index) || index < 0 || index >= json.length) {
                res.statusCode = 400;
                res.end("Invalid index");
                return;
            }
            json.splice(index, 1);
            if (json.length === 0) {
                json.push({ title: "empty", color: "red", value: 1 });
            }
            await writeFile(storagePath, JSON.stringify(json));
            res.end("OK");
        } catch {
            res.statusCode = 500;
            res.end("Server error");
        }
        return;
    }

    // GET /clear
    if (pathname === "/clear") {
        try {
            await writeFile(storagePath, JSON.stringify([{ title: "empty", color: "red", value: 1 }]));
            res.end("OK");
        } catch {
            res.statusCode = 500;
            res.end("Server error");
        }
        return;
    }

    // GET /restore
    if (pathname === "/restore") {
        const restored = [
            { "title": "foo", "color": "red", "value": 20 },
            { "title": "bar", "color": "ivory", "value": 100 },
            { "title": "baz", "color": "blue", "value": 50 }
        ];
        try {
            await writeFile(storagePath, JSON.stringify(restored));
            res.end("OK");
        } catch {
            res.statusCode = 500;
            res.end("Server error");
        }
        return;
    }

    // GET /PieChart => generate SVG
    if (pathname === "/PieChart") {
        try {
            const json = JSON.parse(await readFile(storagePath, "utf8"));
            const total = json.reduce((sum, e) => sum + e.value, 0);

            let angle = 0;
            let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">`;

            for (const slice of json) {
                const percent = slice.value / total;
                const angleEnd = angle + percent * 360;

                const x1 = 50 + 50 * Math.cos(angle * Math.PI / 180);
                const y1 = 50 + 50 * Math.sin(angle * Math.PI / 180);
                const x2 = 50 + 50 * Math.cos(angleEnd * Math.PI / 180);
                const y2 = 50 + 50 * Math.sin(angleEnd * Math.PI / 180);
                const largeArc = (angleEnd - angle) > 180 ? 1 : 0;

                svg += `<path d="M50,50 L${x1},${y1} A50,50 0 ${largeArc} 1 ${x2},${y2} Z" fill="${slice.color}"/>`;

                // label
                const mid = angle + (angleEnd - angle) / 2;
                const tx = 50 + 30 * Math.cos(mid * Math.PI / 180);
                const ty = 50 + 30 * Math.sin(mid * Math.PI / 180);
                svg += `<text x="${tx}" y="${ty}" font-size="4" text-anchor="middle" fill="black">${slice.title}</text>`;

                angle = angleEnd;
            }

            svg += `</svg>`;
            res.setHeader("Content-Type", "image/svg+xml");
            res.end(svg);
        } catch (err) {
            res.statusCode = 500;
            res.end("Server error");
        }
        return;
    }

    // If nothing matches
    res.statusCode = 404;
    res.end("Not Found");
});

// Start the server
const port = parseInt(process.argv[2]) || 8000;
await initStorage();
server.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
