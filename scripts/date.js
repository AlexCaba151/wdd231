// Date JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Set current year for copyright
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
    
    // Set last modified date
    document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;
});