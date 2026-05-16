const url = "data/members.json";
const cards = document.querySelector("#members");

async function getMembers() {
  const response = await fetch(url);
  const data = await response.json();

  displayMembers(data);
}

const displayMembers = (members) => {
  cards.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("section");

    let membershipLabel = "";

    if (member.membership === 1) {
      membershipLabel = "Member";
    } else if (member.membership === 2) {
      membershipLabel = "Silver";
    } else {
      membershipLabel = "Gold";
    }

    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}" loading="lazy">
      <h2>${member.name}</h2>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <p>${membershipLabel} Membership</p>
      <p>${member.description}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
    `;

    cards.appendChild(card);
  });
};

getMembers();

const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

gridButton.addEventListener("click", () => {
  cards.classList.add("grid");
  cards.classList.remove("list");
});

listButton.addEventListener("click", () => {
  cards.classList.add("list");
  cards.classList.remove("grid");
});