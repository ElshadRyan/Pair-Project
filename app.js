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
    next()
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

const canAccess = function(req, res, next)
{
  if(!req.session.role)
  {
    res.redirect('/?action=Login&error=Login dulu bre')
  }
  else
  {
    if(req.session.role === "Admin")
    {
      next()
    }
    else
    {
      if(req.session.userId === +req.params.id)
      {
        next()
      }
      else
      {
        res.redirect('/?action=Login&error=Login dulu bre')
      }
    }
  }
}


app.get('/admin/:username/:id', isAdmin, Controllers.adminHome)

app.get('/:username/:id', canAccess, Controllers.userHome)

app.get('/:username/:id/friends',canAccess, Controllers.friendsList)

app.get('/:username/:id/add-post',canAccess, Controllers.showAddPostForm)

app.post('/:username/:id/add-post',canAccess, Controllers.addPost)

app.get('/:username/:id/my-post',canAccess, Controllers.myPost)

app.get('/:username/:id/delete/:postId',canAccess, Controllers.deletePost)

app.get('/:username/:id/add-friend',canAccess, Controllers.showAddFriendForm)

app.get('/:username/:id/add-friend/add/:friendId',canAccess, Controllers.addFriends)


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})