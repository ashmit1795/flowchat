import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { StreamVideo, StreamVideoClient, StreamCall, CallControls, SpeakerLayout, StreamTheme, CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import ENV from "../config/env";
import toast from "react-hot-toast";
import { Loading } from "../components";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader } from "lucide-react";


const STREAM_API_KEY = ENV.STREAM_API_KEY

const Call = () => {
	const { id: callId } = useParams();
	const [client, setClient] = useState(null);
	const [call, setCall] = useState(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const { authenticatedUser, isLoading } = useAuthUser();

	const { data: tokenData } = useQuery({
		queryKey: ["stream-token"],
		queryFn: getStreamToken,
		enabled: !!authenticatedUser
	});

	useEffect(() => {
		const initCall = async () => {
			if (!tokenData || !authenticatedUser || !callId) return;
			
			try {
				console.log("Initializing Stream Video Client ....");
				const user = {
					id: authenticatedUser._id,
					name: authenticatedUser.fullName,
					image: authenticatedUser.avatarUrl
				}

				const videoClient = new StreamVideoClient({
					apiKey: STREAM_API_KEY,
					user,
					token: tokenData,
				});

				const callInstance = videoClient.call("default", callId);
				
				await callInstance.join({
					create: true
				});

				console.log("Joined Call Successfully");

				setClient(videoClient);
				setCall(callInstance);
			} catch (error) {
				console.error("Error initializing call:", error);
				toast.error("Failed to initialize call");
			} finally {
				setIsConnecting(false);
			}
		}

		initCall();
	}, [tokenData, authenticatedUser, callId]);

	if (isLoading || isConnecting) return <Loading />;

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<div className="relative">
				{client && call ? (
					<StreamVideo client={client}>
						<StreamCall call={call}>
							<CallContent />
						</StreamCall>
					</StreamVideo>
				) : (
						<div className="flex items-center justify-center h-full">
							<Loader />
						</div>
				)}
			</div>
		</div>
	)

};

const CallContent = () => {
	const { useCallCallingState } = useCallStateHooks();
	const callingState = useCallCallingState();
	const navigate = useNavigate();

	if (callingState === CallingState.LEFT) return navigate("/");

	return (
		<StreamTheme >
			<SpeakerLayout />
			<CallControls />
		</StreamTheme >
	)
}


export default Call;
