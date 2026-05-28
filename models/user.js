'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require("bcryptjs") 
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {foreignKey: "UserId"})
      User.hasOne(models.Profile, {foreignKey: "UserId"})
      User.hasMany(models.Friend, {foreignKey: "FriendId"})
      User.hasMany(models.Friend, {foreignKey: "UserId"})
      User.hasMany(models.User, {foreignKey: "Reveral"})
      User.belongsTo(models.User, {foreignKey: "Reveral"})
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "username gaboleh kosong yaaa"
        },
        notEmpty: {
          args: true,
          msg: "username gaboleh kosong yaaa"
        }
      }
    }, 
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "password gaboleh kosong yaaa"
        },
        notEmpty: {
          args: true,
          msg: "password gaboleh kosong yaaa"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "email gaboleh kosong yaaa"
        },
        notEmpty: {
          args: true,
          msg: "email gaboleh kosong yaaa"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Role gaboleh kosong yaaa"
        },
        notEmpty: {
          args: true,
          msg: "Role gaboleh kosong yaaa"
        }
      }
    },
    Reveral: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook("beforeCreate", (user, options) => {

    if(user.Reveral === '')
    {
      user.Reveral = null
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
  })

  return User;
};