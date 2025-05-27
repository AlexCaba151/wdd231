// Chamber of Commerce JavaScript

// Toggle menu for mobile view
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn")
    const primaryNav = document.getElementById("primary-nav")
  
    if (hamburgerBtn && primaryNav) {
      hamburgerBtn.addEventListener("click", function () {
        primaryNav.classList.toggle("show")
        this.setAttribute("aria-expanded", this.getAttribute("aria-expanded") === "true" ? "false" : "true")
      })
    }
  
    // Set current year in footer
    const currentYearSpan = document.getElementById("current-year")
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear()
    }
  
    // Set last modified date in footer
    const lastModifiedSpan = document.getElementById("last-modified")
    if (lastModifiedSpan) {
      lastModifiedSpan.textContent = document.lastModified
    }
  
    // Directory page functionality
    const gridBtn = document.getElementById("grid-btn")
    const listBtn = document.getElementById("list-btn")
    const membersContainer = document.getElementById("members-container")
  
    if (gridBtn && listBtn && membersContainer) {
      // Toggle between grid and list views
      gridBtn.addEventListener("click", () => {
        membersContainer.classList.add("grid")
        membersContainer.classList.remove("list")
        gridBtn.classList.add("active")
        listBtn.classList.remove("active")
      })
  
      listBtn.addEventListener("click", () => {
        membersContainer.classList.add("list")
        membersContainer.classList.remove("grid")
        listBtn.classList.add("active")
        gridBtn.classList.remove("active")
      })
  
      // Fetch and display member data
      fetchMemberData()
    }
  })
  
  // Fetch member data from JSON file
  async function fetchMemberData() {
    try {
      const response = await fetch("data/members.json")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
  
      const data = await response.json()
      displayMembers(data)
    } catch (error) {
      console.error("Error fetching member data:", error)
      document.getElementById("members-container").innerHTML = `
              <div class="error-message">
                  <p>Unable to load member data. Please try again later.</p>
              </div>
          `
    }
  }
  
  // Display members in the container
  function displayMembers(data) {
    const membersContainer = document.getElementById("members-container")
  
    if (!membersContainer || !data || !Array.isArray(data)) {
      console.error("Invalid data or container not found")
      return
    }
  
    membersContainer.innerHTML = ""
  
    data.forEach((member) => {
      // Determine membership level text
      let levelText = "Member"
      let levelClass = ""
  
      if (member.membership === 2) {
        levelText = "Silver Member"
        levelClass = "silver"
      } else if (member.membership === 3) {
        levelText = "Gold Member"
        levelClass = "gold"
      }
  
      // Create member card
      const memberCard = document.createElement("div")
      memberCard.className = "member-card"
  
      memberCard.innerHTML = `
              <img src="images/${member.image}" alt="${member.name}" class="member-img">
              <div class="member-info">
                  <h3 class="member-name">${member.name}</h3>
                  <p class="member-address">${member.address}</p>
                  <p class="member-phone">${member.phone}</p>
                  <div class="member-website">
                      <a href="${member.website}" target="_blank">Visit Website</a>
                  </div>
                  <p class="member-level ${levelClass}">${levelText}</p>
              </div>
          `
  
      membersContainer.appendChild(memberCard)
    })
  }
  