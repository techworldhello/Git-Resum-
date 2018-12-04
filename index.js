const express = require('express');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');
const PORT = process.env.port || 3000;
const monk = require('monk');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.set('view engine', 'ejs');

const parseUserData = data => {
  return {
    name: data[0].name,
    bio: data[0].bio ? data[0].bio : '',
    location: data[0].location,
    avatar: data[0].avatar_url,
    email: data[0].email,
    languages: data[1].map(repo => repo.language).filter((val, i, arr) => val && arr.indexOf(val) === i),
    organisations: data[1].organisations,
    projects: data[1].map(repo => {
      return {
        name: repo.name, 
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        description: repo.description ? repo.description : '',
        langs: repo.languages,
        link: repo.html_url,
        star_count: repo.stargazers_count // order by star count
      }
    }).sort((a, b) => parseInt(b.star_count) - parseInt(a.star_count)),
  };
}

// const getReadmeData = (user, repoName) => {
//   .then(json => json.map(repo => repo.name))
//     .then(repoNames => repoNames.map(repoName => {
//       fetch()
//     }))
//     fetch(`https://api.github.com/repos/${user}/${repoName}/contents/README.md`)
// }

const getUserData = (user) => {
  const numRepos = 'page=1&per_page=100&';
  // make first call to see number of repos, if it exceeds 100
  // make another call with offset of 100
  const promises = [
    fetch(`https://api.github.com/users/${user}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`), fetch(`https://api.github.com/users/${user}/repos?${numRepos}client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`)]
    .map(p => p
      .then(res => res.json()));

  return Promise.all(promises)
    .then(values => { 
      console.log(values);
      return parseUserData(values)
      //return values
    })
    .catch(error => { 
      console.log(error.message)
    })
}

app.use(cors());
app.use(express.json());

// const db = monk('localhost/users');
// const user = db.get('user');

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/api/:user', (req, res) => {
  const queryParam = req.params.user;
  getUserData(queryParam).then(info => res.json(info))
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))