import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

const router = Router();

router.post('/refresh', async (req, res, next) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return next(errorHandler(401, 'No refresh token provided'));
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refresh_token) {
      return next(errorHandler(401, 'Invalid refresh token'));
    }

    const newAccessToken = generateToken(user);
    res.cookie('access_token', newAccessToken, { httpOnly: true }).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
});

export default router;
