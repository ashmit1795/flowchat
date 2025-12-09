import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { Channel, ChannelHeader, Chat as ChatComponent, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import ENV from "../config/env";
import toast from "react-hot-toast";
import { ChatLoader } from "../components";
import CallButton from "../components/CallButton/CallButton";

const STREAM_API_KEY = ENV.STREAM_API_KEY

const Chat = () => {
	const { id: targetUserId } = useParams();

	const [chatClient, setChatClient] = useState(null);
	const [channel, setChannel] = useState(null);
	const [loading, setLoading] = useState(true);

	const { authenticatedUser } = useAuthUser();

	const { data: token } = useQuery({
		queryKey: ["stream-token"],
		queryFn: getStreamToken,
		enabled: Boolean(authenticatedUser),
	});

	useEffect(() => {
		const initChat = async () => {
			if (!token || !authenticatedUser) return;
			
			try {
				console.log("Initializing chat client...");

				const client = StreamChat.getInstance(STREAM_API_KEY);

				await client.connectUser({
					id: authenticatedUser._id,
					name: authenticatedUser.fullName,
					image: authenticatedUser.avatarUrl
				}, token);

				// User A and User B will have a channel with id "A-B" regardless of who initiates the chat
				const channelId = [authenticatedUser._id, targetUserId].sort().join("-");

				const channel = client.channel("messaging", channelId, {
					members: [authenticatedUser._id, targetUserId],
				});

				await channel.watch();
				setChatClient(client);
				setChannel(channel);
			} catch (error) {
				console.error("Error initializing chat client:", error);
				toast.error("Failed to initialize chat");
			} finally {
				setLoading(false);
				console.log("Set Loading False")
			}
		}

		initChat();
	}, [token, authenticatedUser, targetUserId]);

	const handleVideoCall = () => {
		if (channel) {
			const callUrl = `${window.location.origin}/call/${channel.id}`;

			channel.sendMessage({
				text: `📞 Video Call Invitation: Click to join ${callUrl}`
			});

			toast.success("Video call invitation sent!");
		}
	}

	if (loading || !chatClient || !channel) {
		return <ChatLoader />;
	}
	return (
		<div className="h-[93vh]">
			<ChatComponent client={chatClient} >
				<Channel channel={channel}>
					<div className="w-full relative">
						<CallButton handleVideoCall={handleVideoCall}/>
						<Window>
							<ChannelHeader />
							<MessageList />
							<MessageInput focus />
						</Window>
					</div>
					<Thread />
				</Channel>
			</ChatComponent>
		</div>
	);
};

export default Chat;
