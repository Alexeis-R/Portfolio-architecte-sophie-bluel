const next = document.querySelector(".modal_footer_button")


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


async function openModal() {

    document.querySelector(".modal").style.display = "block";
    document.querySelector(".overlay").style.display = "block";

    const works = await getWorks();
    populateModal(works);

}

async function openModal2() {

    document.querySelector(".modal_2").style.display ='block'
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".overlay").style.display = "none";
}

async function returnModal() {
    document.querySelector(".modal").style.display = "block";
    document.querySelector(".modal_2").style.display = "none";
}

function populateModal(works) {
    const gallery = document.querySelector(".modal_gallery");
    gallery.innerHTML = "";

    if (works.length === 0) {
        gallery.innerHTML = "<p>Aucun projet trouvée.</p>"
        return;
    }

    works.forEach(work => {
        const workElement = document.createElement("div");
        workElement.classList.add("project-item");

        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <i class="fa-solid fa-trash-can delete-icon" id="delete" onclick="deleteImage()"></i>
        `;
        gallery.appendChild(workElement);
    });
}

async function deleteImage(work) {
    const apiUrl = 'http://localhost:5678/api/works/';

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            alert('Image supprimée avec succès');
            document.getElementById(`image-${work.id}`).remove();
        } else {
            alert('Erreur lors de la suppression de l\'image');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

 async function closeModal() {
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.modal_2').style.display = 'none'
};

