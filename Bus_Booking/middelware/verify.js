import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization?.split(' ')[1]) {
    return res.status(401).json({ message: 'no token provided' });
  }
  console.log(req.headers.authorization?.split(' ')[1],process.env.ACCESS_TOKEN_SECRET);

  jwt.verify(
    req.headers.authorization?.split(' ')[1],
    process.env.ACCESS_TOKEN_SECRET,
  
    (err, decoded) => {
      if (err) {
        console.log("erro","wrong",err);
        return res.status(401).json({ message: 'invalid token' });
      }
      console.log(decoded,"decoded");
      req.userId = decoded.id;
      next();
    },
  );
};


export { verifyToken };
