
import { httpService } from './http.service.js'
import { getRandomIntInclusive } from './util.service.js'



export const storyService = {
    query,
    getById,
    save,
    remove,
    getEmptyStory,
    addStoryComment
}
window.cs = storyService


async function query(filterBy = { txt: '', username = ''}) {
    return httpService.get('story', filterBy)
}
function getById(storyId) {
    return httpService.get(`story/${storyId}`)
}

async function remove(storyId) {
    return httpService.delete(`story/${storyId}`)
}
async function save(story) {
    var savedStory
    if (story._id) {
        savedStory = await httpService.put(`story/${story._id}`, story)

    } else {
        savedStory = await httpService.post('story', story)
    }
    return savedStory
}

async function addStoryComment(storyId, txt) {
    const savedComment = await httpService.post(`story/${storyId}/comment`, {txt})
    return savedComment
}


function getEmptyStory() {
    return {
		txt: '',
		imgUrl: '',
        by: {},
        createdAt: '',
        loc: {},
        comments: [],
        likedBy:[],
        tags: []
    }
}




