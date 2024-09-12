
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validation des champs
    if (!email || !password) {
        document.getElementById('error-message').textContent = 'Veuillez remplir tous les champs.';
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('E-mail ou mot de passe incorrect.');
        }

        const data = await response.json();
        sessionStorage.setItem('authToken', data.token);
        window.location.href = 'index.html';

    } catch (error) {
        document.getElementById('error-message').textContent = 'Erreur lors de la connexion. Veuillez réessayer.';
        document.getElementById('error-message').style.display = 'block';
        console.error('Erreur lors de la connexion:', error);
    }
});