import { v2 as cloudinary } from 'cloudinary'
import env from '../configs/environment.js'

// config cloudinary
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})


const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        })
      }
    )
    stream.end(buffer)
  })
}

const cloudinaryProvider = {
  uploadImageBuffer: async (buffer, folder = 'Readify') => {
    return await uploadFromBuffer(buffer, folder)
  },

  deleteImage: async (publicId) => {
    return await cloudinary.uploader.destroy(publicId)
  }
}

export default cloudinaryProvider