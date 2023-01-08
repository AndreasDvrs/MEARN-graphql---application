const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
        try {
            const userFound = await User.findOne({email: args.userInput.email});
            if (userFound) {
                throw new Error ('User already exists');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const userToCreate = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const userCreateResult = await userToCreate.save();
            return {...userCreateResult._doc, _id: userCreateResult.id, password: null};
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new Error('Password is incorrect');
            }
            const token = jwt.sign({
                userId: user.id, email: user.email
            }, 'somesupersecretkey', {expiresIn:'1h'});
            return { userId: user.id, token: token, tokenExpiration: 1 }
        } catch (err) {
            throw err;
        }
    }
}
