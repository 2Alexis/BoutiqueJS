document.addEventListener("DOMContentLoaded", () => {
    const favoritesList = document.getElementById('favorites-list');

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        const noFavoritesParagraph = document.createElement('p');
        noFavoritesParagraph.textContent = "Aucun favori trouvé.";
        favoritesList.appendChild(noFavoritesParagraph);
    } else {
        favorites.forEach((sneaker, index) => {
            const sneakerElement = document.createElement('div');
            sneakerElement.classList.add('sneaker-fav-item');

            
            const sneakerInfo = document.createElement('div');
            sneakerInfo.classList.add('sneaker-fav-info');

           
            const sneakerName = document.createElement('h3');
            sneakerName.textContent = sneaker.name;
            sneakerInfo.appendChild(sneakerName);

            const priceParagraph = document.createElement('p');
            priceParagraph.textContent = `Prix: ${sneaker.price}$`;
            sneakerInfo.appendChild(priceParagraph);
            
            const colorsParagraph = document.createElement('p');
            colorsParagraph.textContent = `Couleurs: ${sneaker.colors}`;
            sneakerInfo.appendChild(colorsParagraph);
            
            const reductionParagraph = document.createElement('p');
            reductionParagraph.textContent = `Réduction: ${sneaker.reduction}%`;
            sneakerInfo.appendChild(reductionParagraph);
            
            const availableParagraph = document.createElement('p');
            availableParagraph.textContent = `Disponible: ${sneaker.available ? 'Oui' : 'Non'}`;
            sneakerInfo.appendChild(availableParagraph);

         


            sneakerElement.appendChild(sneakerInfo);
            sneaker.image_urls.split(',').forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = `style/img/${imageUrl.trim()}`;
                
                sneakerElement.appendChild(img);
            });
            const sneakerBtn = document.createElement('div');
            sneakerBtn.classList.add('sneaker-btn');
            
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-from-favorites');
            removeButton.setAttribute('data-index', index);
            
            const removeButtonImg = document.createElement('img');
            removeButtonImg.src = "style/img/coeur_brise.png";
            removeButton.appendChild(removeButtonImg);
            
            sneakerBtn.appendChild(removeButton);
            sneakerElement.appendChild(sneakerBtn);

            favoritesList.appendChild(sneakerElement);

            removeButton.addEventListener('click', () => {
                favorites.splice(index, 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                sneakerElement.remove();

            });
        });
    }

    const clearFavoritesButton = document.getElementById('clear-favorites');
    clearFavoritesButton.addEventListener('click', () => {
        localStorage.removeItem('favorites');
        favoritesList.innerHTML = ""; // Supprime tous les enfants de favoritesList
        const noFavoritesParagraph = document.createElement('p');
        noFavoritesParagraph.textContent = "Les favoris ont été effacés.";
        favoritesList.appendChild(noFavoritesParagraph);
    });
}); 