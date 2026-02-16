import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import { removeImg } from '../../services/cloudinary.service.js'

export const storyService = {
	remove,
	query,
	getById,
	add,
	update,
	addStoryComment,
	removeStoryComment,
	toggleLike
}

async function query(filterBy = { txt: '', userId: '' }) {
	try {
		const criteria = _buildCriteria(filterBy)
		const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('story')

		var storyCursor = collection.find(criteria).sort(sort)

		const storys = await storyCursor.toArray()
		return storys
	} catch (err) {
		logger.error('cannot find storys', err)
		throw err
	}
}

async function getById(storyId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }

		const collection = await dbService.getCollection('story')
		const story = await collection.findOne(criteria)

		story.createdAt = story._id.getTimestamp()
		return story
	} catch (err) {
		logger.error(`while finding story ${storyId}`, err)
		throw err
	}
}

async function remove(storyId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(storyId),
		}

		if (!isAdmin) criteria['by.byId'] = ownerId

		const collection = await dbService.getCollection('story')

		const story = await collection.findOne({
			_id: ObjectId.createFromHexString(storyId),
		})

		if (!story) throw new Error('Not your story')

		if (story.isProtected && !isAdmin) {
			throw new Error('This demo story cannot be deleted')
		}

		if (story.img?.publicId) {
			await removeImg(story.img.publicId)
		}

		await collection.deleteOne(criteria)
		return storyId

	} catch (err) {
		logger.error(`cannot remove story ${storyId}`, err)
		throw err
	}
}

async function add(story) {
	try {
		const collection = await dbService.getCollection('story')
		const res = await collection.insertOne(story)
		story._id = res.insertedId.toString()
		return story
	} catch (err) {
		logger.error('cannot insert story', err)
		throw err
	}
}

async function update(story) {
	const storyToSave = { txt: story.txt, likedBy: story.likedBy }

	try {
		const criteria = { _id: ObjectId.createFromHexString(story._id) }

		const collection = await dbService.getCollection('story')

		await collection.updateOne(criteria, { $set: storyToSave })

		return story
	} catch (err) {
		logger.error(`cannot update story ${story._id}`, err)
		throw err
	}
}

async function addStoryComment(storyId, comment) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		comment._id = makeId()
		comment.createdAt = Date.now()
		const collection = await dbService.getCollection('story')

		await collection.updateOne(criteria, { $push: { comments: comment } })

		const updatedStory = await collection.findOne(criteria)
		return updatedStory

	} catch (err) {
		logger.error(`cannot add story comment ${storyId}`, err)
		throw err
	}
}

async function removeStoryComment(storyId, commentId, loggedinUser) {	
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(storyId),
			'comments._id': commentId,
			'comments.byId': loggedinUser._id,
		}

		const collection = await dbService.getCollection('story')

		const result = await collection.updateOne(criteria, {
			$pull: {
				comments: {
					_id: commentId,
					isProtected: { $ne: true }  // check only inside $pull
				}
			}
		})

		if (result.modifiedCount === 0) {
			throw new Error('Not authorized to delete this comment or comment is protected')
		}

		return commentId

	} catch (err) {
		logger.error(`cannot remove story comment ${storyId}`, err)
		throw err
	}
}

async function toggleLike(storyId, user) {
	const collection = await dbService.getCollection('story')
	const criteria = { _id: ObjectId.createFromHexString(storyId) }

	const alreadyLiked = await collection.findOne({
		...criteria,
		'likedBy.byId': user._id
	})

	const update = alreadyLiked
		? { $pull: { likedBy: { byId: user._id } } }
		: {
			$addToSet: {
				likedBy: {
					byId: user._id,
					username: user.username
				}
			}
		}
	await collection.updateOne(criteria, update)
	return await collection.findOne(criteria)
}

function _buildCriteria(filterBy) {
	const criteria = {
		txt: { $regex: filterBy.txt, $options: 'i' }
	}
	return criteria
}

function _buildSort(filterBy) {
	return {
		createdAt: -1
	}
}
