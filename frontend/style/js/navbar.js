document.addEventListener("DOMContentLoaded", () => {
    const profileInfo = document.getElementById('profile-info');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:5500/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                profileInfo.textContent = `Bienvenue, ${data.user.username}`;
                loginLink.style.display = 'none';
                registerLink.style.display = 'none';
                logoutLink.style.display = 'block';
            } else {
                loginLink.style.display = 'block';
                registerLink.style.display = 'block';
                logoutLink.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du profil utilisateur:', error);
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            logoutLink.style.display = 'none';
        });
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }

    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/frontend/index.html';
    });
});
