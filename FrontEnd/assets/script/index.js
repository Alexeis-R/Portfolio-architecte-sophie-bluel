// Fonction pour récupérer les catégories
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }
        const categories = await response.json();
        console.log('Données des catégories :', categories);
        return categories;
    } catch (error) {
        console.error('Échec de la récupération des catégories :', error);
    }
}

// Fonction pour récupérer les œuvres
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }
        const works = await response.json();
        console.log('Données des œuvres :', works);
        return works;
    } catch (error) {
        console.error('Échec de la récupération des œuvres :', error);
    }
}

// Fonction pour afficher les œuvres
function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    // Vide la galerie avant d'ajouter les œuvres
    gallery.innerHTML = ''; 

    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.classList.add('work-item');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <p>${work.title}</p>
        `;
        gallery.appendChild(workElement);
    });
}

// Fonction pour afficher les catégories sur le site et appliquer les filtres
async function displayCategories() {
    // Récupère les catégories et les œuvres
    const categories = await getCategories();
    const works = await getWorks();

    if (categories && categories.length > 0) {
        // Sélectionne l'élément HTML 
        const categoriesContainer = document.getElementById('filter-buttons');

        // Crée et ajoute le bouton "Tous"
        const allButton = document.createElement('button');
        allButton.classList.add('btn', 'active');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
            allButton.classList.add('active');
             // Affiche toutes les œuvres
            displayWorks(works);
        });
        categoriesContainer.appendChild(allButton);

        // Affiche toutes les œuvres par défaut
        displayWorks(works);

        // Parcourt les catégories et crée un élément HTML pour chacune
        categories.forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.classList.add('btn');
            categoryButton.textContent = category.name;
            categoryButton.addEventListener('click', () => {
                // Filtre et affiche les œuvres par catégorie
                document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
                categoryButton.classList.add('active');
                const filteredWorks = works.filter(work => work.categoryId === category.id);
                 // Affiche les œuvres filtrées
                displayWorks(filteredWorks);
            });
            categoriesContainer.appendChild(categoryButton);
        });
    } else {
        console.log('Aucune catégorie trouvée.');
    }
}

// Appelle la fonction pour afficher les catégories et les œuvres lorsque la page est chargée
document.addEventListener('DOMContentLoaded', displayCategories);
