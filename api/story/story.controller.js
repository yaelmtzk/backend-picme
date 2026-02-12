import { logger } from '../../services/logger.service.js'
import { storyService } from './story.service.js'

export async function getStories(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
            sortField: req.query.sortField || '',
            sortDir: req.query.sortDir || 1,
			pageIdx: req.query.pageIdx,
		}
		const stories = await storyService.query(filterBy)
		res.json(stories)	
	} catch (err) {
		logger.error('Failed to get stories', err)
		res.status(400).send({ err: 'Failed to get stories' })
	}
}

export async function getStoryById(req, res) {
	try {
		const storyId = req.params.id
		const story = await storyService.getById(storyId)
		res.json(story)
	} catch (err) {
		logger.error('Failed to get story', err)
		res.status(400).send({ err: 'Failed to get story' })
	}
}

export async function addStory(req, res) {
	const { loggedinUser, body } = req
	const story = {
		txt: body.txt,
		img: body.img,
        by: {
			byId: loggedinUser._id,
			username: loggedinUser.username,
			imgUrl: loggedinUser.imgUrl
		},
        createdAt: Date.now(),
        loc: body.loc,
        comments: body.comments,
        likedBy: body.likedBy,
        tags: body.tags
	}
	try {
		story.by.byId = loggedinUser._id
		const addedStory = await storyService.add(story)
		res.json(addedStory)
	} catch (err) {
		logger.error('Failed to add story', err)
		res.status(400).send({ err: 'Failed to add story' })
	}
}

export async function updateStory(req, res) {
	const { loggedinUser, body: story } = req
    const { _id: userId, isAdmin } = loggedinUser

    if(!isAdmin && story.by.byId !== userId) {
        res.status(403).send('Not your story...')
        return
    }

	try {
		const updatedStory = await storyService.update(story)
		res.json(updatedStory)
	} catch (err) {
		logger.error('Failed to update story', err)
		res.status(400).send({ err: 'Failed to update story' })
	}
}

export async function removeStory(req, res) {
	try {
		const storyId = req.params.id
		const removedId = await storyService.remove(storyId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove story', err)
		res.status(400).send({ err: 'Failed to remove story' })
	}
}

export async function addStoryComment(req, res) {
    const { loggedinUser } = req	
    try {
        const storyId = req.params.id

        const comment = {
            txt: req.body.txt,
            byId: loggedinUser._id,
            username: loggedinUser.username,
            imgUrl: loggedinUser.imgUrl
        }

        const updatedStory = await storyService.addStoryComment(storyId, comment)

        res.json(updatedStory)

    } catch (err) {
        logger.error('Failed to add story comment', err)
        res.status(400).send({ err: 'Failed to add story comment' })
    }
}

export async function removeStoryComment(req, res) {
	try {
		const { id: storyId, commentId } = req.params

		const removedId = await storyService.removeStoryComment(storyId, commentId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove story comment', err)
		res.status(400).send({ err: 'Failed to remove story comment' })
	}
}

// export async function toggleLike(storyId, user) {
//     const collection = await dbService.getCollection('story')
//     const criteria = { _id: ObjectId.createFromHexString(storyId) }

//     const alreadyLiked = await collection.findOne({
//         ...criteria,
//         'likedBy.byId': user._id
//     })

//     const update = alreadyLiked
//         ? { $pull: { likedBy: { byId: user._id } } }
//         : { $addToSet: { likedBy: {
//             byId: user._id,
//             username: user.username
//         }}}

//     await collection.updateOne(criteria, update)

//     return await collection.findOne(criteria)
// }

export async function toggleLike(req, res) {
    try {
        const { id: storyId } = req.params
        const { loggedinUser } = req

        const updatedStory = await storyService.toggleLike(storyId, loggedinUser)
        res.json(updatedStory)

    } catch (err) {
        logger.error('Failed to toggle like', err)
        res.status(400).send({ err: 'Failed to toggle like' })
    }
}

