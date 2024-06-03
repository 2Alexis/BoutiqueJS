document.addEventListener("DOMContentLoaded", () => {
    getSneakers(); // Appel de la fonction getSneakers dès que la page est chargée
    addSearchEventHandler(); // Ajouter l'écouteur d'événement pour la barre de recherche
});

const url = "http://localhost:5500/sneakers";

// Ajouter des constantes pour les filtres
const genderFilter = document.getElementById('gender-filter');
const colorFilter = document.getElementById('color-filter');
const sizeFilter = document.getElementById('size-filter');
const reductionFilter = document.getElementById('reduction-filter');
const availabilityFilter = document.getElementById('availability-filter');
const sortFilter = document.getElementById('sort-filter');

// Ajouter des écouteurs d'événements pour détecter les changements de filtres
genderFilter.addEventListener('change', () => getSneakers());
colorFilter.addEventListener('change', () => getSneakers());
sizeFilter.addEventListener('change', () => getSneakers());
reductionFilter.addEventListener('change', () => getSneakers());
availabilityFilter.addEventListener('change', () => getSneakers());
sortFilter.addEventListener('change', () => getSneakers());

function addSearchEventHandler() {
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        getSneakers(query);
    });
}

// Modifier la fonction getSneakers pour prendre en compte les filtres et l'ordre de tri
function getSneakers(query = '') {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Filtrer les données en fonction des filtres sélectionnés
            let filteredData = data.filter(sneaker => {
                // Filtrer par terme de recherche
                if (query && !sneaker.name.toLowerCase().includes(query) && !sneaker.colors.toLowerCase().includes(query))
                    return false;
                
                // Filtrer par sexe
                if (genderFilter.value !== 'all' && sneaker.sex.toLowerCase() !== genderFilter.value)
                    return false;
                
                // Filtrer par couleur
                if (colorFilter.value !== 'all' && !sneaker.colors.toLowerCase().includes(colorFilter.value))
                    return false;
                
                // Filtrer par taille
                if (sizeFilter.value !== 'all' && !sneaker.sizes.includes(sizeFilter.value))
                    return false;
                
                // Filtrer par réduction
                if (reductionFilter.value !== 'all') {
                    const hasReduction = reductionFilter.value === 'true';
                    if (sneaker.reduction === 0 && hasReduction)
                        return false;
                    if (sneaker.reduction > 0 && !hasReduction)
                        return false;
                }
                
                // Filtrer par disponibilité
                if (availabilityFilter.value !== 'all') {
                    const isAvailable = availabilityFilter.value === '1';
                    if ((isAvailable && sneaker.availability === 0) || (!isAvailable && sneaker.availability === 1))
                        return false;
                }
                return true; // Conserver les sneakers qui passent tous les filtres
            });

            // Trier les données en fonction de l'ordre sélectionné
            if (sortFilter.value === 'price-asc') {
                filteredData.sort((a, b) => a.price - b.price);
            } else if (sortFilter.value === 'price-desc') {
                filteredData.sort((a, b) => b.price - a.price);
            }

            // Afficher les sneakers filtrées et triées
            displaySneakers(filteredData);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
        });
}

function displaySneakers(sneakersData) {
    const sneakersContainer = document.getElementById('sneakers');
    sneakersContainer.innerHTML = ''; // Effacer le contenu précédent
    sneakersData.forEach(sneaker => {
        const sneakerDiv = document.createElement('div');
        sneakerDiv.classList.add('sneaker-item');
        if (sneaker.availability === 0) {
            sneakerDiv.classList.add('unavailable');
        }

        const nameElement = document.createElement('h3');
        nameElement.textContent = sneaker.name;

        let priceText = `Prix: ${sneaker.price}$`;
        if (sneaker.reduction > 0) {
            const discountedPrice = (sneaker.price * (1 - sneaker.reduction / 100)).toFixed(2);
            priceText = `Prix: <span class="original-price">${sneaker.price}$</span> <span class="discounted-price">${discountedPrice}$</span>`;
        }

        const priceElement = document.createElement('p');
        priceElement.innerHTML = priceText;

        const imageUrls = sneaker.image_urls.split(',');

        // Boucler à travers toutes les images de la sneaker
        imageUrls.forEach(imageUrl => {
            // Créer un élément d'image pour chaque image
            const imgElement = document.createElement('img');
            imgElement.src = `style/img/${imageUrl.trim()}`; // Utiliser le chemin de l'image
            imgElement.alt = sneaker.name;

            sneakerDiv.appendChild(nameElement);
            sneakerDiv.appendChild(priceElement);
            sneakerDiv.appendChild(imgElement);
        });

        // Ajout de l'écouteur d'événement sur le div de la chaussure
        sneakerDiv.addEventListener("click", () => {
            window.location.href = `detail.html?id=${sneaker.id}`;
        });

        sneakersContainer.appendChild(sneakerDiv);
    });
}
