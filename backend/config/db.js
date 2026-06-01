import mongoose from 'mongoose';

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB Connected ZingaLALA :${conn.connection.host}`);

    } catch(error){
        console.log(`Error h Guru: ${error.message}`)
        process.exit(1);
    }
};
export default connectDB;