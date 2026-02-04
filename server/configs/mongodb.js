import mongoose from 'mongoose'
import env from './environment.js'

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI)
        console.log('MongoDB connected success');
    } catch (error) {
        console.log("MongoDB connected failed: ", error);
        process.exit(1)
    }
}

export default connectDB