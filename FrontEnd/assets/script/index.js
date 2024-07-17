
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const works = await response.json();
        console.log('Works data:', works);
        return works;
    } catch (error) {
        console.error('Failed to fetch works:', error);
    }
}

async function displayWorks() {
    const works = await getWorks();
    if (works && Array.isArray(works)) {
        const gallery = document.querySelector('.gallery');
        works.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title || 'Image';
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    }
}

document.addEventListener('DOMContentLoaded', displayWorks);