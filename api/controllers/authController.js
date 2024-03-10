import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const emailCheck = await User.findOne({ email });

        if (!username || !email || !password || username === '' || email === '' || password === '') {
            res.status(404).json({mssg: "Please fill all the fields.", success: false})
        } else if (emailCheck) {
            res.status(404).json({mssg: "Email is already taken.", success: false})
        } else {
            const hashedPs = await bcrypt.hash(password, 10)
            const newUser = new User({
                username,
                email,
                password: hashedPs
            })
            await newUser.save();
            res.status(200).json({ mssg: 'Signup Successful!', success: true })
        }
    } catch (error) {
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password || email === '' || password === '') {
            res.status(404).json({mssg: "Please fill all the fields.", success: false})
        }
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return res.status(404).json({mssg: "User not found.", success: false})
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (validPassword === false) {
            return res.status(404).json({mssg: "Invalid email or password.", success: false})
        } else {
            const token = jwt.sign({
                id: validUser._id,
            },
            process.env.JWT_SECURITY    
            )
            const { password: pass, ...rest } = validUser._doc;

            res.status(200).cookie('access_token', token, {
                    httpOnly: true,
                }).json({user: rest, success: true})
        }
    } catch (error) {
        next(error);
    }
}

