'use client'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";



export default function FormLogIn() {
    const router = useRouter();
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form is submitted

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true); // Set formSubmitted to true when the form is submitted

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidEmail(false);
        }

        // Password validation
        if (!password) {
            setValidPassword(false);
        }

        // Proceed with form submission if all fields are valid
        if (emailRegex.test(email) && password) {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            console.log("RESPONSE", { response });

            if (!response?.error) {
                router.push('/');
                router.refresh();
            }
        }
    };

    // Function to handle input change
    const handleInputChange = () => {
        if (formSubmitted) {
            setFormSubmitted(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md mt-10">
            <label htmlFor="email">Email:</label>
            <input
                id="email"
                name="email"
                className={`border ${validEmail ? 'border-black' : 'border-red-500'} text-black`}
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
                className={`border ${validPassword ? 'border-black' : 'border-red-500'} text-black`}
                type="password"
                placeholder="Enter your password"
                onChange={handleInputChange}
            />
            {!validPassword && formSubmitted && (
                <p className="text-red-500">Please enter your password.</p>
            )}

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Log In
            </button>
        </form>
    );
}