
const {User} = require("../models/index")

class Controllers{
    static async homePage(req,res)
    {
        try {
            let {action} = req.query
            res.render("home", {action})
        } catch (error) {
            console.log(error);
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
            let userData
            if(!userData.dataValues.isLogin)
            {
                userData = await User.findAll({where: {
                    userName: userName,
                    password: password
                }})
                await User.Update(
                    {isLogin: true}
                    ,{where: {id: userData[0].dataValues.id}})
            }
            if(userData)
            {
                if(userData.dataValues.isLogin)
                {
                    res.redirect(`/${userData[0].dataValues.isLogin}`)
                }
            }

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async signin(req,res)
    {
        try {
            let allInput = req.query
            let {userName, email, password, confirmedPassword} = allInput
            //dicocokan dengan database nanti
            
            res.redirect("/createProfile")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showCreateProfileForm(req,res)
    {
        try {
            res.render("createProfile")
        } catch (error) {
            res.send(error)
        }
    }

    static async createProfile(req,res)
    {
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async userHome(req,res)
    {
        try {
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}
module.exports = Controllers