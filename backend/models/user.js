const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    fullName: {  
        type: String, 
        required: true 
    }, 
    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;