const express = require('express');
const app = express();
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.set('view engine', 'ejs');

const parseUserData = data => {
  return {
    name: data[0].name,
    bio: data[0].bio ? data[0].bio : '',
    location: data[0].location,
    avatar: data[0].avatar_url,
    github: data[0].html_url,
    email: data[0].email,
    languages: data[1].map(repo => repo.language).filter((val, i, arr) => val && arr.indexOf(val) === i),
    organisations: data[1].organisations,
    repo_count: data[1].length,
    projects: data[1].map(repo => {
      return {
        name: repo.name, 
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        description: repo.description ? repo.description : '',
        language: repo.language,
        link: repo.html_url,
        star_count: repo.stargazers_count
      } // order by star count
    }).sort((a, b) => parseInt(b.star_count) - parseInt(a.star_count)),
  };
}

const getReadmeData = (user, repoName) => {
  fetch(`https://api.github.com/repos/${user}/${repoName}/contents/README.md`)
  .then(json => json.map(repo => repo.name))
  .then(repoNames => repoNames.map(repoName => {
    fetch()
  }))
}

const getMoreReposIfOver100 = (values) => {
  if (values.repo_count > 100) {
    fetch(`https://api.github.com/users/${user}/repos?${numRepos}client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`)
    .then(res => res.json())
    .then(values => parseUserData(values))
  } else {
    return parseUserData(values);
  }
}
 
const getUserData = (user) => {
  const numRepos = 'page=1&per_page=100&';
  const promises = [
    fetch(`https://api.github.com/users/${user}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`), fetch(`https://api.github.com/users/${user}/repos?${numRepos}client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`)]
    .map(p => p
      .then(res => res.json()));

  return Promise.all(promises)
    .then(values => { 
      console.log(values)
      getMoreReposIfOver100(values);
    })
    .catch(error => { 
      console.log(error.message)
    })
}

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/user/signin/callback', (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.send({
      success: false,
      message: 'Error, no code'
    });
  }
  
  const data = { 
    client_id: CLIENT_ID, 
    client_secret: CLIENT_SECRET, 
    code: code
  }

  axios
    .post('https://github.com/login/oauth/access_token', data)
    .then(response => {
      fetch(`https://api.github.com/user?${response.data}`)
        .then(userData => userData.json())
        .then(json => {
          // const accessToken = queryStringToObj(response.data).access_token
          fetch(`http://localhost:3000/api/${json.login}`)
            .then(data => data.json())
            .then(json => res.render('resume', { json }))
        })
    })
    .catch(error => {
      console.log('err', error)
    })
})

app.get('/:login', (req, res) => { 
  res.render('resume');
  res.send(req.params.login + req.query.user_token)
})

app.get('/api/:user', (req, res) => {
  const queryParam = req.params.user;
  getUserData(queryParam).then(info => res.json(info))
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
