import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../../lib/authOptions";

export default async function Dashboard(){
    const session = await getServerSession(authOptions);
    const name = session?.user?.name;

    if(!session){
        redirect("/");
    }
    return (
        <div>
            {name}
        </div>
    )
}