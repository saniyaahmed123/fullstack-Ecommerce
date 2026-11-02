import ImageKit from '@imagekit/nodejs'

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});


const uploadFile = async (buffer, fileName = `image${Date.now()}.jpg`) => {
    const result = await client.files.upload({
        file: buffer.toString('base64'),
        fileName,
        folder: 'product'
    })
    return result
}

export const deleteFile = async (fileId) => client.files.delete(fileId)
// Basic URL without transformations
// Result: https://ik.imagekit.io/your_imagekit_id/path/to/image.jpg
export default uploadFile