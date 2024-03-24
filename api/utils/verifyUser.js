import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({mssg: "Unauthorized", success: false});
    }
    jwt.verify(token, process.env.JWT_SECURITY, (err, user) => {
      if (err) {
        return res.status(401).json({mssg: "Unauthorized", success: false});
      }
      req.user = user;
      next();
    });
  };