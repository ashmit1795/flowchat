import React from "react";
import { completeOnboarding } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useOnboarding = () => {
    const queryClient = useQueryClient();
    const { mutate: onboardingMutation, isPending } = useMutation({
            mutationFn: () => completeOnboarding,
            onSuccess: () => {
                toast.success("Onboarding completed successfully!");
                queryClient.invalidateQueries({ queryKey: ["authUser"] });
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Onboarding failed. Please try again.");
            }
        });
	return { onboardingMutation, isPending };
};

export default useOnboarding;
