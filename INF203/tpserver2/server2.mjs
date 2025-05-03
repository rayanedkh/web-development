import express from 'express';
import morgan from 'morgan';
import fs from 'fs';

const app = express();

// Middleware pour le logging des requêtes
app.use(morgan('dev'));

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Variable pour stocker les données de db.json
let dbData = [];

// Fonction pour charger les données depuis db.json
function loadDbJson() {
  try {
    const rawData = fs.readFileSync('./db.json', 'utf8');
    dbData = JSON.parse(rawData);
    return true;
  } catch (error) {
    console.error('Erreur lors du chargement de db.json:', error);
    return false;
  }
}

// Chargement initial des données
loadDbJson();

// Route racine - répond simplement "Hi"
app.get('/', (req, res) => {
  res.send('Hi');
});

// Route pour arrêter le serveur
app.get('/kill', (req, res) => {
  res.send('Server shutting down...');
  process.exit(0);
});

// Route pour recharger db.json
app.get('/restart', (req, res) => {
  loadDbJson();
  res.type('text/plain').send('db.json reloaded');
});

// Route pour compter le nombre de publications
app.get('/countpapers', (req, res) => {
  res.type('text/plain').send(String(dbData.length));
});

// Route pour compter les publications par auteur (utilisant les paramètres nommés d'Express)
app.get('/byauthor/:authorName', (req, res) => {
  const authorQuery = req.params.authorName.toLowerCase();
  
  const count = dbData.filter(paper => {
    if (!paper.authors || !Array.isArray(paper.authors)) return false;
    
    return paper.authors.some(author => 
      author.toLowerCase().includes(authorQuery)
    );
  }).length;
  
  res.type('text/plain').send(String(count));
});

// Route pour obtenir les descripteurs des publications par auteur
app.get('/descriptors/:authorName', (req, res) => {
  const authorQuery = req.params.authorName.toLowerCase();
  
  const matchingPapers = dbData.filter(paper => {
    if (!paper.authors || !Array.isArray(paper.authors)) return false;
    
    return paper.authors.some(author => 
      author.toLowerCase().includes(authorQuery)
    );
  });
  
  res.type('application/json').json(matchingPapers);
});

// Route pour obtenir les titres des publications par auteur
app.get('/ttlist/:authorName', (req, res) => {
  const authorQuery = req.params.authorName.toLowerCase();
  
  const matchingTitles = dbData
    .filter(paper => {
      if (!paper.authors || !Array.isArray(paper.authors)) return false;
      
      return paper.authors.some(author => 
        author.toLowerCase().includes(authorQuery)
      );
    })
    .map(paper => paper.title);
  
  res.type('application/json').json(matchingTitles);
});

// Route pour obtenir le descripteur d'une publication par sa clé
app.get('/pubref/:key', (req, res) => {
  const keyQuery = req.params.key;
  
  const publication = dbData.find(paper => paper.key === keyQuery);
  
  if (publication) {
    res.type('application/json').json(publication);
  } else {
    // Si aucune publication n'est trouvée avec cette clé, renvoyer une erreur 404
    res.status(404).json({ error: 'Publication not found' });
  }
});

// Route pour supprimer une publication par sa clé
app.delete('/pubref/:key', (req, res) => {
  const keyQuery = req.params.key;
  
  // Recherche de l'indice de la publication dans le tableau
  const index = dbData.findIndex(paper => paper.key === keyQuery);
  
  // Si la publication est trouvée
  if (index !== -1) {
    // Suppression de la publication du tableau en mémoire
    dbData.splice(index, 1);
    res.status(200).json({ success: true, message: `Publication ${keyQuery} deleted` });
  } else {
    // Si aucune publication n'est trouvée avec cette clé, renvoyer une erreur 404
    res.status(404).json({ success: false, error: 'Publication not found' });
  }
});

// Route pour ajouter une nouvelle publication
app.post('/pubref', (req, res) => {
  // Récupérer les données de la publication depuis le corps de la requête
  const newPublication = req.body;
  
  // S'assurer que la publication a une clé définie à "imaginary"
  newPublication.key = "imaginary";
  
  // Vérifier si une publication avec cette clé existe déjà
  const existingIndex = dbData.findIndex(paper => paper.key === "imaginary");
  
  if (existingIndex !== -1) {
    // Si une publication avec cette clé existe déjà, la remplacer
    dbData[existingIndex] = newPublication;
    res.status(200).json({ success: true, message: "Publication updated", publication: newPublication });
  } else {
    // Sinon, ajouter la nouvelle publication
    dbData.push(newPublication);
    res.status(201).json({ success: true, message: "Publication added", publication: newPublication });
  }
});

// Route pour modifier une publication existante
app.put('/pubref/:key', (req, res) => {
  const keyQuery = req.params.key;
  const updateData = req.body;
  
  // Recherche de l'indice de la publication dans le tableau
  const index = dbData.findIndex(paper => paper.key === keyQuery);
  
  // Si la publication est trouvée
  if (index !== -1) {
    // Mise à jour partielle - conserver les champs existants et ajouter/remplacer les nouveaux
    const updatedPublication = { ...dbData[index], ...updateData };
    
    // Préserver la clé originale (ne pas permettre sa modification)
    updatedPublication.key = keyQuery;
    
    // Remplacer l'objet existant par l'objet mis à jour
    dbData[index] = updatedPublication;
    
    res.status(200).json({ 
      success: true, 
      message: `Publication ${keyQuery} updated`,
      publication: updatedPublication 
    });
  } else {
    // Si aucune publication n'est trouvée avec cette clé, renvoyer une erreur 404
    res.status(404).json({ 
      success: false, 
      error: 'Publication not found' 
    });
  }
});

// Récupération du port depuis les arguments de la ligne de commande
const port = process.argv[2] || 3000;

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});