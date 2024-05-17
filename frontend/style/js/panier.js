document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');

    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        renderCart([]);
    });

    checkoutButton.addEventListener('click', () => {
        // Ajoutez ici le code pour passer la commande
        alert('Commande passée avec succès!');
        localStorage.removeItem('cart');
        renderCart([]);
    });

    renderCart();

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = 0; // Initialisation du prix total

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Le panier est vide.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                const itemName = document.createElement('h3');
                itemName.textContent = item.name;

                const totalPriceForItem = item.price * item.quantity; // Calcul du prix total pour cet item
                const itemInfo = document.createElement('p');
                itemInfo.textContent = `Prix unitaire: ${item.price}$ | Quantité: ${item.quantity} | Prix total: ${totalPriceForItem}$`;

                totalPrice += totalPriceForItem; // Ajout du prix total de cet item au prix total global

                const increaseButton = document.createElement('button');
                increaseButton.textContent = '+';
                increaseButton.addEventListener('click', () => {
                    cart[index].quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                });

                const decreaseButton = document.createElement('button');
                decreaseButton.textContent = '-';
                decreaseButton.addEventListener('click', () => {
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCart();
                    }
                });

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Supprimer';
                removeButton.addEventListener('click', () => {
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                });

                cartItemDiv.appendChild(itemName);
                cartItemDiv.appendChild(itemInfo);
                cartItemDiv.appendChild(increaseButton);
                cartItemDiv.appendChild(decreaseButton);
                cartItemDiv.appendChild(removeButton);

                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        // Affichage du prix total global
        const totalDiv = document.createElement('div');
        totalDiv.classList.add('total');
        totalDiv.textContent = `Total: ${totalPrice}$`;
        cartItemsContainer.appendChild(totalDiv);
    }
});