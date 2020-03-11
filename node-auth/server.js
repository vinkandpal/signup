const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Password, 10)
    const user = { Username: req.body.Username, Password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', (req, res) => {
  const user = users.find(user => user.Username == req.body.Username)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    res.send({userId: user.Username});
  } catch {
    res.status(500).send()
  }
})

app.post('/users/verifyPwd', async (req, res) => {
  const user = users.find(user => user.Username == req.body.Username)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.Password, user.Password)) {
      res.send('Success')
    } else {
      res.status(404).send('Password mis-match')
    }
  } catch {
    res.status(500).send()
  }
})


app.listen(8080)