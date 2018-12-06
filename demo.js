const axios = require('axios');


var data = { 
  client_id: 'db5b5dd4212d16cb9f2a', 
  client_secret: 'f3bc280a231452074f967f0f6caea467d1a12650', 
  code: 'fc00de1eb9713a2e786a'
}


var headers = {
  'Content-Type': 'application/json',
  'Authorization': '' 
}


axios.post('https://github.com/login/oauth/access_token', data)
  .then((response) => {
      console.log(response.data)
  })
  .catch((error) => {
     console.log('err')
  })


// fetch('https://github.com/login/oauth/access_token', {
//   method: 'post',
//   headers: { 
//     client_id: 'db5b5dd4212d16cb9f2a', 
//     client_secret: 'f3bc280a231452074f967f0f6caea467d1a12650', 
//     code: '8d821f5f332d39ee012d'
//   },
//   redirect_uri: '/resume'
// })

// .then((tokenRes) => {
//   console.log(Object.keys(tokenRes))
//   console.log(Object.values(tokenRes))
//   // res.send('sdfsdf')
// })