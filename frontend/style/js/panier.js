document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');
    const addressContainer = document.getElementById('address-container');
    const saveAddressButton = document.getElementById('save-address');
    const savedAddressesSelect = document.getElementById('saved-addresses');
    const confirmOrderButton = document.getElementById('confirm-order');

    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        renderCart([]);
    });

    checkoutButton.addEventListener('click', () => {
        addressContainer.style.display = 'block';
    });

    confirmOrderButton.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const selectedAddress = savedAddressesSelect.value;

        if (cart.length === 0) {
            alert('Le panier est vide');
            return;
        }

        if (!selectedAddress) {
            alert('Veuillez sélectionner une adresse de livraison');
            return;
        }

        fetch('http://localhost:5500/orders/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart, address: JSON.parse(selectedAddress) })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            }
            localStorage.removeItem('cart');
            renderCart([]);
            addressContainer.style.display = 'none';
        })
        .catch(error => {
            console.error('Erreur lors de la commande:', error);
            alert('Erreur lors de la commande');
        });
    });

    saveAddressButton.addEventListener('click', () => {
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postalCode = document.getElementById('postal-code').value;
        const country = document.getElementById('country').value;

        if (address && city && postalCode && country) {
            let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
            const newAddress = { address, city, postalCode, country };
            addresses.push(newAddress);
            localStorage.setItem('addresses', JSON.stringify(addresses));
            populateSavedAddresses();
            alert('Adresse enregistrée avec succès');
        } else {
            alert('Veuillez remplir tous les champs');
        }
    });

    function populateSavedAddresses() {
        let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        savedAddressesSelect.innerHTML = '<option value="">Sélectionnez une adresse</option>';
        addresses.forEach((addr, index) => {
            const option = document.createElement('option');
            option.value = JSON.stringify(addr);
            option.textContent = `${addr.address}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
            savedAddressesSelect.appendChild(option);
        });
    }

    populateSavedAddresses();

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
