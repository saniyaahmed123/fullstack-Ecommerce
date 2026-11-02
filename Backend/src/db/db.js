import mongoose from 'mongoose'

let connection = null

export default function connectDB() {
    if (!connection) {
        connection = mongoose
            .connect(process.env.MONGO_URI)
            .then(() => console.log('db connected'))
            .catch((error) => {
                connection = null
                throw error
            })
    }
    return connection
}