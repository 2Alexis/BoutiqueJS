document.addEventListener("DOMContentLoaded", () => {
    const favoritesList = document.getElementById('favorites-list');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId) {
        alert('Utilisateur non identifié');
        return;
    }

    fetch(`http://localhost:5500/users/${userId}/favorites`)
        .then(response => response.json())
        .then(favorites => {
            if (favorites.length === 0) {
                const noFavoritesParagraph = document.createElement('p');
                noFavoritesParagraph.textContent = "Aucun favori trouvé.";
                favoritesList.appendChild(noFavoritesParagraph);
            } else {
                favorites.forEach((product, index) => {
                    const productElement = document.createElement('div');
                    productElement.classList.add('sneaker-fav-item');

                    const productInfo = document.createElement('div');
                    productInfo.classList.add('sneaker-fav-info');
                    const productName = document.createElement('h3');
                    productName.textContent = product.name;
                    productInfo.appendChild(productName);

                    const priceParagraph = document.createElement('p');
                    priceParagraph.textContent = `Prix: ${product.price}$`;
                    productInfo.appendChild(priceParagraph);

                    const colorsParagraph = document.createElement('p');
                    colorsParagraph.textContent = `Couleurs: ${product.colors}`;
                    productInfo.appendChild(colorsParagraph);

                    const reductionParagraph = document.createElement('p');
                    reductionParagraph.textContent = `Réduction: ${product.reduction}%`;
                    productInfo.appendChild(reductionParagraph);

                    const availableParagraph = document.createElement('p');
                    availableParagraph.textContent = `Disponible: ${product.availability ? 'Oui' : 'Non'}`;
                    productInfo.appendChild(availableParagraph);

                    productElement.appendChild(productInfo);
                    product.image_urls.split(',').forEach(imageUrl => {
                        const img = document.createElement('img');
                        img.src = `style/img/${imageUrl.trim()}`;
                        img.alt = 'Sneaker';
                        img.classList.add('sneaker-img');
                        productElement.appendChild(img);
                    });

                    const productBtn = document.createElement('div');
                    productBtn.classList.add('sneaker-btn-container');

                    const removeButton = document.createElement('button');
                    removeButton.classList.add('btn', 'remove-from-favorites');
                    removeButton.setAttribute('data-index', index);
                    removeButton.textContent = 'Retirer des favoris';

                    const addToCartButton = document.createElement('button');
                    addToCartButton.classList.add('btn', 'add-to-cart');
                    addToCartButton.textContent = 'Ajouter au panier';
                    addToCartButton.addEventListener('click', () => {
                        addToCart(product, 1);
                    });

                    productBtn.appendChild(removeButton);
                    productBtn.appendChild(addToCartButton);
                    productElement.appendChild(productBtn);
                    favoritesList.appendChild(productElement);

                    removeButton.addEventListener('click', () => {
                        fetch(`http://localhost:5500/users/${userId}/favorites/${product.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(() => {
                            productElement.remove();
                        })
                        .catch(error => console.error('Erreur lors de la suppression du favori:', error));
                    });
                });
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des favoris:', error));

    const clearFavoritesButton = document.getElementById('clear-favorites');
    clearFavoritesButton.addEventListener('click', () => {
        fetch(`http://localhost:5500/users/${userId}/favorites`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            favoritesList.innerHTML = ""; // Supprime tous les enfants de favoritesList
            const noFavoritesParagraph = document.createElement('p');
            noFavoritesParagraph.textContent = "Les favoris ont été effacés.";
            favoritesList.appendChild(noFavoritesParagraph);
        })
        .catch(error => console.error('Erreur lors de la suppression des favoris:', error));
    });

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
