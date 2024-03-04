import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailCheck = await User.findOne({ email });

        if (!username || !email || !password || username === '' || email === '' || password === '') {
            return res.status(404).json({ message: "All fields are required!"});
        } else if (emailCheck) {
            return res.status(404).json({mssg: "Email is already used!"})
        } else {
            const hashedPs = await bcrypt.hash(password, 10)
            const newUser = new User({
                username,
                email,
                password: hashedPs
            })
            (await newUser.save());
            res.status(200).json({newUser})
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ mssg: "Unexpected error occured."})
    }
}

