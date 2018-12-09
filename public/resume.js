console.log('dhfjksd')

const avatar = document.querySelector('.avatar');
const name = document.querySelector('.name');
const contactInfo = document.querySelector('.contact-info');
const email = document.querySelector('.contact');
const description = document.querySelector('.description');
const techStack = document.querySelector('.tech-stack');
const projects = document.querySelector('.projects');
const star_count = document.querySelector('.star_count');
const input = document.querySelector('.url');
const languageList = document.querySelector('.lang-list');
const allLngsHeading = document.querySelector('.all-lngs');
const loadingElem = document.querySelector('.loading');
const colorInput = document.querySelector('input[type=color]');
const colorVariable = '--color';

const pageLoad = () => {
  loadingElem.style.display = 'block';
  setTimeout(() => renderContact(), 2000);
}

pageLoad();

// colorInput.addEventListener('change', e => {
//   document.documentElement.style.setProperty(colorVariable, e.target.value)
// })

//filtering projects by clickable language
let repos = [];
let clickedLng = '';

const filterProject = (clickedLng) => {
  return clickedLng === '' ? repos :
    repos
      .filter(project => project.language === clickedLng)
}

const formatProjectName = (projectName) => {
  return projectName.split(/[-_]+/).map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  })
}

const renderProjects = () => {
  // increase star(font) size to the pt of num of stars
  projects.innerHTML = filterProject(clickedLng).map(project => `
    <div class="tile" onClick="window.open('', '_new').location.href='${project.link}';">
      <h3 style="margin: 0;">${ formatProjectName(project.name).join(' ') }</h3>
      <div>${project.star_count > 0 ? project.star_count + ' &#11088;' : ''}</div>
      <p>${project.description ? `${project.description.slice(0, 100)}…`: ''}</p>
    </div>
  `).join('');
}

const selectLng = (dom) => {
  clickedLng = dom.textContent;
  renderProjects();
}

const toggleContact = (contact) => {
  let contactDiv = document.getElementsByClassName(contact)[0];
  if (contactDiv.style.visibility == 'hidden') {
    contactDiv.style.visibility = 'visible';
  } else {
    contactDiv.style.visibility = 'hidden';
  }
}

const renderContact = () => {
  loadingElem.style.display = 'none';
  document.querySelector('.hide').style.display = 'block';
  avatar.src = profileData.avatar;
  name.innerHTML = profileData.name;
  email.innerHTML = profileData.email;
  if (!profileData.email) {
    contactInfo.style.visibility = 'hidden';
  } 
  renderBasicInfo();
}

avatar.addEventListener('click', () => {
  return profileData.html_url;
})

const renderBasicInfo = () => {
  description.innerHTML = `
    <span class="hello-span">Hello. </span><span>I'm a </span>${profileData.bio ? profileData.bio : 'developer'}
    <span> based in </span>${profileData.location ? profileData.location : ''}
  `;
  repos = profileData.projects;
  techStack.innerHTML = profileData.languages.map(language => `
    <li class="lang-list" 
    style="list-style-type: square; cursor: pointer;" 
    onClick="selectLng(this)">${language}</li>
  `).join('');
  //return all tiles if title is clicked
  allLngsHeading.addEventListener('click', () => {
    clickedLng = '';
    renderProjects();
  })
  renderProjects();
} 


