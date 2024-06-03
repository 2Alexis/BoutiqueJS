document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5500/users/register', { // Assurez-vous que l'URL correspond à celle définie dans `app.js`
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Utilisateur enregistré avec succès') {
            alert('Inscription réussie');
            window.location.href = '/frontend/index.html'; // Redirection vers l'accueil
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'inscription:', error);
    });
});