import { Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import DarkMode from '@/DarkMode';
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';



const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

    const logoutHandler = async () => {
        await logoutUser();
    }
    console.log("user->", user);
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "User Logout");
            navigate("/");
        }

    }, [isSuccess])

    return (
        <div className='h-16 dark:bg-[#020817] bg-white border-b dark:border-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
                <div className='flex items-center gap-2'>
                    <School size={"30"} />
                    <Link to="/">
                        <h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1>
                    </Link>
                    
                </div>
                <div className='flex items-center gap-8'>
                    {/* user icon and dark mode */}
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className='w-11 h-11 rounded-full overflow-hidden flex items-center'>
                                        <Avatar >
                                            <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} className="w-full h-full object-cover rounded-full" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>

                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" >
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to={"/mylearning"}>My learning</Link>

                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link to={"/profile"}>Edit Profile</Link>

                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={logoutHandler}>
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    {
                                        user?.role === "instructor" && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link to="/admin/dashboard">
                                                        Dashboard
                                                    </Link>
                                                    
                                                </DropdownMenuItem>
                                            </>
                                        )
                                    }

                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                                <Button onClick={() => navigate("/login")}>Signup</Button>
                            </div>
                        )

                    }
                    <DarkMode/>
                </div>
            </div>
            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl'>E-learning</h1>
                <MobileNavbar user={user}/>
            </div>

        </div>
    )
};
export default Navbar;

const MobileNavbar = ({user}) => {
    const navigate =useNavigate();
    const role = 'instructor';
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                    <SheetHeader className="flex flex-row items-center justify-between mt-5">
                        <SheetTitle><Link to={"/"}>E-Learning</Link></SheetTitle>
                        <DarkMode />
                    </SheetHeader>
                    {/* <Separator className="mr-2"/> */}
                    <nav className='flex flex-col space-y-3 ml-3'>
                        <Link to="/mylearning">My Learning</Link>
                        <Link to="/profile">Edit Profile</Link>
                        <p>Log out</p>
                    </nav>
                    {
                        user?.role === 'instructor' && (
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit" onClick={()=>navigate("/admin/dashboard")}>Dashboard</Button>
                                </SheetClose>
                            </SheetFooter>
                        )
                    }

                </SheetContent>
            </Sheet>


        </div>
    )
}