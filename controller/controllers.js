
const { Error } = require("sequelize");
const {User, Profile, Post, Friend} = require("../models/index");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sendEmail = require("../helper/sendEmail");



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
                    req.session.username = userData.username
                    await sendEmail()
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
            // let id = req.params.id
            // let thisProfile = await User.findOne({include:{} where:{id: id}})
            //  Profile.changeStatus()
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
                where: {
                    id: id
                },

                attributes: [
                    ['id', 'userId'],
                    'username',
                    'email',
                    'role'
                ],

                include: [
                    {
                        association: 'Profile',

                        attributes: [
                            ['id', 'profileId'],
                            'name',
                            'description',
                            'status',
                            'imageURL'
                        ],

                        required: false
                    },

                    {
                        association: 'Reverals',

                        attributes: [
                            ['id', 'reveralId'],
                            ['username', 'reveralUsername'],
                            ['email', 'reveralEmail'],
                            ['role', 'reveralRole'],
                            'Reveral'
                        ],

                        required: false,

                        include: [
                            {
                                association: 'Profile',

                                attributes: [
                                    ['id', 'reveralProfileId'],
                                    ['name', 'reveralProfileName'],
                                    ['description', 'reveralProfileDescription'],
                                    ['imageURL', 'reveralImageURL']
                                ],

                                required: false
                            }
                        ]
                    }
                ]
            })

            let profile = allData.dataValues.Profile
            let users = allData.dataValues.Reverals

            res.render("adminHomePage", {allData, profile, users})

        } catch (error) {
            res.send(error)
        }
    }

    static async userHome(req,res)
    {
        try {

            let id = req.params.id
            let username = req.params.username
            let admin = {}
            let allData = await User.findOne({where: {id: id}})

            let friends = await User.findOne({
                    where: {
                        id: id
                    },
    
                    attributes: [],
    
                    include: [
                        {
                            association: "AllFriends",
    
                            attributes: [["id", "friendsTableId"]],
    
                            required: false,
    
                            include: [
                                {
                                    association: "FriendUser",
    
                                    attributes: [['username', 'friendUsername'], ['id', 'friendsId']],
    
                                    required: false,    
    
                                    include: [
                                        {
                                            association: "Profile",
    
                                            attributes: [
                                                ['name', 'friendsName'],
                                                ['imageURL', 'friendsProfileImage'],
                                                ['description', 'friendsBio']
                                            ],
    
                                            required: false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })

            const allFriends = friends.dataValues.AllFriends
            let friendIds = allFriends.map(friend => {
                // console.log(friend.dataValues);
                return friend.dataValues.FriendUser.dataValues.friendsId
            });
            friendIds.push(+id)
            const posts = await Post.findAll({
                where: {
                    UserId: friendIds
                },

                include: [
                    {
                        model: User,
                        as: 'User',
                        required: false,
                        include: [
                            {
                                model: Profile,
                                as: 'Profile',
                                required: false,
                            }
                        ]
                    }
                ],

                order: [['createdAt', 'DESC']]
            });
            
            if(req.session.role === "Admin")
            {
                admin = {username: req.session.username, id: req.session.userId}
            }

            if(allData.dataValues.username !== username)
            {
                res.redirect('/logout')
            }
            else
            {
                res.render("userHomePage", {allData, posts, id, username, admin})
            }


        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async friendsList(req, res)
    {
        try {
            let id = req.params.id
            let username = req.params.username
        
            let friends = await User.findOne({
                    where: {
                        id: id
                    },
    
                    attributes: [],
    
                    include: [
                        {
                            association: "AllFriends",
    
                            attributes: [["id", "friendsTableId"]],
    
                            required: false,
    
                            include: [
                                {
                                    association: "FriendUser",
    
                                    attributes: [['username', 'friendUsername'], ['id', 'friendsId']],
    
                                    required: false,    
    
                                    include: [
                                        {
                                            association: "Profile",
    
                                            attributes: [
                                                ['name', 'friendsName'],
                                                ['imageURL', 'friendsProfileImage'],
                                                ['description', 'friendsBio']
                                            ],
    
                                            required: false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })
            // console.log(friends.dataValues.AllFriends[1].dataValues.FriendUser);
            
            let allFriends = friends.dataValues.AllFriends
            // console.log(allFriends[0].dataValues.FriendUser.dataValues);
            res.render("friendsList", {allFriends, id, username})
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showAddFriendForm(req, res)
    {
        try {
            let id = req.params.id
            let username = req.params.username

            let {search} = req.query
            let options = {
                include: [
                    {
                        association: "Profile",
                        required: false,
                        where: {} 
                    },
                ],
            }

            if(search)
            {
                options.where = {username: {[Op.iLike]: `%${search}%`}}
            }


            let listAllUser = await User.findAll(options)

            res.render("addFriends", {id, username, listAllUser})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async addFriends(req, res)
    {
        try {
            let friendId = req.params.friendId
            let username = req.params.username
            let id = req.params.id
            await Friend.create({UserId: id, FriendId: friendId})
            res.redirect(`/${username}/${id}/add-friend`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showAddPostForm(req, res)
    {
        try {
            let username = req.params.username
            let id = req.params.id

            res.render("addPost", {username, id})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async addPost(req,res)
    {
        try {
            let id = req.params.id
            let username = req.params.username
            let {title, description, imageURL} = req.body
            await Post.create({title: title, description: description, imageURL: imageURL, UserId: id})
            res.redirect(`/${username}/${id}`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async myPost(req,res)
    {
        try {
            let id = req.params.id
            let username = req.params.username

            let allPost = await Post.findAll({
                include: [
                    {
                        model: User,
                        required: true, // behaves like WHERE u.id = 1
                        where: {
                            id: id,
                        },
                    },
                ],
            });

            res.render("myPost", {allPost, id, username})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async deletePost(req,res)
    {
        try {
            let id = req.params.id
            let username = req.params.username
            let postId = req.params.postId

            console.log(postId);

            await Post.destroy({
                where: {
                    id: postId // Or your specific ID variable
                }
            });

            res.redirect(`/${username}/${id}/my-post`)

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}
module.exports = Controllers