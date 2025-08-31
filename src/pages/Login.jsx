import { AppWindowIcon, CodeIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useSignupUserMutation } from "@/features/api/authApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"



const Login = () => {
    const [signupUser, { data: signupData, error: signupError, isLoading: signupIsLoading, isSuccess: signupIsSuccess }] = useSignupUserMutation();
    const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();
    const navigate = useNavigate();

    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });

    // console.log("LoginData->",loginData);

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;

        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value });
        }
        else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    };

    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === 'signup' ? signupUser : loginUser;
        await action(inputData);
    }

    useEffect(() => {
        if (signupIsSuccess && signupData) {
            toast.success(signupData?.message || "Signup Successfull")
        }
        if (signupError) {
            toast.error(signupError?.data?.message || "Signup Failed");
        }

        if (loginIsSuccess && loginData) {
            // console.log("loginData->", loginData)
            toast.success(loginData?.message || "Login Successfull")
            navigate("/");
        }
        if (loginError) {
            console.log("Check->", loginData)
            toast.error(loginError?.data?.message || "Login Failed");
        }
    }, [loginIsLoading, signupIsLoading, loginData, signupData, loginError, signupError])
    return (
        <div className="flex item-center justify-center w-full mt-20">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Signup</CardTitle>
                                <CardDescription>
                                    Create a new account and click signup when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input type="text" name="name" value={signupInput.name} onChange={(e) => changeInputHandler(e, "signup")}
                                        placeholder="Eg. Shivam Gupta" required="true" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" name="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "signup")} placeholder="Eg. abc@gmail.com" required="true" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" name="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "signup")} placeholder="Eg. xyz" required="true" />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Role</Label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="student"
                                                checked={signupInput.role === "student"}
                                                onChange={(e) => changeInputHandler(e, "signup")}
                                                className="accent-blue-500"
                                                required
                                            />
                                            Student
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="instructor"
                                                checked={signupInput.role === "instructor"}
                                                onChange={(e) => changeInputHandler(e, "signup")}
                                                className="accent-blue-500"
                                                required
                                            />
                                            Instructor
                                        </label>
                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Button disabled={signupIsLoading} onClick={(e) => handleRegistration("signup")}>
                                    {
                                        signupIsLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 aanimate-spin" />
                                            </>
                                        ) : "Signup"
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login your password here. After signup, you'll be logged in.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" name="email" value={loginInput.email} onChange={(e) => changeInputHandler(e, "login")} placeholder="Eg. abc@gmail.com" required="true" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" name="password" value={loginInput.password} onChange={(e) => changeInputHandler(e, "login")} placeholder="Eg. xyz" required="true" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={loginIsLoading} onClick={(e) => handleRegistration("login")}>
                                    {
                                        loginIsLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 aanimate-spin" />Please wait
                                            </>
                                        ) : "Login"
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
export default Login;