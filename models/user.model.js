const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
	lastName: String,
	email: {
		type: String,
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	username: {
		type: String,
		unique: true,
		required: 'Username is required',
		trim: true
	},
	password: {
		type: String,
		validate: [
			(password) => password && password.length > 6,
			'Password should be bigger than 6 characters'
		]
	}
});

UserSchema.virtual('fullName')
.get(function() {
	return this.firstName + ' ' + this.lastName;
})
.set(function(fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

var func_save = function(next){
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
};

UserSchema.pre('save', { document: true, query: false }, func_save);

UserSchema.pre('updateOne', { document: true, query: false }, func_save);

UserSchema.methods.authenticate = function(password) {
	return this.password === bcrypt.hashSync(password, saltRounds);
};

UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = mongoose.model('User', UserSchema, 'user');