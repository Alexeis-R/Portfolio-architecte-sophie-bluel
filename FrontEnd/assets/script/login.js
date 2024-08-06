// Ajoute un écouteur pour l'événement
document.getElementById('login-form').addEventListener('submit', async function(event) {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Récupère les valeurs des champs email et mot de passe
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Envoie une requête POST à l'API de connexion
        const response = await fetch('http://localhost:5678/api/users/login', {
            // Utilise la méthode POST
            method: 'POST', 
            headers: {
                // Indique que le corps de la requête est en JSON
                'Content-Type': 'application/json' 
            },
            // Convertit les données en JSON
            body: JSON.stringify({ email, password }) 
        });

        // Si la réponse n'est pas OK, lance une erreur
        if (!response.ok) {
            throw new Error('E-mail ou mot de passe incorrect.');
        }

        // Analyse la réponse JSON
        const data = await response.json();
        // Stocke le token d'authentification
        sessionStorage.setItem('authToken', data.token);

        // Redirige vers la page d'accueil
        window.location.href = 'index.html';
    } catch (error) {
        // Affiche un message d'erreur
        document.getElementById('error-message').style.display = 'block';
        // Affiche l'erreur dans la console
        console.error('Erreur lors de la connexion:', error);
    }
});
