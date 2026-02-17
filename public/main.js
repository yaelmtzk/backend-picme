import { storyService } from './services/story.service.js'
import { userService } from './services/user.service.js'
import { prettyJSON } from './services/util.service.js'

console.log('Simple driver to test some API calls')

window.onLoadStories = onLoadStories
window.onLoadUsers = onLoadUsers
window.onAddStory = onAddStory
window.onGetStoryById = onGetStoryById
window.onRemoveStory = onRemoveStory
window.onAddStoryComment = onAddStoryComment

async function onLoadStories() {
    const stories = await storyService.query()
    render('Stories', stories)
}
async function onLoadUsers() {
    const users = await userService.query()
    render('Users', users)
}

async function onGetStoryById() {
    const id = prompt('Story id?')
    if (!id) return
    const story = await storyService.getById(id)
    render('Story', story)
}

async function onRemoveStory() {
    const id = prompt('Story id?')
    if (!id) return
    await storyService.remove(id)
    render('Removed Story')
}

async function onAddStory() {
    await userService.login({ username: 'shira', password: 'shira1' })
    const savedStory = await storyService.save(storyService.getEmptyStory())
    render('Saved Story', savedStory)
}

async function onAddStoryComment() {
    await userService.login({ username: 'shira', password: 'shira1' })
    const id = prompt('Story id?')
    if (!id) return

    const savedComment = await storyService.addStoryComment(id, 'some comment')
    render('Saved Comment', savedComment)
}

function render(title, mix = '') {
    console.log(title, mix)
    const output = prettyJSON(mix)
    document.querySelector('h2').innerText = title
    document.querySelector('pre').innerHTML = output
}

