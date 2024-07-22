// Fonction pour récupérer les données des travaux depuis l'API
async function getWorks() {
    try {
        // Envoie une requête HTTP pour obtenir les données des œuvres
        const response = await fetch("http://localhost:5678/api/works");
        
        // Vérifie si la réponse est OK
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }
        // Convertit la réponse en JSON
        const works = await response.json();
        // Affiche les données dans la console
        console.log('Données des œuvres :', works); 
        // Renvoie les données des œuvres
        return works; 
    } catch (error) {
        // Affiche une erreur en cas de problème avec la requête
        console.error('Échec de la récupération des œuvres :', error);
    }
}

async function getCategories() {
    try {
        // Envoie une requête HTTP pour obtenir les données des catégories
        const response = await fetch("http://localhost:5678/api/categories");
        // Vérifie si la réponse est OK
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }
        // Convertit la réponse en JSON
        const categories = await response.json();
        // Renvoie les données des catégories
        return categories; 
    } catch (error) {
        // Affiche une erreur en cas de problème avec la requête
        console.error('Échec de la récupération des catégories :', error);
    }
}

// Fonction pour afficher les travaux dans la galerie
async function displayWorks() {
    // Récupère les données des travaux
    const works = await getWorks(); 
    // Vérifie que les données sont un tableau
    if (works && Array.isArray(works)) { 
        // Sélectionne le conteneur de la galerie
        const gallery = document.querySelector('.gallery'); 
        // Pour chaque travaux
        works.forEach(work => {
            // Crée un élément figure
            const figure = document.createElement('figure'); 
            // Crée un élément img
            const img = document.createElement('img'); 
             // Définit la source de l'image
            img.src = work.imageUrl;
            // Définit le texte alternatif de l'image
            img.alt = work.title || 'Image'; 
             // Crée un élément figcaption
            const figcaption = document.createElement('figcaption');
             // Définit le texte de la légende
            figcaption.textContent = work.title;
            
            // Ajoute l'image et la légende à l'élément figure
            figure.appendChild(img);
            figure.appendChild(figcaption);
            
            // Ajoute l'élément figure au conteneur de la galerie
            gallery.appendChild(figure);
        });
    }
}

// Fonction pour afficher les catégories sur le site
async function displayCategories() {
    // Récupère les catégories depuis l'API
    const categories = await getCategories();
    // Vérifie si les donnée on ete recup
    if (categories && categories.length > 0) {
        // Sélectionne l'élément HTML ou les catégories seront affichées
        const categoriesContainer = document.getElementById('filter-buttons');

        // Crée et ajoute le bouton "Tous"
        const allButton = document.createElement('button');
        // Ajoute la classe btn et active
        allButton.classList.add('btn', 'active');
        // Ajoute le text du bouton
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            // Affiche toute les categorie
            document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
            allButton.classList.add('active');
        });
        // Ajoute le bouton Tous all button
        categoriesContainer.appendChild(allButton);

        // Parcourt les catégories et crée un élément HTML pour chacune
        categories.forEach(category => {
            // crée un bouton
            const categoryButton = document.createElement('button');
            // ajoute la class btn
            categoryButton.classList.add('btn');
            // recupere le nom dans la liste recuperer de l api 
            categoryButton.textContent = category.name;
            categoryButton.addEventListener('click', () => {
                // désactive la class active des boutons et l'ajoute au clic du bouton
                document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
                categoryButton.classList.add('active');
            });
            // ajoute les les element au conteneur
            categoriesContainer.appendChild(categoryButton);
        });
    } 
}

// Lorsque le DOM est complètement chargé, affiche les travaux
document.addEventListener('DOMContentLoaded', displayWorks);

// Appelle la fonction pour afficher les catégories lorsque la page est chargée
document.addEventListener('DOMContentLoaded', displayCategories);
