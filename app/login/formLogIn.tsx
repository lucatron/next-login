'use client'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";



export default function FormLogIn() {
    const router = useRouter();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidEmail(false);
        }

        // Password validation
        if (password.length < 8) {
            setValidPassword(false);
        }

        if (emailRegex.test(email) && password.length >= 8) {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("RESPONSE", { response });
            if (!response?.error) {
                router.push("/");
                router.refresh();
            } else {
                if (response.error === 'Incorrect email') {
                    setLoginError('Email is incorrect. Please try again.');
                } else if (response.error === 'Incorrect password') {
                    setLoginError('Password is incorrect. Please try again.');
                } else {
                    setLoginError('Login failed. Please try again.');
                }
            }
        }
    };

    const handleInputChange = () => {
        if (formSubmitted) {
            setValidEmail(true);
            setValidPassword(true);
            setLoginError('');
            setFormSubmitted(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mx-auto max-w-md mt-10"
        >
            <label htmlFor="email">Email:</label>
            <input
                id="email"
                name="email"
                className={`border ${validEmail ? "border-black" : "border-red-500"
                    } text-black`}
                type="email"
                placeholder="Enter your email"
                onChange={handleInputChange}
            />
            {!validEmail && formSubmitted && (
                <p className="text-red-500">Please enter a valid email address.</p>
            )}

            <label htmlFor="password">Password:</label>
            <input
                id="password"
                name="password"
                className={`border ${validPassword ? "border-black" : "border-red-500"
                    } text-black`}
                type="password"
                placeholder="Enter your password"
                onChange={handleInputChange}
            />
            {!validPassword && formSubmitted && (
                <p className="text-red-500">Password must be at least 8 characters long.</p>
            )}

            {loginError && (
                <p className="text-red-500">{loginError}</p>
            )}

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Log In
            </button>
        </form>
    );
}