const express = require('express')
const Controllers = require('./controller/controllers')
const app = express()
const port = 3000

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

app.get('/', Controllers.homePage)

app.get('/login', Controllers.login)

app.get('/signin', Controllers.signin)

app.get('/create-profile', Controllers.showCreateProfileForm)

app.post('/create-profile', Controllers.createProfile)

app.get('/:username/:id', Controllers.userHome)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})