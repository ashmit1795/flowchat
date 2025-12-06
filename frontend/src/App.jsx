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
import { Loading } from "./components";
import useAuthUser from "./hooks/useAuthUser";

const App = () => {
	const { isLoading, authenticatedUser } = useAuthUser();

	const isAuthenticated = Boolean(authenticatedUser);
	const isOnboarded = Boolean(authenticatedUser?.isOnboarded);

	return isLoading ? (
		<Loading data-theme="forest" />
	) : (
		<div className="h-screen" data-theme="night">
			<Routes>
				<Route path="/" element={isAuthenticated && isOnboarded ? (<Home />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
				<Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
				<Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
				<Route path="/onboarding" element={isAuthenticated && !isOnboarded ? <Onboarding /> : <Navigate to="/" />} />
				<Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
				<Route path="/call" element={isAuthenticated ? <Call /> : <Navigate to="/login" />} />
				<Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
			</Routes>

			<Toaster />
		</div>
	);
};

export default App;
