// Import modules
import { showLoading, hideLoading } from './utils.js';

// Form action page functionality

// DOM elements
const formData = document.getElementById("form-data");

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadSubmissionData();
});

// Load submission data
async function loadSubmissionData() {
  try {
    showLoading("loading-spinner");

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = localStorage.getItem("contactFormSubmission");

    hideLoading("loading-spinner");

    if (data) {
      const submissionData = JSON.parse(data);
      renderSubmissionData(submissionData);
    } else {
      renderNoData();
    }
  } catch (error) {
    console.error("Error loading submission data:", error);
    hideLoading("loading-spinner");
    renderNoData();
  }
}

// Render submission data
function renderSubmissionData(data) {
  if (!formData) return;

  formData.innerHTML = `
    <div class="form-data-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <div class="form-data-content">
        <h3>Name</h3>
        <p>${data.name}</p>
      </div>
    </div>
    
    <div class="form-data-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
      <div class="form-data-content">
        <h3>Email</h3>
        <p>${data.email}</p>
      </div>
    </div>
    
    <div class="form-data-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <div class="form-data-content">
        <h3>Message</h3>
        <p>${data.message}</p>
      </div>
    </div>
    
    <div class="form-data-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <path d="M3 10h18"></path>
      </svg>
      <div class="form-data-content">
        <h3>Submitted</h3>
        <p>${new Date(data.timestamp).toLocaleString()}</p>
      </div>
    </div>
  `;
}

// Render no data state
function renderNoData() {
  if (!formData) return;

  formData.innerHTML = `
    <div class="text-center" style="padding: 2rem;">
      <p style="color: #9ca3af; margin-bottom: 1rem;">No form submission data found.</p>
      <a href="about.html" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        Back to About
      </a>
    </div>
  `;
}