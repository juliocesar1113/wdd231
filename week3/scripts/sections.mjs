export function setSectionSelection(sections) {
  const sectionSelect = document.querySelector("#sectionNumber");

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.sectionNum;
    option.textContent = `Section ${section.sectionNum}`;
    sectionSelect.appendChild(option);
  });
}