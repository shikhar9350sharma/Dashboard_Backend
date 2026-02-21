import mongoose from 'mongoose'
const connectDB = async (req, res) => { 
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log('Mongodb error: ', error)
    }
}
export default connectDB;