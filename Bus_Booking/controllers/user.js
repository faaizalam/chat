import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../model/user.js';
import { verifyToken } from '../middelware/verify.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = user => {
  console.log(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);
  const accessToken = () => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
  };

  const refreshToken = () => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
  };

  return { accessToken: accessToken(), refreshToken: refreshToken() };
};

export const loginOrSignup = async (req, res,next) => {
  const { id_token } = req.body;
  try {
    console.log(id_token);
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub, email_verified } = ticket.getPayload();
    if (!email_verified) {
      return res.status(400).json({ message: 'Email not verified' });
    }
    let user = await User.findOne({ email });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = new User({
        google_id: sub,
        name,
        email,
        user_photo: picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await user.save();
    }

    const tokens = generateTokens(user);
    res.json({ user, tokens, isNewUser });
  } catch (error) {
    console.error('Error during Google login/signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshAccessToken = async (req, res,next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    console.log("");
    return res.status(400).json({ message: 'No refresh token provided' });
  }
  try {
    //  await verifyToken(req,res,next);
     console.log(req.userId,"yaha");
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = generateTokens(user).accessToken;
    res.json({ accessToken: token });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
