document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('username').innerText = user.username;
        document.getElementById('email').innerText = user.email;
    } else {
        window.location.href = '/frontend/login.html'; // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
    }
});
