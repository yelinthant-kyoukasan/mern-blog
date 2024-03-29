import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const updateUser = async (req, res, next) => {
    // console.log(req.user)
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({mssg: "Access denied!", success: false});
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({mssg: "Password must be at least 6 characters", success: false});
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if(req.body.username.length < 7 || req.body.username.length > 20) {
          return res.status(400).json({mssg: "Username must be between 7-20 characters", success: false});
        }
        if (req.body.username.includes(' ')) {
            return res.status(400).json({mssg: "Username cannot contain spaces", success: false});
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return res.status(400).json({mssg: "Username must be lowercase", success: false});
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return res.status(400).json({mssg: 'Username can only contain letters and numbers', success: false});
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.userId,
          {
            $set: {
              username: req.body.username,
              email: req.body.email,
              profilePicture: req.body.profilePicture,
              password: req.body.password,
            },
          },
          { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({user: rest, success: true});
      } catch (error) {
        next(error);
      }

}