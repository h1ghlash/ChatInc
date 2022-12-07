const User = require("../model/userModel");
const  bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 3*24*60*60;

const createToken = (id) => {
    return jwt.sign({id}, "secret-key", {
        expiresIn: maxAge,
    })
}

module.exports.register = async (req,res,next) => {
   try{
       const {username, email, password} = req.body;
       const usernameCheck = await User.findOne({username});
       if(usernameCheck)
           return res.json({msg: "Username already used", status: false});
       const emailCheck = await User.findOne({email});
       if(emailCheck)
           return res.json({msg: "Email already used", status: false});
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = await  User.create({
           email,
           username,
           password: hashedPassword,
       })
       const token = createToken(user._id)
       res.cookie("jwt", token, {
           withCredentials: true,
           httpOnly: false,
           maxAge: maxAge * 1000
       })
       res.status(201).json({user: user._id, created: true});
   }catch (ex) {
       next(ex);
       console.log(ex);
   }
};

module.exports.login = async (req,res,next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user)
            return res.json({msg: "incorrect username or password", status: false});
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({msg: "incorrect username or password", status: false});
        const token = createToken(user._id)
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        })
        res.status(200).json({user: user._id, created: true});
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async (req,res, next) => {
        try {
            const users = await User.find({_id: { $ne: req.params.id}}).select([
                "email",
                "username",
                "_id",
            ]);
            return res.json(users);
        }catch (ex) {
            next(ex);
        }
};

module.exports.getCurrentUser = async (req,res, next) => {
    try {
        const user = await User.find({_id: req.params.id}).select(
            "username"
        );
        return res.json(user);
    }catch (ex) {
        next(ex);
    }
};