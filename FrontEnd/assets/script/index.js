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

// Lorsque le DOM est complètement chargé, affiche les travaux
document.addEventListener('DOMContentLoaded', displayWorks);

// Lorsque le DOM est complètement chargé, crée et ajoute les boutons de filtrage
document.addEventListener('DOMContentLoaded', () => {
    const buttonLabels = ['Tous', 'Objets', 'Appartements', 'Hotels & restaurants'];
    // Sélectionne le conteneur des boutons
    const buttonContainer = document.getElementById('filter-buttons'); 

    buttonLabels.forEach(label => {
        // Crée un bouton
        const button = document.createElement('button'); 
         // Ajoute la classe 'btn' au bouton
        button.className = 'btn';
        // Définit le texte du bouton

        button.textContent = label; 
        // Marque le bouton 'Tous' comme actif
        if (label === 'Tous') {
            button.classList.add('active'); 
        }

        // Lorsqu'un bouton est cliqué
        button.addEventListener('click', () => {
            // Enlève la classe 'active' de tous les boutons
            document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
            
            // Ajoute la classe 'active' au bouton cliqué
            button.classList.add('active');
            
            // Filtre les éléments de la galerie en fonction du texte du bouton
            filterItems(label.toLowerCase());
        });

        // Ajoute le bouton au conteneur des boutons
        buttonContainer.appendChild(button);
    });
});

// Fonction pour filtrer les éléments affichés dans la galerie
function filterItems(filter) {
    const items = document.querySelectorAll('.gallery figure'); // Sélectionne tous les éléments de la galerie
    items.forEach(item => {
        // Affiche l'élément si le filtre est 'tous' ou si la légende de l'élément contient le filtre
        if (filter === 'tous' || item.querySelector('figcaption').textContent.toLowerCase().includes(filter)) {
            // Affiche l'élément
            item.style.display = ''; 
        } else {
             // Masque l'élément
            item.style.display = 'none';
        }
    });
}
