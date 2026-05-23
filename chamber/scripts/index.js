// Home page: weather API 

// ── Weather 

const API_KEY = "3c8debc4269393e411bf3816e73eb639"; // OpenWeatherMap key
const LAT = 40.2969;
const LON = -111.6946;
const WEATHER_URL =
  `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;

async function getWeather() {
  const tempEl    = document.querySelector("#current-temp");
  const descEl    = document.querySelector("#weather-desc");
  const forecastEl = document.querySelector("#forecast");

  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) throw new Error("Weather data unavailable.");
    const data = await response.json();

    // Current conditions 
    const current = data.list[0];
    tempEl.textContent = `${Math.round(current.main.temp)}°F`;
    descEl.textContent = current.weather[0].description;

    // 3-day forecast 
    forecastEl.innerHTML = "";
    const noonEntries = data.list
      .filter(item => item.dt_txt.includes("12:00:00"))
      .slice(0, 3);

    noonEntries.forEach(entry => {
      const date = new Date(entry.dt_txt);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      const temp = Math.round(entry.main.temp);

      const item = document.createElement("div");
      item.classList.add("forecast-item");
      item.innerHTML = `
        <span class="forecast-day">${day}</span>
        <span class="forecast-temp">${temp}°F</span>
      `;
      forecastEl.appendChild(item);
    });

  } catch (error) {
    console.error("Weather error:", error);
    tempEl.textContent = "Weather unavailable";
  }
}

// ── Member Spotlights 

const MEMBERS_URL = "data/members.json";

async function getSpotlights() {
  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) throw new Error("Could not load members data.");
    const members = await response.json();
    displaySpotlights(members);
  } catch (error) {
    console.error("Spotlights error:", error);
  }
}

function displaySpotlights(members) {
  const container = document.querySelector("#spotlight-cards");
  container.innerHTML = "";

  // Only gold (3) and silver (2) members qualify
  const eligible = members.filter(m => m.membership >= 2);

  // Shuffle and pick up to 3
  const picks = eligible
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  picks.forEach(member => {
    const card = document.createElement("section");
    card.classList.add("spotlight-card");

    const levelLabel = member.membership === 3 ? "Gold Member" : "Silver Member";
    const badgeClass = member.membership === 3 ? "badge-gold" : "badge-silver";

    card.innerHTML = `
      <img src="${member.image}" alt="${member.name} logo" loading="lazy">
      <h3>${member.name}</h3>
      <p>${member.phone}</p>
      <p>${member.address}</p>
      <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
      <span class="membership-badge ${badgeClass}">${levelLabel}</span>
    `;

    container.appendChild(card);
  });
}

// ── Init 

getWeather();
getSpotlights();
