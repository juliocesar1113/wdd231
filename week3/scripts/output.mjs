export function setTitle(course) {
  const courseName = document.querySelector("#courseName");
  courseName.textContent = `${course.code} ${course.number}: ${course.title}`;
}

export function renderSections(sections) {
  const html = sections.map(
    (section) => `
      <tr>
        <td>${section.sectionNum}</td>
        <td>${section.roomNum}</td>
        <td>${section.enrolled}</td>
        <td>${section.days}</td>
        <td>${section.instructor}</td>
      </tr>
    `
  );

  document.querySelector("#sections").innerHTML = html.join("");
}