const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const user_controller = new UserController();

router.get('/signin', user_controller.authenticate.bind(user_controller));
router.get('/signout', user_controller.signout.bind(user_controller));
router.get('/user/:id?', user_controller.requiresLogin, user_controller.list.bind(user_controller));
router.post('/user', user_controller.add.bind(user_controller));
router.put('/user/:id', user_controller.requiresLogin, user_controller.update.bind(user_controller));
router.delete('/user/:id', user_controller.requiresLogin, user_controller.delete.bind(user_controller));

module.exports = router;