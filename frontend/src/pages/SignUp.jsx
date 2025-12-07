import { useState } from "react";
import { LucideFlower } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUp = () => {
	const [signupData, setSignupData] = useState({
		fullName: "",
		email: "",
		password: ""
	});

	const { signUpMutation, isPending, error } = useSignUp();

	const handleSignUp = (e) => {
		e.preventDefault();
		signUpMutation(signupData);
	}
	return (
		<div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
			<div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
				{/* Left Side - Sign Up Form */}
				<div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
					{/* Logo and Title */}
					<div className="mb-4 flex items-center justify-start gap-2">
						<LucideFlower className="size-9 text-primary" />
						<span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">
							FlowChat
						</span>
					</div>
					{/* Error Message */}
					{/* {
						error && toast.error(error.response.data.message)
					} */}
					{error && (
						<div className="alert alert-error mb-4">
							<span>{error.response.data.message}</span>
						</div>
					)}


					<div className="w-full">
						<form onSubmit={handleSignUp}>
							<div className="space-y-4">
								<div>
									<h2 className="text-xl font-semibold">Create your account</h2>
									<p className="text-sm opacity-70">Join FlowChat and Start your Language Learning Journey!</p>
								</div>
								<div className="space-y-3">
									{/* Full Name Field */}
									<div className="form-control w-full">
										<label htmlFor="fullName" className="label">
											<span className="label-text">Full Name</span>
										</label>
										<input
											id="fullName"
											type="text"
											placeholder="Your full name"
											className="input  w-full"
											value={signupData.fullName}
											onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
											required
										/>
									</div>
									{/* Email Field */}
									<div className="form-control w-full">
										<label className="label">
											<span className="label-text">Email</span>
										</label>
										<input
											id="email"
											type="email"
											placeholder="Your email"
											className="input input-bordered w-full"
											value={signupData.email}
											onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
											required
										/>
									</div>
									{/* Password Field */}
									<div className="form-control w-full">
										<label htmlFor="password" className="label">
											<span className="label-text">Password</span>
										</label>
										<input
											id="password"
											type="password"
											placeholder="Your password"
											className="input input-bordered w-full"
											value={signupData.password}
											onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
											required
										/>
										<p className="text-xs opacity-70 mt-1">Your password must be at least 6 characters long.</p>
									</div>
									{/* Gender Field */}
									<div className="form-control w-full">
										<label htmlFor="gender" className="label">
											<span className="label-text">Gender</span>
										</label>
										<select
											id="gender"
											className="select select-bordered w-full"
											value={signupData.gender}
											onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
											required
										>
											<option value="">Select your gender</option>
											<option value="male">Male</option>
											<option value="female">Female</option>
											<option value="other">Other</option>
										</select>
									</div>
									{/* Terms and Conditions */}
									<div className="form-control">
										<label htmlFor="terms" className="label cursor-pointer justify-start gap-2">
											<input id="terms" type="checkbox" className="checkbox checkbox-sm" required />
											<span className="text-xs leading-tight">
												I agree to the{" "}
												<a href="#" className="text-primary hover:underline">
													Terms of Service
												</a>{" "}
												and{" "}
												<a href="#" className="text-primary hover:underline">
													Privacy Policy
												</a>
												.
											</span>
										</label>
									</div>
									{/* Sign Up Button */}
									<button className="btn btn-primary w-full" type="submit">
										{isPending ? 
											<>
												<span className="loading loading-spinner loading-xs">
												Loading...
											</span>
											</>
										: "Sign Up"}
									</button>
									{/* Link to Login Page */}
									<div className="text-center mt-4">
										<p className="text-sm">
											Already have an account?{" "}
											<Link to="/login" className="text-primary hover:underline">
												Log In
											</Link>
										</p>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>

				{/* Right Side - Decorative Image */}
				<div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
					<div className="max-w-md p-8">
						{/* Illustration */}
						<div className="relative aspect-square max-w-sm mx-auto">
							<img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
						</div>

						<div className="text-center space-y-3 mt-6">
							<h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
							<p className="opacity-70">Practice conversations, make friends, and improve your language skills together</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
