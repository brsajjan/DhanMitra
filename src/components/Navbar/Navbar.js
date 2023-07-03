import React from "react";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Card,
} from "@material-tailwind/react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import DhanLogo from "../../Src_Images/dhanmitra_LOGO.png"

export default function Example() {
    const [openNav, setOpenNav] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);

    // logout function
    const navigate = useNavigate();
    const handleLogOut = () => {
        let popup = window.confirm("do you want to logout")
        if (popup === true) {
            navigate("/")
        } else {
            console.log("")
        }
    }

    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 FontStyle font-medium text-[17px]"
            >
                <NavLink to="/home" className="flex items-center">
                    Home
                </NavLink>

            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 FontStyle font-medium text-[17px]"
            >
                <NavLink to="/All Clients" className="flex items-center">
                    All Clients
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 FontStyle font-medium text-[17px]"
            >
                <NavLink to="/Transactions" className="flex items-center">
                    Transactions
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 FontStyle font-medium text-[17px]"
                onClick={handleLogOut}
            >
                <Button size="sm" fullWidth className="bg-red-500">
                    <span>Logout</span>
                </Button>
            </Typography>
        </ul>
    );


    return (
        <div className="sticky top-0 z-10 FontStyle pt-2 px-2">
            <Navbar className=" max-w-full py-2 px-4 lg:px-10 lg:py-3 ">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <Link
                        as="a"
                        to="/home"
                        className="LogoFontStyle flex justify-center items-center gap-2 mr-4 cursor-pointer text-[28px] font-bold "
                    >
                        <img className="w-10" src={DhanLogo} alt="" />
                        <span><span className="text-[#2563eb]">Dhan</span><span className="text-[#f97316]">Mitra</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{navList}</div>

                        <IconButton
                            variant="text"
                            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                            ripple={false}
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </IconButton>
                    </div>
                </div>
                <MobileNav open={openNav}>
                    {navList}
                </MobileNav>
            </Navbar>
        </div>
    );
}






