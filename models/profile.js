'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey: "UserId"})
    }

    static changeStatus(status)
    {
      if(status === "Online")
      {
        return "Offline"
      }
      else
      {
        return "Online"
      }
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "nama gaboleh kosong yaaa"
        },
        notEmpty: {
          args: true,
          msg: "nama gaboleh kosong yaaa"
        }
      }
    }, 
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });

  Profile.addHook("beforeCreate", (user, options) => {
    if(user.imageURL === '')
    {
      user.imageURL = "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
    }

    user.status = "Online"
  })
  return Profile;
};