import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

// ✅ Always check both key and secret
if (!ENV.STREAM_API_KEY || !ENV.STREAM_API_SECRET) {
  throw new Error("Stream API key and secret must be defined in environment variables.");
}

// ✅ Create Stream client instance
export const streamClient =  new StreamClient(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);
export const chatClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("✅ User upserted to Stream:", userData.id);
  } catch (error) { // ❗ you missed `(error)` before
    console.error("❌ Failed to upsert user to Stream:", error);
  }
};
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("🗑️ User deleted from Stream:", userId);
  } catch (error) {
    console.error("❌ Failed to delete user from Stream:", error);
  }
};
