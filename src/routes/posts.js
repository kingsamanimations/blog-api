import { Router } from 'express';
import { prisma } from "../lib/prisma.js";
import { requireAuth } from '../middleware/auth.js';
import comments from './comments.js';

const router = Router();

// Public: published posts only
router.get('/', asyncHandler(async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
}));

// Author: every post + drafts (For admin site)
router.get('/all', requireAuth, asyncHandler(async (req, res) => {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
}));

// Public: One published post
router.get('/:postId', asyncHandler(async (req, res) => {
    const post = await prisma.post.findFirst({
        where: { id: Number(req.params.postId), published: true },
    });
    if (!post) return res.status(404).json ({ error: 'Post not found'})
    res.json(post);
}));

// Author: create
router.post('/', requireAuth, asyncHandler(async (req, res) => {
    const { title, content, published = false } = req.body;
    const post = await prisma.post.create({
        data: { title, content, published, authorId: req.user.id},
    });
    res.status(201).json(post);
}));

// Author: edit, or toggle published
router.put('/:postId', requireAuth, asyncHandler(async (req, res) => {
    const { title, content, published = false } = req.body;
    try {
        const post = await prisma.post.update({
            where: { id: Number(req.params.postId) },
            data: { title, content, published },
        });
        res.json(post);
    } catch {
        res.status(404).json({ error: 'Post not found' });
    }
}));

// Author: delete
router.delete('/:postId', requireAuth, asyncHandler(async (req, res) => {
    try {
        await prisma.post.delete({ where: { id: Number(req.params.postId) }});
        res.status(204).end();
    } catch {
        res.status(404).json({ error: 'Post not found' });
    }
}));

// Author: Site can load unpublished post into the edit form
router.get('/all/:postId', requireAuth, asyncHandler(async (req, res) => {
    // Safety guard
    const postId = Number(req.params.postId);
    if (Number.isNaN(postId)) return res.status(404).json({ error: 'Post not found' });

    const post = await prisma.post.findFirst({where: { id: postId} });
    if (!post) return res.status(404).json ({ error: 'Post not found'});
    res.json(post);
}));


// Author: all comments on a post, including drafts
router.get('/all/:postId/comments', requireAuth, asyncHandler(async (req, res) => {
    // Safety guard
    const postId = Number(req.params.postId);
    if (Number.isNaN(postId)) return res.status(404).json({ error: 'Post not found' });

    const post = await prisma.post.findFirst({where: { id: postId} });
    if (!post) return res.status(404).json ({ error: 'Post not found'});

    const comments = await prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'asc'},
    });
    res.json(comments);
}));

// Nested comments
router.use('/:postId/comments', comments);

export default router;