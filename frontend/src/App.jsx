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
				<Route
					path="/notifications"
					element={
						isAuthenticated && isOnboarded ? (
							<Layout showSidebar>
								<Notifications />
							</Layout>
						) : (
							<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
						)
					}
				/>
					<Route
						path="/call/:id"
						element={isAuthenticated && isOnboarded ? (
							<Layout>
<Call />						<Chat />
							</Layout>) : (
								<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
							)} />
				<Route
					path="/chat/:id"
					element={
						isAuthenticated && isOnboarded ? (
							<Layout>
								<Chat />
							</Layout>
						) : (
							<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
						)
					}
				/>
			</Routes>

			<Toaster />
		</div>
	);
};

export default App;
