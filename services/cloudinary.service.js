import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

export async function removeImg(publicId) {
    console.log(process.env.CLOUD_NAME)
    console.log(`publicId`, publicId)
    return await cloudinary.uploader.destroy(publicId)
}
