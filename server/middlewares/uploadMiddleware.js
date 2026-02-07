import multer from 'multer'

const storage = multer.memoryStorage()

const upload = multer({ storage })

const uploadBookImages = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
])

export default { upload, uploadBookImages }
