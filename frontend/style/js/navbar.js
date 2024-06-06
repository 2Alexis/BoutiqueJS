document.addEventListener("DOMContentLoaded", () => {
    const profileInfo = document.getElementById('profile-info');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:5500/users/validate-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Token valide') {
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
                        clearLocalStorage();
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du profil utilisateur:', error);
                    clearLocalStorage();
                });
            } else {
                clearLocalStorage();
            }
        })
        .catch(error => {
            console.error('Erreur lors de la validation du token:', error);
            clearLocalStorage();
        });
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }

    logoutLink.addEventListener('click', () => {
        clearLocalStorage();
        window.location.href = '/frontend/index.html';
    });

    function clearLocalStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        profileInfo.textContent = '';
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
});
