import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import { Button } from "@material-tailwind/react";
import { onValue, ref, update } from 'firebase/database'
import { db } from "../Firebase/FirebaseConfig"
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

export default function Example() {

    const navigate = useNavigate();
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [usernameValue, setusernameValue] = useState("")
    const [passwordValue, setpasswordValue] = useState("")

    useEffect(() => {
        fetchLoginData();
    }, [])

    // fetch Login details-----------------------------------------------------------------------------------
    const fetchLoginData = () => {
        const count = ref(db, `Mains/Authentication`);
        onValue(count, (snapshot) => {
            const data = snapshot.val();;
            setpasswordValue(data.password);
            setusernameValue(data.username);
        })
    }

    // Sign in function -----------------------------------------------------------------------------------
    const handleSignIn = () => {
        if (username === usernameValue) {
            if (password === passwordValue) {
                navigate("/home")
            } else {
                alert("please enter a correct password")
            }
        } else {
            alert("please enter a valid username")
        }
    }

    // login credentials update function -----------------------------------------------------------------------------------
    const handleCredentials = () => {
        let value = prompt("Enter the secret key to change credentials")
        if (value === "07052001") {
            update(ref(db, `Mains/Authentication/`), {
                username: username,
                password: password
            });
            setusername("")
            setpassword("")
        } else {
            alert("Sorry, you cannot change the login credentials without a valid secret key")
            setusername("")
            setpassword("")
        }
    }

    const data = [
        {
            label: "Sign in",
            value: "html",
            desc: <div className='flex flex-col gap-5 mt-5'>
                <TextField label="username" autocomplete="off" variant="filled" value={username} onChange={(e) => setusername(e.target.value)} />
                <TextField label="password" autocomplete="off" type="password" variant="filled" value={password} onChange={(e) => setpassword(e.target.value)} />
                <Button onClick={handleSignIn} className='bg-gradient-to-r from-cyan-500 to-blue-500'>Sign in</Button>
            </div>,
        },
        {
            label: "Change credentials",
            value: "react",
            desc: <div className='flex flex-col gap-5 mt-5'>
                <TextField label="Enter new username" autocomplete="off" variant="filled" value={username} onChange={(e) => setusername(e.target.value)} />
                <TextField label="Enter new password" autocomplete="off" type="password" variant="filled" value={password} onChange={(e) => setpassword(e.target.value)} />
                <Button onClick={handleCredentials} className='bg-gradient-to-r from-cyan-500 to-blue-500'>Change</Button>
            </div>,
        },
    ];

    return (

        <Tabs value="html">
            <TabsHeader>
                {data.map(({ label, value }) => (
                    <Tab key={value} value={value}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {data.map(({ value, desc }) => (
                    <TabPanel key={value} value={value}>
                        {desc}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}
