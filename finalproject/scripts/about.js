// About page functionality

// DOM elements
const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  setupContactForm();
});

// Setup contact form
function setupContactForm() {
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const submissionData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    timestamp: new Date().toISOString(),
  };

  // Store form data in localStorage
  localStorage.setItem("contactFormSubmission", JSON.stringify(submissionData));

  // Show success message
  contactForm.classList.add("hidden");
  formSuccess.classList.remove("hidden");

  // Reset form and redirect after 3 seconds
  setTimeout(() => {
    window.location.href = "form-action.html";
  }, 3000);
}