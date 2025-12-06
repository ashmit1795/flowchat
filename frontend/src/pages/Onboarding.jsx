import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import toast from "react-hot-toast";
import { FEMALE_AVATARS, LANGUAGES, MALE_AVATARS } from "../constants";
import { CameraIcon, ShuffleIcon, MapPinIcon, FlowerIcon, LoaderIcon } from "lucide-react";

const Onboarding = () => {
	const { authenticatedUser } = useAuthUser();
	const queryClient = useQueryClient();

	const [formState, setFormState] = useState({
		fullName: authenticatedUser?.fullName || "",
		bio: authenticatedUser?.bio || "",
		nativeLanguage: authenticatedUser?.nativeLanguage || "",
		learningLanguage: authenticatedUser?.learningLanguage || "",
		location: authenticatedUser?.location || "",
		avatarUrl: authenticatedUser?.avatarUrl || "",
		gender: authenticatedUser?.gender || "other",
	});

	const { mutate: onboardingMutation, isPending } = useMutation({
		mutationFn: () => completeOnboarding(formState),
		onSuccess: () => {
			toast.success("Onboarding completed successfully!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Onboarding failed. Please try again.");
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onboardingMutation();
	}

	const handleRandomAvatar = () => {
		let randomAvatarId;
		let randomAvatarUrl;
		if (formState.gender === "male") {
			randomAvatarId = MALE_AVATARS[Math.floor(Math.random() * MALE_AVATARS.length)];
			randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;
		} else if (formState.gender === "female") {
			randomAvatarId = FEMALE_AVATARS[Math.floor(Math.random() * FEMALE_AVATARS.length)];
			randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;
		} else {
			randomAvatarId = Math.floor(Math.random() * 100) + 1;
			randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;
		}

		setFormState({ ...formState, avatarUrl: randomAvatarUrl });
		toast.success("Random avatar generated!");
	}
	return (
		<div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
			<div className="card bg-base-200 w-full max-w-3xl shadow-xl">
				<div className="card-body p-6 sm:p-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* PROFILE PIC CONTAINER */}
						<div className="flex flex-col items-center justify-center space-y-4">
							{/* IMAGE PREVIEW */}
							<div className="size-32 rounded-full bg-base-300 overflow-hidden">
								{formState.avatarUrl ? (
									<img src={formState.avatarUrl} alt="Profile Preview" className="w-full h-full object-cover" />
								) : (
									<div className="flex items-center justify-center h-full">
										<CameraIcon className="size-12 text-base-content opacity-40" />
									</div>
								)}
							</div>

							{/* Generate Random Avatar BTN */}
							<div className="flex items-center gap-2">
								<button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
									<ShuffleIcon className="size-4 mr-2" />
									Generate Random Avatar
								</button>
							</div>
						</div>

						{/* FULL NAME */}
						<div className="form-control">
							<label htmlFor="fullName" className="label">
								<span className="label-text">Full Name</span>
							</label>
							<input
								id="fullName"
								type="text"
								name="fullName"
								value={formState.fullName}
								onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
								className="input input-bordered w-full"
								placeholder="Your full name"
							/>
						</div>

						{/* BIO */}
						<div className="form-control">
							<label htmlFor="bio" className="label">
								<span className="label-text">Bio</span>
							</label>
							<textarea
								id="bio"
								name="bio"
								value={formState.bio}
								onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
								className="textarea textarea-bordered h-24 w-full"
								placeholder="Tell others about yourself and your language learning goals"
							/>
						</div>

						{/* LANGUAGES */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* NATIVE LANGUAGE */}
							<div className="form-control">
								<label htmlFor="nativeLanguage" className="label">
									<span className="label-text">Native Language</span>
								</label>
								<select
									id="nativeLanguage"
									name="nativeLanguage"
									value={formState.nativeLanguage}
									onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
									className="select select-bordered w-full"
								>
									<option value="">Select your native language</option>
									{LANGUAGES.map((lang) => (
										<option key={`native-${lang}`} value={lang.toLowerCase()}>
											{lang}
										</option>
									))}
								</select>
							</div>

							{/* LEARNING LANGUAGE */}
							<div className="form-control">
								<label htmlFor="learningLanguage" className="label">
									<span className="label-text">Learning Language</span>
								</label>
								<select
									id="learningLanguage"
									name="learningLanguage"
									value={formState.learningLanguage}
									onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
									className="select select-bordered w-full"
								>
									<option value="">Select language you're learning</option>
									{LANGUAGES.map((lang) => (
										<option key={`learning-${lang}`} value={lang.toLowerCase()}>
											{lang}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* LOCATION */}
						<div className="form-control">
							<label htmlFor="location" className="label">
								<span className="label-text">Location</span>
							</label>
							<div className="relative">
								<MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
								<input
									id="location"
									type="text"
									name="location"
									value={formState.location}
									onChange={(e) => setFormState({ ...formState, location: e.target.value })}
									className="input input-bordered w-full pl-10"
									placeholder="City, Country"
								/>
							</div>
						</div>
						{/* Gender Field */}
						<div className="form-control w-full">
							<label htmlFor="gender" className="label">
								<span className="label-text">Gender</span>
							</label>
							<select
								id="gender"
								className="select select-bordered w-full"
								value={formState.gender}
								onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
								required
							>
								<option value="">Select your gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
						</div>

						{/* SUBMIT BUTTON */}

						<button className="btn btn-primary w-full" disabled={isPending} type="submit">
							{!isPending ? (
								<>
									<FlowerIcon className="size-5 mr-2" />
									Complete Onboarding
								</>
							) : (
								<>
									<LoaderIcon className="animate-spin size-5 mr-2" />
									Onboarding...
								</>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Onboarding;
