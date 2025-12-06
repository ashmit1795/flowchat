import { LoaderIcon } from "lucide-react";
import React from "react";

const Loading = ({ "data-theme": dataTheme }) => {
    return <div className="min-h-screen flex items-center justify-center" data-theme={dataTheme}>
        <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>;
};

export default Loading;
