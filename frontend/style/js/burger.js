document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.getElementById('burger-icon');
    const dropdownContent = document.getElementById('dropdown-content');

    burgerIcon.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });

    // Fermer le menu si on clique en dehors
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.burger-icon')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });
});
