import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization?.split(' ')[1]) {
    return res.status(401).json({ message: 'no token provided' });
  }

  jwt.verify(
    req.headers.authorization.split(' ')[1],
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'invalid token' });
      }
      req.userId = decoded.id;
      next();
    },
  );
};

export { verifyToken };
