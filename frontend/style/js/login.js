document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:5500/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    alert('Connexion réussie');
                    window.location.href = '/frontend/index.html';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la connexion:', error);
            });
        });
    } else {
        console.error('Le formulaire de connexion est introuvable');
    }z
});
