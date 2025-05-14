// Navigation JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    // Toggle menu on hamburger button click
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        primaryNav.classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!hamburgerBtn.contains(event.target) && !primaryNav.contains(event.target)) {
            hamburgerBtn.classList.remove('open');
            primaryNav.classList.remove('open');
        }
    });
    
    // Close menu when window is resized to larger view
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            hamburgerBtn.classList.remove('open');
            primaryNav.classList.remove('open');
        }
    });
    
    // Add active class to current page link
    const navLinks = document.querySelectorAll('#primary-nav a');
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if ((currentPage === '' || currentPage === 'index.html') && link.getAttribute('href') === '#') {
            link.classList.add('active');
        } else if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});