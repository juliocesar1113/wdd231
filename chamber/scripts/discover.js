// discover.js — Render attraction cards + last visit message

import { places } from "../data/places.mjs";

// ── Render Cards ───
const grid = document.querySelector("#discover-grid");

places.forEach((place, i) => {
  const card = document.createElement("article");
  card.classList.add("discover-card");
  card.setAttribute("data-area", `card${i + 1}`);

  card.innerHTML = `
    <h2>${place.name}</h2>
    <figure>
      <img src="${place.image}" alt="${place.name}" loading="lazy" width="300" height="200">
    </figure>
    <address>${place.address}</address>
    <p>${place.description}</p>
    <button class="learn-more-btn" type="button">Learn More</button>
  `;

  grid.appendChild(card);
});

// ── Visit Message ───

const messageEl = document.querySelector("#visit-message");
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const lastVisit = localStorage.getItem("discoverLastVisit");
const now = Date.now();

if (!lastVisit) {
  messageEl.textContent = "Welcome! Let us know if you have any questions.";
} else {
  const daysSince = Math.floor((now - Number(lastVisit)) / MS_PER_DAY);

  if (daysSince < 1) {
    messageEl.textContent = "Back so soon! Awesome!";
  } else {
    const dayWord = daysSince === 1 ? "day" : "days";
    messageEl.textContent = `You last visited ${daysSince} ${dayWord} ago.`;
  }
}

localStorage.setItem("discoverLastVisit", now);
