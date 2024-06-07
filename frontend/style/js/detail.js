document.addEventListener("DOMContentLoaded", () => {
  
    const urlParams = new URLSearchParams(window.location.search);
    const sneakerId = urlParams.get('id');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (sneakerId) {
        fetch(`http://localhost:5500/sneakers/${sneakerId}`)
            .then(response => response.json())
            .then(data => {
                const sneaker = data;
                document.getElementById('sneaker-name').textContent = sneaker.name;

                let priceText = `Prix : ${sneaker.price}$`;
                if (sneaker.reduction > 0) {
                    const discountedPrice = (sneaker.price * (1 - sneaker.reduction / 100)).toFixed(2);
                    priceText = `Prix : <span class="original-price">${sneaker.price}$</span> <span class="discounted-price">${discountedPrice}$</span>`;
                }
                document.getElementById('sneaker-sexe').textContent = `Paire de chaussure ${sneaker.sex}`;
                document.getElementById('sneaker-price').innerHTML = priceText;
                document.getElementById('sneaker-colors').textContent = `Couleurs : ${sneaker.colors}`;
                document.getElementById('sneaker-reduction').textContent = `Réduction : ${sneaker.reduction}%`;
                document.getElementById('sneaker-available').textContent = `Disponible : ${sneaker.availability ? 'Oui' : 'Non'}`;
                document.getElementById('sneaker-sizes').textContent = `Tailles disponibles : ${sneaker.sizes}`;
                document.getElementById('sneaker-description').textContent = `Description : ${sneaker.description}`;

                const sneakerImagesContainer = document.getElementById('sneaker-images');
                sneaker.image_urls.split(',').forEach(imageUrl => {
                    const img = document.createElement('img');
                    img.src = `style/img/${imageUrl.trim()}`;
                    img.alt = 'Sneaker';
                    sneakerImagesContainer.appendChild(img);
                });

                const addToFavoritesButton = document.getElementById('add-to-favorites');
                const removeFromFavoritesButton = document.getElementById('remove-from-favorites');
                const addToCartButton = document.getElementById('add-to-cart');

                addToFavoritesButton.style.display = 'block';
                removeFromFavoritesButton.style.display = 'block';
                addToCartButton.style.display = 'block';

                addToFavoritesButton.addEventListener('click', () => {
                    if (!userId || !token) {
                        alert('Veuillez vous connecter pour ajouter des articles aux favoris.');
                        window.location.href = '/frontend/login.html'; // Redirige vers la page de connexion
                    } else {
                        checkAndAddToFavorites(sneaker);
                    }
                });

                removeFromFavoritesButton.addEventListener('click', () => {
                    if (!userId || !token) {
                        alert('Veuillez vous connecter pour retirer des articles des favoris.');
                        window.location.href = '/frontend/login.html'; // Redirige vers la page de connexion
                    } else {
                        removeFromFavorites(sneaker);
                    }
                });

                addToCartButton.addEventListener('click', () => {
                    if (!userId || !token) {
                        alert('Veuillez vous connecter pour ajouter des articles au panier.');
                        window.location.href = '/frontend/login.html'; // Redirige vers la page de connexion
                    } else {
                        addToCart(sneaker, parseInt(document.getElementById('quantity').value));
                    }
                });
            })
            .catch(error => {
                console.log("Erreur : " + error);
            });
    } else {
        console.error('ID de sneaker non spécifié dans l\'URL');
    }

    var backButton = document.getElementById("home-link");
    backButton.addEventListener("click", function() {
        history.back(); 
    });

    function checkAndAddToFavorites(product) {
        fetch(`http://localhost:5500/users/${userId}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(favorites => {
            const alreadyFavorite = favorites.some(fav => fav.id === product.id);
            if (alreadyFavorite) {
                alert('Ce produit est déjà dans vos favoris.');
            } else {
                addToFavorites(product);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la vérification des favoris:', error);
        });
    }

    function addToFavorites(product) {
        fetch(`http://localhost:5500/users/${userId}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: product.id })
        })
        .then(() => {
            alert('Le produit a été ajouté aux favoris.');
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout aux favoris:', error);
        });
    }

    function removeFromFavorites(product) {
        fetch(`http://localhost:5500/users/${userId}/favorites/${product.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            alert('Le produit a été retiré des favoris.');
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du favori:', error);
        });
    }

    function addToCart(product, quantity) {
        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        let price = product.reduction > 0 ? (product.price * (1 - product.reduction / 100)).toFixed(2) : product.price;

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ id: product.id, name: product.name, price, quantity });
        }

        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        
        alert(`${quantity} ${product.name} a été ajouté au panier.`);
    }
});

function checkTokenValidity() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Veuillez vous connecter pour accéder à cette page.');
        window.location.href = '/frontend/login.html';
        return false;
    }

    return fetch('http://localhost:5500/users/validate-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            alert('Votre session a expiré. Veuillez vous reconnecter.');
            window.location.href = '/frontend/login.html';
            return false;
        }
        return true;
    })
    .catch(error => {
        console.error('Erreur lors de la validation du token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/frontend/login.html';
        return false;
    });
}
