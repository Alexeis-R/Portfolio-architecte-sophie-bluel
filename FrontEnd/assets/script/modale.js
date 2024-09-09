// Fonction asynchrone pour récupérer les œuvres depuis l'API
async function getWorks() {
    try {
// Envoie une requête GET à l'API pour obtenir les œuvres
        const response = await fetch("http://localhost:5678/api/works");
        // Si la réponse n'est pas ok, lance une erreur
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }
// Convertit la réponse en format JSON
        const works = await response.json();
        return works;
    } catch (error) {
// Affiche un message d'erreur si la requête échoue
        console.error('Échec de la récupération des œuvres :', error);
    }
}

// Fonction pour ouvrir la première modal et charger les œuvres
async function openModal() {
// Affiche la modal et l'overlay
    document.querySelector(".modal").style.display = "block";
    document.querySelector(".overlay").style.display = "block";

// Récupère les œuvres via l'API
    const works = await getWorks();
// Remplit la modal avec les œuvres
    populateModal(works);
}

// Ajoute un écouteur d'événement au bouton d'édition pour ouvrir la modal
document.querySelector(".edit_button").addEventListener("click", openModal);


// Fonction pour revenir à la première modal depuis la seconde
async function returnModal() {
// Affiche la première modal et cache la deuxième
    document.querySelector(".modal").style.display = "block";
    document.querySelector(".modal_2").style.display = "none";
}
// Ajoute un écouteur d'événement au bouton pour revenir à la première modal
document.getElementById("left").addEventListener("click", returnModal);


// Fonction pour remplir la modal avec les œuvres récupérées
function populateModal(works) {
    const gallery = document.querySelector(".modal_gallery");
// Vide la galerie avant d'ajouter les nouvelles œuvres
    gallery.innerHTML = "";

// Si aucune œuvre n'est trouvée, affiche un message
    if (works.length === 0) {
        gallery.innerHTML = "<p>Aucun projet trouvée.</p>"
        return;
    }

// Pour chaque œuvre, crée un élément de galerie avec une image et une icône de suppression
    works.forEach(work => {
        const workElement = document.createElement("div");
        workElement.classList.add("project-item");
        workElement.id="vignette"+work.id;
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <i class="fa-solid fa-trash-can delete-icon" id="delete" onclick="deleteImage(${work.id})"></i>
        `;
        gallery.appendChild(workElement);
    });
}

// Fonction pour supprimer une image via l'API
async function deleteImage(work) {
    const apiUrl = 'http://localhost:5678/api/works/'+work;

    try {
// Envoie une requête DELETE à l'API pour supprimer l'image
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${window.sessionStorage.getItem("authToken")}`,
            }
        });
// Si la suppression réussit, enlève l'image de la galerie
        if (response.ok) {
            alert('Image supprimée avec succès');
            document.getElementById(`vignette${work}`).remove();
        } else {
            alert('Erreur lors de la suppression de l\'image');
        }
    } catch (error) {
// Affiche une erreur si la requête échoue
        console.error('Erreur:', error);
    }
}

// Fonction pour ouvrir la seconde modal
async function openModal2() {
    document.querySelector(".modal_2").style.display = 'block';
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "none";
// Remplit les catégories dans la modal 2
    populateCategories(); 
    
};
// Ajoute un écouteur d'événement au bouton pour ouvrir la seconde modal
document.querySelector(".modal_footer_button").addEventListener("click", openModal2);

// Fonction pour fermer les modals et l'overlay
async function closeModal() {
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.modal_2').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

// Ajoute des écouteurs d'événements pour fermer les modals
document.querySelector('.modal_close').addEventListener('click', closeModal);
document.getElementById("cross").addEventListener('click', closeModal);

// Prévisualise l'image sélectionnée pour l'upload
document.getElementById('input-file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
// Affiche l'image prévisualisée et masque les éléments inutiles
      const preview = document.getElementById('preview');
      const iconImage = document.getElementById('icon-image');
      const labelAddPhoto = document.getElementById('label-add-photo');
      const infoImage = document.getElementById('infoImage');

      preview.src = e.target.result;
      preview.style.display = 'block';
      

      iconImage.style.display = 'none';
      labelAddPhoto.style.display = 'none';
      infoImage.style.display = 'none';

// Met à jour l'état du bouton de soumission
      updateSubmitButtonState();
    };
    reader.readAsDataURL(file);
  }
});


document.getElementById('title').addEventListener('input', updateSubmitButtonState);
document.getElementById('category').addEventListener('change', updateSubmitButtonState);

// Met à jour l'état du bouton de soumission en fonction des champs remplis
function updateSubmitButtonState() {
  const fileInput = document.getElementById('input-file');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const submitButton = document.getElementById('submit-button');

  // Vérifie si tous les champs requis sont remplis
  const isFileSelected = fileInput.files.length > 0;
  const isTitleFilled = titleInput.value.trim() !== '';
  const isCategorySelected = categorySelect.value !== '';

// Active le bouton de soumission si tous les champs sont remplis
  if (isFileSelected && isTitleFilled && isCategorySelected) {
    submitButton.style.backgroundColor = 'green';
    submitButton.disabled = false;
  } else {
    submitButton.style.backgroundColor = '';
    submitButton.disabled = true;
  }
}

// Fonction pour gérer l'ajout d'une nouvelle image
const buttonValid = document.getElementById('submit-button');
buttonValid.addEventListener('click', async function(event) {
// Empêche le rechargement de la page
    event.preventDefault();

    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('input-file').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${window.sessionStorage.getItem("authToken")}`,
            },
            body: formData
        });

        if (response.ok) {
            alert('Image ajoutée avec succès');
            closeModal();
        } else {
            alert('Erreur lors de l\'ajout de l\'image');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});

// Fonction pour remplir la liste des catégories dans le formulaire d'ajout d'image
async function populateCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (response.ok) {
            const categories = await response.json();
            const categorySelect = document.getElementById('category');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } else {
            console.error('Erreur lors de la récupération des catégories');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}
// Met à jour l'état du bouton de soumission en fonction des champs remplis
function updateSubmitButtonState() {
    const fileInput = document.getElementById('input-file');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const submitButton = document.getElementById('submit-button');

// Vérifie si tous les champs requis sont remplis
    const FileSelected = fileInput.files.length > 0;
    const TitleFilled = titleInput.value.trim() !== '';
    const CategorySelected = categorySelect.value !== '';

// Active le bouton de soumission si tous les champs sont remplis

    if (FileSelected && TitleFilled && CategorySelected) {
      submitButton.style.backgroundColor = '#1D6154';
      submitButton.disabled = false;
    } else {
      submitButton.style.backgroundColor = '';
      submitButton.disabled = true;
    }
  }

  document.getElementById('input-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('preview');
        const iconImage = document.getElementById('icon-image');
        const labelAddPhoto = document.getElementById('label-add-photo');

        preview.src = e.target.result;
        preview.style.display = 'block';

        iconImage.style.display = 'none';
        labelAddPhoto.style.display = 'none';

        updateSubmitButtonState();
      };
      reader.readAsDataURL(file);
    }
  });

  // Ajoute des écouteurs d'événements pour surveiller les changements dans les champs
  document.getElementById('title').addEventListener('input', updateSubmitButtonState);
  document.getElementById('category').addEventListener('change', updateSubmitButtonState);
