import mongoose from "mongoose";
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    clerkId:{
        type: String,
        required: true,
        unique: true
    },
    imageUrl:{
        type: String,
        required: true
    },
},
    {timestamps:true}
);
const Client = mongoose.model("Client", clientSchema);
export default Client;