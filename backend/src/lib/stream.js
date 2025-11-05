import {StreamChat} from 'stream-chat';
import {ENV} from '../config/env.js';

if(ENV.STREAM_API_KEY === undefined || ENV.STREAM_API_SECRET === undefined){
    throw new Error("Stream API key and secret must be defined in environment variables.");
}
export const streamClient =  StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);
export const upsertStreamUser = async(userData) =>{

    try{
        await streamClient.upsertUser(userData);
        console.log("✅ User upserted to Stream:", userData.id); 
    }catch{
        console.error("❌ Failed to upsert user to Stream:",error);
    }
}
export const deleteStreamUser = async(userId) =>{
    try{
        await streamClient.deleteUser(userId);
        console.log("🗑️ User deleted from Stream:" ,userId)
        
    }catch(error)
    {
            console.error("❌ Failed to delete user from Stream:",error);
        }
}
//add another method to generate token


