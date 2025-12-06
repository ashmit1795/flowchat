import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
	const authUser = useQuery({
		queryKey: ["authUser"],
		queryFn: getAuthUser,
		retry: false, // Disable automatic retries
    });
    
    return { isLoading: authUser.isLoading, authenticatedUser: authUser.data?.data?.user || null };
};

export default useAuthUser;
