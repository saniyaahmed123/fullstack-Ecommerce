import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024, files: 10 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('only image files are allowed'))
        }
    }
})
export default upload