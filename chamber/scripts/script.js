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

  // Home page functionality
  const eventsContainer = document.getElementById("events-container")
  const weatherContainer = document.getElementById("weather-container")
  const spotlightsContainer = document.getElementById("spotlights-container")

  // Check if we're on the home page
  if (eventsContainer || weatherContainer || spotlightsContainer) {
    // Load home page content
    loadEvents()
    loadWeather()
    loadSpotlights()
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

// HOME PAGE FUNCTIONALITY

// Sample events data
const eventsData = [
  {
    title: "Annual Business Expo",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Cityville Convention Center",
    description: "Join us for our biggest networking event of the year featuring local businesses and vendors.",
  },
  {
    title: "Monthly Networking Breakfast",
    date: "March 8, 2024",
    time: "7:30 AM - 9:00 AM",
    location: "Main Street Cafe",
    description: "Connect with fellow business owners over breakfast and coffee.",
  },
]

// Weather icons mapping
const weatherIcons = {
  clear: "☀️",
  clouds: "☁️",
  rain: "🌧️",
  snow: "❄️",
  thunderstorm: "⛈️",
  drizzle: "🌦️",
  mist: "🌫️",
  default: "☁️",
}

// Load events
function loadEvents() {
  const eventsContainer = document.getElementById("events-container")
  if (!eventsContainer) return

  eventsContainer.innerHTML = ""

  eventsData.forEach((event) => {
    const eventElement = document.createElement("div")
    eventElement.className = "event-item"
    eventElement.innerHTML = `
      <div class="event-title">${event.title}</div>
      <div class="event-details">
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
      </div>
    `
    eventsContainer.appendChild(eventElement)
  })
}

// Load weather data
async function loadWeather() {
  const weatherContainer = document.getElementById("weather-container")
  const currentTempElement = document.getElementById("current-temp")
  const weatherDescElement = document.getElementById("weather-description")
  const weatherIconElement = document.getElementById("weather-icon")
  const forecastContainer = document.getElementById("forecast-container")

  if (!weatherContainer) return

  try {
    // In a real implementation, you would use:
    // const API_KEY = 'your_openweathermap_api_key';
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Cityville&appid=${API_KEY}&units=imperial`);

    // For demo purposes, using mock data
    const weatherData = await getMockWeatherData()

    // Update current weather
    if (currentTempElement) currentTempElement.textContent = `${weatherData.current.temperature}°F`
    if (weatherDescElement) weatherDescElement.textContent = weatherData.current.description
    if (weatherIconElement) weatherIconElement.textContent = getWeatherIcon(weatherData.current.icon)

    // Update forecast
    if (forecastContainer) {
      forecastContainer.innerHTML = ""
      weatherData.forecast.forEach((day) => {
        const forecastElement = document.createElement("div")
        forecastElement.className = "forecast-item"
        forecastElement.innerHTML = `
          <span class="forecast-day">${day.day}</span>
          <div class="forecast-weather">
            <span class="forecast-icon">${getWeatherIcon(day.icon)}</span>
            <span class="forecast-temps">${day.high}°/${day.low}°</span>
          </div>
        `
        forecastContainer.appendChild(forecastElement)
      })
    }
  } catch (error) {
    console.error("Error loading weather:", error)
    if (weatherDescElement) weatherDescElement.textContent = "Weather unavailable"
  }
}

// Mock weather data (replace with real API call)
async function getMockWeatherData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        current: {
          temperature: Math.floor(Math.random() * 30) + 60, // Random temp 60-90
          description: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
          icon: "clouds",
        },
        forecast: [
          { day: "Today", high: 75, low: 58, icon: "clouds" },
          { day: "Tomorrow", high: 78, low: 62, icon: "clear" },
          { day: "Friday", high: 71, low: 55, icon: "rain" },
        ],
      })
    }, 1000)
  })
}

// Get weather icon
function getWeatherIcon(iconCode) {
  return weatherIcons[iconCode] || weatherIcons.default
}

// Load member spotlights
async function loadSpotlights() {
  const spotlightsContainer = document.getElementById("spotlights-container")
  if (!spotlightsContainer) return

  try {
    const response = await fetch("data/members.json")
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const members = await response.json()

    // Filter for gold and silver members only
    const goldSilverMembers = members.filter((member) => member.membership >= 2)

    // Randomly select 2-3 members
    const shuffled = goldSilverMembers.sort(() => 0.5 - Math.random())
    const selectedMembers = shuffled.slice(0, 3)

    spotlightsContainer.innerHTML = ""

    selectedMembers.forEach((member) => {
      const membershipInfo = getMembershipLevel(member.membership)

      const spotlightElement = document.createElement("div")
      spotlightElement.className = "spotlight-card"
      spotlightElement.innerHTML = `
        <img src="images/${member.image}" alt="${member.name}" class="spotlight-image">
        <div class="spotlight-content">
          <div class="spotlight-header">
            <h4 class="spotlight-name">${member.name}</h4>
            <span class="membership-badge ${membershipInfo.class}">${membershipInfo.text}</span>
          </div>
          <div class="spotlight-details">
            <p>📍 ${member.address}</p>
            <p>📞 ${member.phone}</p>
          </div>
          <p class="spotlight-description">${member.description}</p>
          <a href="${member.website}" target="_blank" class="spotlight-website">
            🌐 Visit Website
          </a>
        </div>
      `
      spotlightsContainer.appendChild(spotlightElement)
    })
  } catch (error) {
    console.error("Error loading member spotlights:", error)
    spotlightsContainer.innerHTML = `
      <div class="error">
        <p>Unable to load member spotlights. Please try again later.</p>
      </div>
    `
  }
}

// Get membership level info
function getMembershipLevel(level) {
  switch (level) {
    case 3:
      return { text: "Gold Member", class: "gold" }
    case 2:
      return { text: "Silver Member", class: "silver" }
    default:
      return { text: "Member", class: "" }
  }
}

// Real weather API function (commented out for demo)
/*
async function fetchRealWeatherData() {
  const API_KEY = 'your_openweathermap_api_key';
  const city = 'Cityville'; // Replace with your city
  
  try {
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
    );
    const currentData = await currentResponse.json();
    
    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
    );
    const forecastData = await forecastResponse.json();
    
    return {
      current: {
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].main.toLowerCase()
      },
      forecast: forecastData.list.slice(0, 3).map((item, index) => ({
        day: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        icon: item.weather[0].main.toLowerCase()
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
*/
