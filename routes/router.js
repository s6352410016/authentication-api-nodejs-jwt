const router = require('express').Router();
const userController = require('../controller/userController');
const contentController = require('../controller/contentController');
const authUser = require('../middleware/authUser');

router.post('/api/register' , userController.register);
router.get('/api/login' , userController.login);
router.get('/api/content' , authUser , contentController.content);
router.get('/api/refreshToken' , userController.refreshToken);

module.exports = router;