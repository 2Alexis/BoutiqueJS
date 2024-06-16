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

                let priceText = `Prix: ${sneaker.price}$`;
                if (sneaker.reduction > 0) {
                    const discountedPrice = (sneaker.price * (1 - sneaker.reduction / 100)).toFixed(2);
                    priceText = `Prix: <span class="original-price">${sneaker.price}$</span> <span class="discounted-price">${discountedPrice}$</span>`;
                }

                document.getElementById('sneaker-price').innerHTML = priceText;
                document.getElementById('sneaker-colors').textContent = `Couleurs: ${sneaker.colors}`;
                document.getElementById('sneaker-reduction').textContent = `Réduction: ${sneaker.reduction}%`;
                document.getElementById('sneaker-available').textContent = `Disponible: ${sneaker.availability ? 'Oui' : 'Non'}`;
                document.getElementById('sneaker-sizes').textContent = `Tailles disponibles: ${sneaker.sizes}`;

                const sneakerSizesSelect = document.getElementById('size');
                sneaker.sizes.split(',').forEach(size => {
                    const option = document.createElement('option');
                    option.value = size.trim();
                    option.textContent = size.trim();
                    sneakerSizesSelect.appendChild(option);
                });

                const sneakerColorsSelect = document.getElementById('color');
                sneaker.colors.split(',').forEach(color => {
                    const option = document.createElement('option');
                    option.value = color.trim();
                    option.textContent = color.trim();
                    sneakerColorsSelect.appendChild(option);
                });

                document.getElementById('sneaker-description').textContent = `Description: ${sneaker.description}`;

                const sneakerImagesContainer = document.getElementById('carousel-inner');
                sneaker.image_urls.split(',').forEach((imageUrl, index) => {
                    const img = document.createElement('img');
                    img.src = `style/img/${imageUrl.trim()}`;
                    img.alt = 'Sneaker';
                    if (index === 0) img.classList.add('active');
                    sneakerImagesContainer.appendChild(img);
                });

                const favButton = document.getElementById('fav-button');
                const addToCartButton = document.getElementById('add-to-cart');

                favButton.style.display = 'block';
                addToCartButton.style.display = 'block';

                checkAndToggleFavoriteButton(sneaker);

                favButton.addEventListener('click', () => {
                    if (!userId || !token) {
                        alert('Veuillez vous connecter pour gérer les favoris.');
                        window.location.href = '/frontend/login.html'; // Redirige vers la page de connexion
                    } else {
                        toggleFavorite(sneaker);
                    }
                });

                addToCartButton.addEventListener('click', () => {
                    if (!userId || !token) {
                        alert('Veuillez vous connecter pour ajouter des articles au panier.');
                        window.location.href = '/frontend/login.html'; // Redirige vers la page de connexion
                    } else {
                        const selectedSize = document.getElementById('size').value;
                        const selectedColor = document.getElementById('color').value;
                        addToCart(sneaker, parseInt(document.getElementById('quantity').value), selectedSize, selectedColor);
                    }
                });

                // Initialiser le carrousel
                showSlide(currentSlideIndex);
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

    function checkAndToggleFavoriteButton(product) {
        fetch(`http://localhost:5500/users/${userId}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(favorites => {
            const alreadyFavorite = favorites.some(fav => fav.id === product.id);
            if (alreadyFavorite) {
                setFavoriteButtonState(true);
            } else {
                setFavoriteButtonState(false);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la vérification des favoris:', error);
        });
    }

    function setFavoriteButtonState(isFavorite) {
        const favButton = document.getElementById('fav-button');
        if (isFavorite) {
            favButton.classList.add('remove-fav');
            favButton.classList.remove('add-fav');
            favButton.innerHTML = '<img src="style/img/coeur_brise.png" alt="Retirer des favoris">';
        } else {
            favButton.classList.add('add-fav');
            favButton.classList.remove('remove-fav');
            favButton.innerHTML = '<img src="style/img/coeur.png" alt="Ajouter aux favoris">';
        }
    }

    function toggleFavorite(product) {
        const isRemoving = document.getElementById('fav-button').classList.contains('remove-fav');
        if (isRemoving) {
            removeFromFavorites(product);
        } else {
            addToFavorites(product);
        }
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
            setFavoriteButtonState(true);
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
            setFavoriteButtonState(false);
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du favori:', error);
        });
    }

    function addToCart(product, quantity, selectedSize, selectedColor) {
        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

        const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize && item.color === selectedColor);
        let price = product.reduction > 0 ? (product.price * (1 - product.reduction / 100)).toFixed(2) : product.price;

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ id: product.id, name: product.name, price, quantity, size: selectedSize, color: selectedColor });
        }

        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        
        alert(`${quantity} ${product.name} (${selectedSize}, ${selectedColor}) a été ajouté au panier.`);
    }
});

let currentSlideIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-inner img');
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (idx === index) slide.classList.add('active');
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-inner img');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-inner img');
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
}

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
