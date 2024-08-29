import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Access token expires in 1 hour
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_REFRESH_SECRET, // Use a different secret for refresh tokens
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );
};

const generateAndSendToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );
  const { password, ...rest } = user._doc;
  res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .json(rest);
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const { password, ...rest } = newUser._doc;

    res
      .status(200)
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ ...rest, refreshToken });
  } catch (error) {
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const accessToken = generateAccessToken(validUser);
    const refreshToken = generateRefreshToken(validUser);

    validUser.refreshToken = refreshToken;
    await validUser.save();

    const { password, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ ...rest, refreshToken });
  } catch (error) {
    return next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      user = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();
    }
    generateAndSendToken(user, res);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(errorHandler(401, 'Refresh token is required'));
  }

  try {
    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return next(errorHandler(403, 'Refresh token is not valid'));
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err || user._id.toString() !== decoded.id) {
        return next(errorHandler(403, 'Refresh token is not valid'));
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      user.save();

      res
        .status(200)
        .cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .json({ refreshToken: newRefreshToken });
    });
  } catch (error) {
    return next(error);
  }
};
