import React from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import useLogout from "../../hooks/useLogout";
import { BellIcon, FlowerIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "../ThemeSelector/ThemeSelector";

const Navbar = () => {
    const { authenticatedUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname.startsWith("/chat");

    const { logoutMutation } = useLogout();
    return (
		<nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-end w-full">
					{/* Logo - Only in the chat page */}
					{isChatPage && (
						<div className="pl-5">
							<Link to="/" className="flex items-center gap-2.5">
								<FlowerIcon className="size-9 text-primary" />
								<span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
									FlowChat
								</span>
							</Link>
						</div>
					)}

					<div className="flex items-center gap-3 sm:gap-4 ml-auto">
						<Link to={"/notifications"}>
							<button className="btn btn-ghost btn-circle">
								<BellIcon className="h-6 w-6 text-base-content opacity-70" />
							</button>
                        </Link>
                        
						{/*TODO: Theme Selector */}
						<ThemeSelector />

                        {/* User Avatar */}
                        <div className="avatar">
                            <div className="w-9 rounded-full">
                                <img loading="lazy" src={authenticatedUser?.avatarUrl} alt="User Avatar" rel="noreferrer" />
                            </div>
                        </div>

                        {/* Logout button */}
                        <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                        </button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
