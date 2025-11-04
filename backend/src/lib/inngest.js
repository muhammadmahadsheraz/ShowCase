import {Inngest} from 'inngest';
import {connectDB} from './db.js';
import User from "../models/User.js";// to create user in db through automation by inngest
// to create user in db through automation by inngest
export const inngest = new Inngest({id: "ShowCase"}) ;
const syncUser = inngest.createFunction(
    {id:"sync-user"}, 
    {event:"clerk/user.created"},
    async ({event}) =>{
        await connectDB();
        const {id,email_addresses,first_name,last_name,image_url} = event.data;
        const newUser = {
            clerkId:id, 
            email:email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            imageUrl:image_url            
        };

        await User.create(newUser)
    }

)
// to delete user from db through automation by inngest
const deleteUserFromDB  = inngest.createFunction(
    {id:'delete-user-from-db'},
    {event:"clerk/user.deleted"},
    async ({event}) =>{
        await connectDB();
        const {id} = event.data;
        await User.deleteOne({clerkId:id});
    }
)
export const functions = [syncUser,deleteUserFromDB]