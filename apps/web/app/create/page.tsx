import { getServerSession } from "next-auth";
import CreateLink from "@/components/CreateLink"; 
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";

export default async function Create() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50/30 flex flex-col text-foreground">
      <Header user={session.user} />
      <main className="flex-1">
        <CreateLink />
      </main>
    </div>
  );
}
