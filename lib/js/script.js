const sectionNames = ['tous', 'electronique', 'vetement', 'voiture', 'maison'];

function setSection(selected) {
  sectionNames.forEach(name => {
    document.querySelectorAll(`.${name}`).forEach(el => {
      el.classList.add('rm');
      el.classList.remove('active');
    });
  });
  document.querySelectorAll(`.${selected}`).forEach(el => {
    el.classList.remove('rm');
    el.classList.add('active');
  });
}
