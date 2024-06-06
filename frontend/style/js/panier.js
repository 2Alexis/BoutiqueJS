document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');
    const addressContainer = document.getElementById('address-container');
    const saveAddressButton = document.getElementById('save-address');
    const savedAddressesSelect = document.getElementById('saved-addresses');
    const confirmOrderButton = document.getElementById('confirm-order');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        alert('Veuillez vous connecter pour accéder à votre panier.');
        window.location.href = '/frontend/login.html'; // Redirige vers la page de connexion
        return;
    }

    // Initialisez Stripe avec votre clé publique
    const stripe = Stripe('pk_test_51PLh8v2KLjIvfFirAcho7Nqb1oMOnLD5YsEvK1seTabDTMZ5dBxxcJVGMITjUrjkVVaUSIs3dM3tNOROT3mZEX4E005rxibNSr');

    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem(`cart_${userId}`);
        renderCart([]);
    });

    checkoutButton.addEventListener('click', () => {
        addressContainer.style.display = 'block';
    });

    confirmOrderButton.addEventListener('click', () => {
        const selectedAddress = savedAddressesSelect.value;

        if (!selectedAddress) {
            alert('Veuillez sélectionner une adresse de livraison');
            return;
        }

        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

        fetch(`http://localhost:5500/users/${userId}/cart/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: JSON.parse(selectedAddress), cart })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            if (data.id) {
                clearCart(); // Clear the cart after successful order
                stripe.redirectToCheckout({ sessionId: data.id });
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la commande:', error);
            alert('Erreur lors de la commande: ' + error.message);
        });
    });

    saveAddressButton.addEventListener('click', () => {
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postalCode = document.getElementById('postal-code').value;
        const country = document.getElementById('country').value;

        if (address && city && postalCode && country) {
            let addresses = JSON.parse(localStorage.getItem(`addresses_${userId}`)) || [];
            const newAddress = { address, city, postalCode, country };
            addresses.push(newAddress);
            localStorage.setItem(`addresses_${userId}`, JSON.stringify(addresses));
            populateSavedAddresses();
            alert('Adresse enregistrée avec succès');
        } else {
            alert('Veuillez remplir tous les champs');
        }
    });

    function populateSavedAddresses() {
        let addresses = JSON.parse(localStorage.getItem(`addresses_${userId}`)) || [];
        savedAddressesSelect.innerHTML = '<option value="">Sélectionnez une adresse</option>';
        addresses.forEach((addr, index) => {
            const option = document.createElement('option');
            option.value = JSON.stringify(addr);
            option.textContent = `${addr.address}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
            savedAddressesSelect.appendChild(option);
        });
    }

    function clearCart() {
        localStorage.removeItem(`cart_${userId}`);
        renderCart([]);
    }

    populateSavedAddresses();
    renderCart();

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
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
                    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
                    renderCart();
                });

                const decreaseButton = document.createElement('button');
                decreaseButton.textContent = '-';
                decreaseButton.addEventListener('click', () => {
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
                        renderCart();
                    }
                });

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Supprimer';
                removeButton.addEventListener('click', () => {
                    cart.splice(index, 1);
                    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
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
