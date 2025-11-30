import { streamClient, chatClient } from "../lib/stream.js";
import Session from "../models/Session.js";

// ✅ Create Session
export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id; // ✅ should be req.user, not res.user
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newSession = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });
    if (!newSession) {
      return res.status(500).json({ message: "Failed to create session" });
    }

    // create Stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      created_by_id: clerkId,
      data: {
        problem,
        difficulty,
        session: newSession._id.toString(),
      },
    });

    // create Stream chat channel
    const channel = chatClient.channel("messaging", callId, {
      created_by_id: clerkId,
      name: `${problem} Session`,
      members: [clerkId], // ✅ should be clerkId, not userId
    });
    await channel.create();

    return res.status(201).json({ session: newSession });
  } catch (error) {
    console.error("❌ Failed to create session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Get Active Sessions
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name email profileImage clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("❌ Failed to fetch active sessions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Get Past Sessions
export async function getPastSessions(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("❌ Failed to fetch recent sessions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Get Session By ID
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("❌ Failed to fetch session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ End Session
export async function endSessionById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    session.status = "completed";
    await session.save();

    // delete Stream resources
    await streamClient.video.call("default", session.callId).delete({ hard: true });
    await chatClient.channel("messaging", session.callId).delete();

    return res.status(200).json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("❌ Failed to end session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Join Session
export async function joinSessionById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join an inactive session" });
    }
    if( session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join as participant" });
    }
    if (session.participant) {
      return res.status(400).json({ message: "Session is already full" });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    return res.status(200).json({ session });
  } catch (error) {
    console.error("❌ Failed to join session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
