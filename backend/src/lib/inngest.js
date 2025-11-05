import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "ShowCase" });

// 🔥 FIXED EVENT NAME
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "user.created" }, // ← changed this
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);
    console.log("✅ User synced to DB:", newUser.email);
  }
);

// 🔥 FIXED EVENT NAME
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "user.deleted" }, // ← changed this
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    console.log("🗑️ User deleted from DB:", id);
  }
);

export const functions = [syncUser, deleteUserFromDB];
