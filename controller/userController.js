const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { fullname, username, password, email } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        const data = await User.create({
            fullname: fullname,
            username: username,
            password: password_hash,
            email: email
        });
        const access_token = jwt.sign(
            {
                payload: data.fullname
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '30s'
            }
        );
        const refresh_token = jwt.sign(
            {
                payload: data.fullname
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        );
        res.status(201).json({ access_token: access_token, refresh_token: refresh_token });
    } catch (err) {
        res.status(500).json(err);
    }
}

const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const data = await User.findAll({
            where: {
                [Op.or]: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ]
            }
        });
        if (data.length !== 0) {
            const row = data[0].dataValues; // เข้าถึงข้อมูลของ user จาก ตัวแปร data
            const result = await bcrypt.compare(password, row.password);
            if (result) {
                const access_token = jwt.sign(
                    {
                        payload: row.fullname
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '30s'
                    }
                );
                const refresh_token = jwt.sign(
                    {
                        payload: row.fullname
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: '1d'
                    }
                );
                return res.status(200).json({ access_token: access_token, refresh_token: refresh_token });
            }
            return res.status(400).json({ msg: 'Invalid credential.' });
        }
        return res.status(400).json({ msg: 'Invalid credential.' });
    } catch (err) {
        return res.status(500).json(err);
    }
}

const refreshToken = async (req, res) => {
    try {
        const Bearer = req.headers['authorization'];
        const token = Bearer?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'no authorized.' });
        }
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ msg: 'forbiden.' });
            }
            const access_token = jwt.sign(
                {
                    payload: decoded.payload
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '30s'
                }
            );
            const refresh_token = jwt.sign(
                {
                    payload: decoded.payload
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '1d'
                }
            );
            res.status(200).json({ access_token: access_token, refresh_token: refresh_token });
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    register,
    login,
    refreshToken
}