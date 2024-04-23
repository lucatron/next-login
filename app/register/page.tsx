import { getServerSession } from "next-auth";
import Form from "./formSignUp";
import { redirect } from "next/navigation";

export default async function RegisterPage() {

    const session = await getServerSession();
    if (session) {
        redirect('/');
    }
    return (
        <div>
            <Form />
        </div>
    )

}