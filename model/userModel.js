const conn = require('../config/conn');
const {DataTypes} = require('sequelize');

const User = conn.define('user' , {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
} , {
    freezeTableName: true
});

module.exports = User;