document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sneakerId = urlParams.get('id');

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
                document.getElementById('sneaker-description').textContent = `Description: ${sneaker.description}`;
                
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
                    addToFavorites(sneaker);
                });

                removeFromFavoritesButton.addEventListener('click', () => {
                    removeFromFavorites(sneaker);
                });

                addToCartButton.addEventListener('click', () => {
                    addToCart(sneaker, parseInt(document.getElementById('quantity').value));
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

    function addToFavorites(sneaker) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
     
        const isAlreadyFavorite = favorites.some(item => item.id === sneaker.id);
        if (!isAlreadyFavorite) {
            favorites.push(sneaker);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('La sneaker a été ajoutée aux favoris.');
        } else {
            alert('Cette sneaker est déjà dans vos favoris.');
        }
    }
    
    function removeFromFavorites(sneaker) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(item => item.id !== sneaker.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('La sneaker a été retirée des favoris.');
    }

    function addToCart(sneaker, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cart.findIndex(item => item.id === sneaker.id);
        let price = sneaker.reduction > 0 ? (sneaker.price * (1 - sneaker.reduction / 100)).toFixed(2) : sneaker.price;

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ id: sneaker.id, name: sneaker.name, price, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert(`${quantity} ${sneaker.name} a été ajouté au panier.`);
    }
});
