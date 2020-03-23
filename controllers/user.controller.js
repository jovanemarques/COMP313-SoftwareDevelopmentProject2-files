const User = require('../models/user.model');
const BaseController = require('./base.controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function UserController() {
  BaseController.call(this, {model: User});
}

UserController.prototype = Object.create(BaseController.prototype);

UserController.prototype.requiresLogin = function (req, res, next) {
	const token = req.cookies.token
	if (!token) {
	  return res.json({ error: 'Authentication is required.' });
	}
	var payload;
	try {
	  payload = jwt.verify(token, config.secretKey)
	  req.id = payload.id;
	} catch (e) {
	  if (e instanceof jwt.JsonWebTokenError) {
		return res.status(401);
	  }
	  return res.status(400);
	}
    next();
};

UserController.prototype.signout = (req, res) => {
	res.clearCookie("token")
	return res.status('200').json({message: "signed out"})
}

UserController.prototype.authenticate = function(req, res, next) {
    if (!req.body.username || !req.body.password){
        return res.json({status:"error", message: "Username and Password are required."});
    }
	const username = req.body.username;
	const password  = req.body.password;
	User.findOne({username: username}, (err, user) => {
        if (err) {
            return next(err);
        } else {
            if (user){
                if(bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign(
                        { id: user._id, username: user.username }, 
                        config.secretKey, 
                        {algorithm: 'HS256', expiresIn: config.jwtExpirySeconds }
                    );
                    res.cookie('token', token, { maxAge: config.jwtExpirySeconds * 1000, httpOnly: true });
                    res.status(200).send({ loged_user: user.username });
                    req.user = user;
                    next()
                } else {
                    res.json({status:"error", message: "Invalid username/password."});
                }
            } else {
                return res.json({status:"error", message: "User Not Found."});
            }
		}
	});
};

module.exports = UserController;