import { streamClient,chatClient } from "../lib/stream.js";
import Session from "../models/Session.js";
export async function createSession(req,res){
    try{
    const {problem,difficulty} = req.body;
    const userId = res.user._id;
    const clerkId = res.user.clerkId;
    if(!problem || !difficulty){
        return res.status(400).json({message:"Problem and difficulty are required"});
    }
    const callId  = `session_${Date.now()}_${Math.random().toString(36).substring(2,8)}`;

    const newSession = await Session.create({problem,difficulty,host:userId,callId});
    await streamClient.video.call("default",callId).getOrCreate({
        created_by_id:clerkId,
        data:{
            problem,
            difficulty,
            session:newSession._id.toString(),
        }
    });
    const channel = chatClient.channel("messaging",callId,{
        created_by_id:clerkId,
        name:`${problem} Session`,
        members:[userId]
    });
    await channel.create();

    return res.status(201).json({session:newSession});
    }catch(error){
        console.error("❌ Failed to create session:", error);
        return res.status(500).json({message:"Internal Server Error"});

    }
}
export async function getActiveSessions(_,res){
    try{
        const sessions = await Session.find({status:'active'}).populate('host','name email profileImage clerkId')
        .sort({createdAt:-1})
        .limit(20);
        return res.status(200).json({sessions});
    }catch(error){
        console.error("❌ Failed to fetch active sessions:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
export async function getPastSessions(req,res){
try{
        const userId = res.user._id;
        const sessions = await Session.find({status:'completed' ,$or:[{host:userId},{participant:userId}]})
        .sort({createdAt:-1});
        return res.status(200).json({sessions});
    }catch(error){
        console.error("❌ Failed to fetch recent sessions:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
export async function getSessionById(req,res){
    try{
        const {id} = req.params;
        const session = await Session.findById(id)
        .populate('host','name email profileImage clerkId')
        .populate('participant','name email profileImage clerkId');
        if(!session){
            return res.status(404).json({message:"Session not found"});
        }
       
        await session.save();
 
        return res.status(200).json({session});
    }catch(error){
        console.error("❌ Failed to fetch session:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function endSessionById(req,res){
    try{
        const {id} = req.params;
        const userId = res.user._id;
        const session = await Session.findById(id);
        if(session.host.toString() !==userId.toString())
        {
            return res.status(403).json({message:"Only host can end the session"});
        }
        if(session.status === 'completed'){
            return res.status(400).json({message:"Session is already completed"});
        }
        session.status = 'completed';
        await session.save();
        await streamClient.video.call("default",session.callId).delete({hard:true});
        await chatClient.channel("messaging",session.callId).delete();
        return res.status(200).json({message:"Session ended successfully"});

    }catch(error){

    }
}
export async function joinSessionById(req,res){
    try{
const {id} = req.params;
const userId = res.user._id;
const clerkId = res.user.clerkId;
const session = await Session.findById(id);
if(!session){
    return res.status(404).json({message:"Session not found"});
}
session.participant = userId;
 if(session.status === 'active' && session.participant){
        res .status(400).json({message:"Session is already full"});
    }
        
await session.save();
const call = chatClient.channel("messaging",session.callId);
await call.addMembers([clerkId]);

return res.status(200).json({session});
}catch(error){
        console.error("❌ Failed to join session:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }

}