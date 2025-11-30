import {Link,useLocation} from "react-router";
import {SparklesIcon,BookOpenIcon, LayoutDashboardIcon} from 'lucide-react'
import {UserButton} from '@clerk/clerk-react';

function Navbar(){
    const location = useLocation();
    console.log(location);
    const isActive =(path) => path === location.pathname; 
    return(
        <div className = "bg-base-100/80 backdrop-filter-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
            <div className = "flex items-center justify-between p-4 max-w-7xl mx-auto">
            {/* LOGO */}
            <Link className = "group flex items-center gap-3 hover:scale-105 transition:transform duration-200 "
            to = "/">
                <div className = "size-10 rounded-xl bg-primary flex items-center justify-center">
                <SparklesIcon className = "size-6 text-white"/>
                </div>
                <div className = "flex flex-col">
                <span className = "font-black bg-primary flex items-center bg-clip-text text-transparent font-mono tracking-wider">
                    ShowCase
                </span>
                <span className = "text-xs text-base-content/60 font-medium -mt-1 ">
                Code Together</span>
                </div>
            </Link>
            <div className = "flex items-center gap-2">
                {/* PROBLEM PAGE LINK */}
                <Link to = "/problems"
                className = {`px-4 py-2.5 rounded-lg transition-all duration-200  ${isActive("/problems") ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}>
                    <div className = "flex items-center gap-x-2.5">
                        <BookOpenIcon className = "size-4"/>
                        <span className = "font-medium hidden sm:inline">Problems</span>
                    </div>
                </Link>
                <Link to = "/dashboard"
                className = {`px-4 py-2.5 rounded-lg transition-all duration-200  ${isActive("/dashboard") ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}>
                    <div className = "flex items-center gap-x-2.5">
                        <LayoutDashboardIcon className = "size-4"/>
                        <span className = "font-medium hidden sm:inline">Dashboard</span>
                    </div>
                </Link>
                <UserButton className = "mt-2 ml-4"/>
            </div>
            </div>
        </div>
    )
}
export default Navbar;