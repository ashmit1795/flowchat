import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import Call from "./pages/Call";
import Chat from "./pages/Chat";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./config/axios";

const App = () => {
	const {
		data: authenticatedUserData,
	} = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const response = await axiosInstance.get("/auth/me");
			return response.data;
		},
		retry: false, // Disable automatic retries
	});

	const authenticatedUser = authenticatedUserData?.data.user || null;

	return (
		<div className="h-screen" data-theme="night">
			<Routes>
				<Route path="/" element={authenticatedUser ? <Home /> : <Navigate to="/login" />} />
				<Route path="/login" element={!authenticatedUser ? <Login /> : <Navigate to="/" />} />
				<Route path="/signup" element={!authenticatedUser ? <SignUp /> : <Navigate to="/" />} />
				<Route path="/onboarding" element={authenticatedUser ? <Onboarding /> : <Navigate to="/login" />} />
				<Route path="/notifications" element={authenticatedUser ? <Notifications /> : <Navigate to="/login" />} />
				<Route path="/call" element={authenticatedUser ? <Call /> : <Navigate to="/login" />} />
				<Route path="/chat" element={authenticatedUser ? <Chat /> : <Navigate to="/login" />} />
			</Routes>

			<Toaster />
		</div>
	);
};

export default App;
