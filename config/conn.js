const {Sequelize} = require('sequelize');

const conn = new Sequelize('auth_jwt_db' , 'root' , '' , {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try{
        await conn.authenticate();
        console.log('Connecting to DB...');
    }catch(err){
        console.log(err);
    }
})();

module.exports = conn;