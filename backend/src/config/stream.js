import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY, STREAM_API_SECRET } from './env.js';

if(!STREAM_API_KEY || !STREAM_API_SECRET) {
    console.error("Stream API credentials are not set in environment variables.");
}

const streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);

        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

export const generateStreamToken = (userId) => {
    try {
        return streamClient.createToken(userId.toString());
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
}