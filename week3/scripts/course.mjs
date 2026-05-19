const byuiCourse = {
  code: "WDD",
  number: 231,
  title: "Frontend Web Development I",
  sections: [
    {
      sectionNum: 1,
      roomNum: "STC 353",
      enrolled: 26,
      days: "TTh",
      instructor: "Bro T",
    },
    {
      sectionNum: 2,
      roomNum: "STC 347",
      enrolled: 28,
      days: "TTh",
      instructor: "Sis A",
    },
  ],

  changeEnrollment(sectionNum, add = true) {
    const section = this.sections.find(
      (section) => section.sectionNum === sectionNum
    );

    if (section) {
      if (add) {
        section.enrolled++;
      } else {
        section.enrolled--;
      }
    }
  },
};

export default byuiCourse;