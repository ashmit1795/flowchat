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
import { Layout, Loading } from "./components";
import useAuthUser from "./hooks/useAuthUser";
import useThemeStore from "./store/useThemeStore";

const App = () => {
	const { isLoading, authenticatedUser } = useAuthUser();
	const { theme } = useThemeStore();

	const isAuthenticated = Boolean(authenticatedUser);
	const isOnboarded = Boolean(authenticatedUser?.isOnboarded);

	return isLoading ? (
		<Loading data-theme={theme} />
	) : (
		<div className="h-screen" data-theme={theme}>
			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated && isOnboarded ? (
							<Layout showSidebar>
								<Home />
							</Layout>
						) : (
							<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
						)
					}
				/>
				<Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
				<Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
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
