'use client';
import { FormEvent, useState } from "react";

export default function Form() {
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [validFullName, setValidFullName] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form is submitted
    const [emailInUseError, setEmailInUseError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true); // Set formSubmitted to true when the form is submitted

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const repeatPassword = formData.get("repeatPassword") as string;
        const fullName = formData.get("fullName") as string;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidEmail(false);
        }

        // Password validation
        if (password.length < 3) {
            setValidPassword(false);
        } else {
            setValidPassword(true); // Clear the password validation error if password length is valid
        }


        // Check if passwords match
        if (password !== repeatPassword) {
            setPasswordsMatch(false);
        }

        // Full name validation
        if (!fullName.trim().length) {
            setValidFullName(false);
        }

        // Proceed with form submission if all fields are valid
        if (emailRegex.test(email) && password.length >= 3 && password === repeatPassword && fullName.trim().length > 0) {
            const response = await fetch('/api/auth/register', {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // Reset form state
                setFormSubmitted(false);
                setValidEmail(true);
                setValidPassword(true);
                setPasswordsMatch(true);
                setValidFullName(true);
                setEmailInUseError('');
            } else {
                const data = await response.json();
                if (response.status === 409) {
                    // Email already in use
                    setEmailInUseError(data.error);
                }
            }
        }
    };

    // Function to handle input change
    const handleInputChange = () => {
        // Reset the email validation error when any input changes
        setValidEmail(true);
        // Reset the full name validation error when any input changes
        setValidFullName(true);
        if (formSubmitted) {
            setFormSubmitted(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md mt-10">
            <label htmlFor="fullName">Full Name:</label>
            <input
                id="fullName"
                name="fullName"
                className={`border ${validFullName ? 'border-black' : 'border-red-500'} text-black`}
                type="text"
                placeholder="Enter your full name"
                onChange={handleInputChange}
            />
            {!validFullName && formSubmitted && (
                <p className="text-red-500">Please enter your full name.</p>
            )}

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
            {emailInUseError && (
                <p className="text-red-500">{emailInUseError}</p>
            )}

            <label htmlFor="password">Password:</label>
            <input
                id="password"
                name="password"
                className={`border ${validPassword ? 'border-black' : 'border-red-500'} text-black`}
                type="password"
                placeholder="Enter a password (min. 8 characters)"
                onChange={handleInputChange}
            />
            {!validPassword && formSubmitted && (
                <p className="text-red-500">Password must be at least 8 characters long.</p>
            )}

            <label htmlFor="repeatPassword">Repeat Password:</label>
            <input
                id="repeatPassword"
                name="repeatPassword"
                className={`border ${passwordsMatch ? 'border-black' : 'border-red-500'} text-black`}
                type="password"
                placeholder="Repeat your password"
                onChange={handleInputChange}
            />
            {!passwordsMatch && formSubmitted && (
                <p className="text-red-500">Passwords do not match.</p>
            )}



            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Register
            </button>
        </form>
    );
}
