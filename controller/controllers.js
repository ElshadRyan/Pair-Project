
const { Error } = require("sequelize");
const {User, Profile} = require("../models/index");
const bcrypt = require("bcrypt")

class Controllers{
    static async homePage(req,res)
    {
        try {
            let errors = []
            let {action, error} = req.query
            if(error)
            {
                errors = error.split(',')
            }
            res.render("home", {action, errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async login(req,res)
    {
        try {
            let allInput = req.query
            let {userName, password} = allInput
            //nanti dicocokan dengan database
            // inget ini mau nyocokin data sama username sama pw, ngecek login apakah ada apa ga, dan apakah udah login di tempat lain atau ga
            let userData = await User.findOne({where: {username: userName}})
            if(userData)
            {
                if(bcrypt.compareSync(password, userData.password))
                {
                    req.session.role = userData.role
                    req.session.userId = userData.id
                    if(userData.role === "Admin")
                    {
                        res.redirect(`/admin/${userData.username}/${userData.id}`)
                    }
                    else
                    {
                        res.redirect(`/${userData.username}/${userData.id}`)
                    }
                }
                else
                {
                    res.redirect("/?action=Login&error=Password/Username Salah")
                }
            }
            else
            {
                res.redirect("/?action=Login&error=Password/Username Salah")
            }

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async signin(req,res)
    {
        try {
            let error = []
            let allInput = req.query
            let {userName, email, password, Reveral, Role} = allInput
            //dicocokan dengan database nanti
            let newUser = await User.create({
                username: userName,
                email: email,
                password: password,
                Reveral: Reveral,
                role: Role
            })
            req.session.createNewAccount = newUser.id
            res.redirect(`/${newUser.id}/create-profile`)
        } catch (error) {
            if(error.name === "SequelizeBaseError")
            {   
                res.redirect(`/?action=Sign In&error=${error.message}`)
            }
            else if(error.name === "SequelizeValidationError")
            {
                let errors = error.errors.map(data => {
                    return data.message
                })
                res.redirect(`/?action=Sign In&error=${errors}`)
            }
            else
            {
                res.send(error)
            }
        }
    }

    static async logout(req,res)
    {
        try {
            req.session.destroy((err) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.redirect('/?action=Login')
                }
            })
            
        } catch (error) {
            res.send(error)
        }
    }

    static async showCreateProfileForm(req,res)
    {
        try {
            let errors = []
            let id = req.params.id
            let {error} = req.query
            if(error)
            {
                errors = error.split(',')
            }
            res.render("createProfile", {id, errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async createProfile(req,res)
    {
        try {
            let allInput = req.body
            let id = req.params.id
            let {profileName, description, imageURL} = allInput

            let newProfile = await Profile.create({
                name: profileName,
                description: description,
                imageURL: imageURL,
                UserId: id
            })

            res.redirect("/")

        } catch (error) {
            if(error.name === "SequelizeValidationError")
            {
                let id = req.params.id
                let errors = error.errors.map(data => {
                    return data.message
                })
                res.redirect(`/${id}/create-profile?error=${errors}`)
            }
            else
            {
                res.send(error)
            }
        }
    }

    static async adminHome(req,res)
    {
        try {
            let id = req.params.id
            let allData = await User.findOne({
                include: [{model: Profile, require: true}, {model: User, require: true}],
                where: {
                    id: id
                }
            })
            let profile = allData.dataValues.Profile
            let users = allData.dataValues.Users

            res.render("adminHomePage", {allData, profile, users})

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async userHome(req,res)
    {
        try {
            res.render("userHomePage")



        } catch (error) {
            res.send(error)
        }
    }
}
module.exports = Controllers