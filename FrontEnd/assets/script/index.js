document.addEventListener("DOMContentLoaded", function() {
// Récupère le token depuis le sessionStorage
    const token = sessionStorage.getItem("authToken");

// Fonction qui vérifie si le token est valide
    function isTokenValid(token) {
        // On vérifie que le token existe et qu'il est égal à "validToken"
        return token !== null && token === "validToken";
    }

    const authButton = document.getElementById("authButton");
    const filterButton = document.getElementById("filter-buttons");
    const navBar = document.getElementById("navBar");

// Si le token est valide, change le texte en "Login"
    if (isTokenValid(token)) {
        authButton.textContent = "Login";
        navBar.style.display = "none";
    } else {
// Sinon, change le texte en "Logout"
        authButton.textContent = "Logout";
        filterButton.style.display = "none";    

    }
});



// Fonction pour récupérer les catégories
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }
        const categories = await response.json();
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
        workElement.id="vignette"+work.id;
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <p>${work.title}</p>
        `;
        gallery.appendChild(workElement);
    });
}

// Fonction pour afficher les catégories et gérer les filtres
async function displayCategories() {
    const categories = await getCategories();
    const works = await getWorks();

    if (categories && categories.length > 0) {
        const categoriesContainer = document.getElementById('filter-buttons');

// Ajoute un bouton "Tous" pour afficher toutes les œuvres
        const allButton = document.createElement('button');
        allButton.classList.add('btn', 'active');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
            allButton.classList.add('active');
            displayWorks(works);
        });
        categoriesContainer.appendChild(allButton);

        displayWorks(works);

// Crée un bouton pour chaque catégorie
        categories.forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.classList.add('btn');
            categoryButton.textContent = category.name;
            categoryButton.addEventListener('click', () => {
                document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
                categoryButton.classList.add('active');
// Filtre les œuvres en fonction de la catégorie sélectionnée
                const filteredWorks = works.filter(work => work.categoryId === category.id);
                displayWorks(filteredWorks);
            });
            categoriesContainer.appendChild(categoryButton);
        });
    } else {
        console.error('Aucune catégorie trouvée.');
    }
}
// Attendre que la page soit complètement chargée pour afficher les catégories et les œuvres
document.addEventListener('DOMContentLoaded', displayCategories);