// For issuing the token in middleware/auth.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../lib/prisma.js";

const router = Router();

// Issuing tokens for credentials
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username or password are incorrect.'})
    }

    const user = await prisma.user.findUnique({ where: { username }});
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }

    const token = jwt.sign(
      { id: user.id, isAuthor: user.isAuthor }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' },
    );
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.'});
  }
 
});

export default router;