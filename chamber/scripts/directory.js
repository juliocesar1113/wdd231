// Member display with grid/list toggle

const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-btn");
const listButton = document.querySelector("#list-btn");
const membersURL = "data/members.json";

// ── Fetch & render members 

async function getMembers() {
  try {
    const response = await fetch(membersURL);
    if (!response.ok) throw new Error("Could not load members data.");
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error("Directory error:", error);
    membersContainer.innerHTML =
      `<p style="color:red;">Unable to load member data. Please try again later.</p>`;
  }
}

function getMembershipLabel(level) {
  if (level === 3) return { label: "Gold Member",   badgeClass: "badge-gold" };
  if (level === 2) return { label: "Silver Member", badgeClass: "badge-silver" };
  return               { label: "Member",           badgeClass: "badge-member" };
}

function displayMembers(members) {
  membersContainer.innerHTML = "";

  members.forEach(member => {
    const card = document.createElement("section");
    const { label, badgeClass } = getMembershipLabel(member.membership);

    card.innerHTML = `
      <img src="${member.image}" alt="${member.name} logo" loading="lazy">
      <h2>${member.name}</h2>
      <p>${member.description}</p>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
      <span class="membership-badge ${badgeClass}">${label}</span>
    `;

    membersContainer.appendChild(card);
  });
}

// ── View toggle 

function setView(view) {
  if (view === "grid") {
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
    gridButton.classList.add("active");
    listButton.classList.remove("active");
    localStorage.setItem("directoryView", "grid");
  } else {
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
    listButton.classList.add("active");
    gridButton.classList.remove("active");
    localStorage.setItem("directoryView", "list");
  }
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));

// Restore last used view 
const savedView = localStorage.getItem("directoryView") || "grid";
setView(savedView);

getMembers();
