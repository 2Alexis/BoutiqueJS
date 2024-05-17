document.addEventListener("DOMContentLoaded", () => {
    getSneakers(); // Appel de la fonction getSneakers dès que la page est chargée
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
genderFilter.addEventListener('change', getSneakers);
colorFilter.addEventListener('change', getSneakers);
sizeFilter.addEventListener('change', getSneakers);
reductionFilter.addEventListener('change', getSneakers);
availabilityFilter.addEventListener('change', getSneakers);
sortFilter.addEventListener('change', getSneakers);

// Modifier la fonction getSneakers pour prendre en compte les filtres et l'ordre de tri
function getSneakers() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Filtrer les données en fonction des filtres sélectionnés
            let filteredData = data.filter(sneaker => {
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
                    const isAvailable = availabilityFilter.value === 'true';
                    if (sneaker.quantity > 0 && isAvailable)
                        return false;
                    if (sneaker.quantity === 0 && !isAvailable)
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
            const sneakersContainer = document.getElementById('sneakers');
            sneakersContainer.innerHTML = ''; // Effacer le contenu précédent
            filteredData.forEach(sneaker => {
                // Créer des éléments de sneaker comme avant
                const sneakerDiv = document.createElement('div');
                sneakerDiv.classList.add('sneaker-item');

                const nameElement = document.createElement('h3');
                nameElement.textContent = sneaker.name;

                const priceElement = document.createElement('p');
                priceElement.textContent = `Prix: ${sneaker.price}$`;

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
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
        });
}