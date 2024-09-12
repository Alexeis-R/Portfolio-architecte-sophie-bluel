document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("authToken");

    function isTokenValid(token) {
        return token !== null && token !== "";
    }

    const authButton = document.getElementById("authButton");
    const filterButton = document.getElementById("filter-buttons");
    const navBar = document.getElementById("navBar");
    const editButton = document.getElementById("edit-button");
    const loginButton = document.getElementById("authButton"); 

    if (authButton && filterButton && navBar) {
        if (isTokenValid(token)) {
            authButton.textContent = "Logout";
            navBar.style.display = "flex";
            filterButton.style.display = "none";
            editButton.style.display = "flex";
        } else {
            authButton.textContent = "Login";
            filterButton.style.display = "flex";
            navBar.style.display = "none";
        }
    } else {
        console.error("Erreur: Un ou plusieurs éléments sont introuvables.");
    }

    // Ajoutez l'écouteur d'événement pour le bouton login
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (!isTokenValid(token)) {
                window.location.href = "login.html"; // Redirige vers la page de connexion
            } else {
                sessionStorage.removeItem("authToken");
                window.location.reload();
            }
        });
    } else {
        console.error("Erreur: Le bouton login est introuvable.");
    }
});

displayCategories();

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
