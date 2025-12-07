import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout } from "../lib/api";

const useLogout = () => {
	const queryClient = useQueryClient();

	const {
		mutate: logoutMutation
	} = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			toast.success("Logged out successfully!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Logout failed. Please try again.");
		},
	});
	return { logoutMutation };
};

export default useLogout;
