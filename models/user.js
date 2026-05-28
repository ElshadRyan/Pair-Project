'use strict';
const {
  Model
} = require('sequelize');
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
      User.hasOne(models.Profile, {foreignKey: "ProfileId"})
      User.hasMany(models.Friend, {foreignKey: "FriendId"})
      User.hasMany(models.Friend, {foreignKey: "UserId"})
      User.hasMany(models.User, {foreignKey: "Reveral"})
      User.belongsTo(models.User, {foreignKey: "Reveral"})
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    Reveral: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};