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

        `;
        gallery.appendChild(workElement);
    });
}

 async function closeModal() {
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}