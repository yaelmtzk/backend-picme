import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getStories, getStoryById, addStory, updateStory, removeStory, addStoryComment, removeStoryComment, toggleLike } from './story.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getStories)
router.get('/:id', log, getStoryById)
router.post('/', log, requireAuth, addStory)
router.put('/:id', requireAuth, updateStory)
router.put('/:id/like', requireAuth, toggleLike)
router.delete('/:id', requireAuth, removeStory)
// router.delete('/:id', requireAuth, requireAdmin, removeStory)

router.post('/:id/comment', requireAuth, addStoryComment)
router.delete('/:id/comment/:commentId', requireAuth, removeStoryComment)

export const storyRoutes = router