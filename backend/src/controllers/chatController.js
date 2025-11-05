import {streamClient} from "../lib/stream.js";

export async function getStreamToken(req,res){
    try{
        const token = streamClient.createToken(res.user.clerkId);
        return  res.status(200).json({token,id:res.userName.clerkId,userName:res.user.name
            ,userImage:res.user.profileImage
        });
    }catch(error){
        console.error("❌ Failed to create Stream token:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }


}