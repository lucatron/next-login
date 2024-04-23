import { getServerSession } from "next-auth";
import FormLogIn from "./formLogIn";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default async function LoginPage() {
    // const router = useRouter();
    const session = await getServerSession();
    if (session) {
        // router.push('/');
        // router.refresh();
        redirect('/');
    }
    return (
        <div>
            <FormLogIn />
        </div>


    )
}