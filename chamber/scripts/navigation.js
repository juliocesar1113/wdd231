// Shared mobile menu toggle

const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("open");
    navigation.classList.toggle("open");
  });

  // Close nav when a link is clicked
  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuButton.classList.remove("open");
      navigation.classList.remove("open");
    });
  });
}