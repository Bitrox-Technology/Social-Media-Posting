import mongoose from "mongoose";
const connectDB = async () => {
    try{
        console.log(process.env.MONGODB_URL, process.env.DB_NAME)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log(`MongoDB connects !! DB Host: ${connectionInstance.connection.host}`)
    }catch(err){
        console.log("MONGODB CONNECTION FAILED: ", err);
        process.exit(1);
    }
}

export default connectDB;