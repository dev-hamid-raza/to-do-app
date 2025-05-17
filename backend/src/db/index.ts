import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("\n MongoDB is connected and Hosted:", connectionInstance.connection.host)
    } catch (error) {
        console.log('Mongo DB error', error)
        process.exit(1)
    }
}

export default connectDB