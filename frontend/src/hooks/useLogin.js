import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login } from "../lib/api";

const useLogin = () => {
    const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		error,
	} = useMutation({
		mutationFn: login,
		onSuccess: () => {
			toast.success("Logged in successfully!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Login failed. Please try again.");
		},
	});
	return { loginMutation, isPending, error };
};

export default useLogin;
