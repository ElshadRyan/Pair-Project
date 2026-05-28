const express = require('express')
const Controllers = require('./controller/controllers')
const session = require("express-session");
const app = express()
const port = 3000

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

app.use(
  session({
    secret: "ElshadGans", // kunci bebas
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true }, // set true jika menggunakan HTTPS
  }),
);

app.get('/', Controllers.homePage)

app.get('/login', Controllers.login)

app.get('/signin', Controllers.signin)

app.get('/logout', Controllers.logout)

const isCreatingNewAccount = function(req, res, next)
{
  console.log(req.session);
  if(!req.session.createNewAccount)
  {
    res.redirect('/?action=Sign In')
  }
  else
  {
    next()
  }
}

app.get('/:id/create-profile', isCreatingNewAccount, Controllers.showCreateProfileForm)

app.post('/:id/create-profile', Controllers.createProfile)

app.use(function (req, res, next) {
  // console.log(req.session);
  if(!req.session.userId)
  {
    res.redirect('/?action=Login&error=Login dulu bre')
  }
  else
  {
    if(req.session.role === "admin")
    {
      next()
    }
    else
    {

    }
  }
})

const isAdmin = function(req, res, next)
{
  if(!req.session.role)
  {
    res.redirect('/?action=Login&error=Login dulu bre')
  }
  else
  {
    if(req.session.role !== "Admin")
    {
      res.redirect('/?error=Not An Admin')
    }
    else
    {
      next()
    }
  } 
}


app.get('/admin/:username/:id', isAdmin, Controllers.adminHome)

app.get('/:adminid/:username/:id', Controllers.userHome)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})