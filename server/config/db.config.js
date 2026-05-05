import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected")
        );
        await mongoose.connect(`mongodb+srv://Elearn:MGCSE.elearn@elearndb.tdafbfj.mongodb.net/?retryWrites=true&w=majority&appName=ElearnDB`)
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;

// added cmd line