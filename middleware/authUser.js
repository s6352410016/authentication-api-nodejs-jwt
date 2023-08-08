const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req , res , next) => {
    try{
        const Bearer = req.headers['authorization'];
        const token = Bearer?.split(' ')[1];
        if(!token){
            return res.status(401).json({msg: 'no authorized.'});
        }
        jwt.verify(token , process.env.ACCESS_TOKEN_SECRET , (err , decoded) => {
            if(err){
                return res.status(403).json({msg: 'forbiden.'});
            }
            req.fullname = decoded.payload;
            next();
        });
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports = auth;