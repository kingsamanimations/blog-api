import { Router } from 'express';
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

// Adding, editing, or deleting comments

// mergeParams - allowing this router to see :postId from posts.js
const router = Router({ mergeParams: true});

// Public: comments on a published post
router.get('/', asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (Number.isNaN(postId)) return res.status(404).json({ error: 'Post not found' });

  const comments = await prisma.comment.findMany({
    where: { postId, post: { published: true } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(comments);
}));

// Leave a comment
router.post('/', asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  const { username, content } = req.body;

  if (Number.isNaN(postId)) return res.status(404).json({ error: 'Post not found' });
  if (!username || !content) {
    return res.status(400).json({ error: 'username and content are required'});
  }

  const post = await prisma.post.findFirst({ where: { id: postId, published: true } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comment = await prisma.comment.create({
    data: { username, content, postId },
  });
  res.status(201).json(comment);
}));

// Author: edit a comment
router.put('/:commentId', requireAuth, asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'content is required'});

  const existing = await prisma.comment.findFirst({ where: { id: commentId, postId }})

  if (!existing) return res.status(404).json({ error: 'comment not found'});

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
  res.json(comment);
}));

// Delete a comment
router.delete('/:commentId', requireAuth, asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);

  const existing = await prisma.comment.findFirst({ where: { id: commentId, postId }})

  if (!existing) return res.status(404).json({ error: 'comment not found'});

  await prisma.comment.delete({ where: { id: commentId }});
  res.status(204).end();
}));


export default router;