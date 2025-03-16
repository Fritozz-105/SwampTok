const User= require('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')
const jwt= require('jsonwebtoken');
const test = (req, res) => {
    res.json ('Test works')
}
//This the register endpoint
const signupUser = async (req,res)=> {
    try{
        console.log("Incoming request body:", req.body);
        const {fullName,email,password, dateOfBirth} = req.body;
        //check if name was entered
        if(!fullName){
            return res.json({
                error: "Name is required."
            })
        };
        //check if password is good
        if(!password || password.length<6){
            return res.json({
                error: "Password is required and should be at least 6 characters long."
            })
        };

         

        //Check Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
        if (!emailRegex.test(email)) {
            return res.json({
                error: "Email must be a valid University of Florida email (ends with @ufl.edu)."
            });
        }

        const exist = await User.findOne({email});
        if (exist){
            return res.json({
                error: "Email is taken already."
            })
        }

        //check DOB
        if (!dateOfBirth) {
            return res.json({
                error: "Date of birth is required."
            });
        }
        console.log("Passed everything-authcontrollers")

        const hashedPassword= await hashPassword(password)
        const user = await User.create({
            fullName,email,password: hashedPassword, dateOfBirth
        })
            return res.json(user)
    } catch (error){
        console.log(error)
    }
}

//login endpoint
const loginUser= async(req,res) => {
    try{
        const {email,password} = req.body;

        //Check if the user exists via email
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "Email is not linked to an account"
            })
        }

        //passwordmatchchecker
        const match = await comparePassword(password, user.password)
        if (match){
            jwt.sign({email: user.email, id: user._id, name:user.name}, process.env.JWT_SECRET, {}, (err,token) =>{
                if (err) throw (err);
                res.cookie('token', token).json(user)
            })
        }
        if (!match){
            res.json({
                error: "Passwords do not match"
            })
        }
    }
    catch (error){
            console.log(error)
    }
}

module.exports = {
    test,
    signupUser,
    loginUser
}