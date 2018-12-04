console.log('cv')

const avatar = document.querySelector('#avatar');
const name = document.querySelector('#name');
const contactInfo = document.querySelector('#contact-info');
const description = document.querySelector('#description');
const techStack = document.querySelector('#tech-stack');
const projects = document.querySelector('#projects');
const star_count = document.querySelector('#star_count');
const input = document.querySelector('#url');
const button = document.querySelector('button');
const loadingElem = document.querySelector('.loading');
// const errorElem; // create elem in html

const getData = async (user) => {
  const apiCall = await fetch(`http://localhost:3000/api/${user}`);
  const data = await apiCall.json();
  return { data };
}

const showData = () => {
  //show spinner here
  loadingElem.style.display = 'block';

  getData(input.value).then(res => {
    console.log(res.data)
    loadingElem.style.display = 'none';
    document.querySelector('.hide').style.display = 'block';
    avatar.src = `${res.data.avatar}`;
    name.innerHTML = `${res.data.name}`;
    description.innerHTML = `<span>Hello, I'm a </span>${res.data.description ? res.data.description : 'developer'}<span> based in </span>${res.data.location}`;

    techStack.innerHTML = res.data.languages.map(lang => `<li>${lang}</li>`).join('');
    // increase star(font) size to the pt of num of stars

    projects.innerHTML = res.data.projects.map(project => `
      <div id="tile" onClick="window.open('','_new').location.href='${project.link}';">
        ${project.name}
        <p>${project.star_count > 0 ? project.star_count + ' &#11088;' : ''}</p>
      </div>
    `).join('');
    star_count.innerHTML = res.data.projects.map(project => ``)
  }).catch(error => {
    // errorElem.textContent = error.message;
    loadingElem.style.display = 'none';
  })

}

button.addEventListener('click', () => showData());

//making tiles clickable through to repo

document.querySelector('#tile').addEventListener('click', () => {

})

// create own api in the backend, make into an pbject to display in fronend 
// keep object in database 

//backend requrest to github to parse data into object as above


