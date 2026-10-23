import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

// Author User
const passwordHash = await bcrypt.hash(process.env.SEED_PASSWORD, 10);


await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: passwordHash },
    create: { username: 'admin', password: passwordHash, isAuthor: true },
});

console.log('Seeded author user');
await prisma.$disconnect();