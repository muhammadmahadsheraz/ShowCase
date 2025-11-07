import mongoose from "mongoose";


const sessionSchema = mongoose.Schema({
    problem:{
        type : String,
        required : true
    },
    difficulty:{
        type : String,
        enum : ['Easy', 'Medium', 'Hard'],
        required : true
    },
    host:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true

    },
    participant:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : null
    },
    status:{
        type : String,
        enum : [ 'active', 'Completed'],
        
        required : true
    },
    callId:{
        type : String,
default : null
  }
},{ timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
export default Session;