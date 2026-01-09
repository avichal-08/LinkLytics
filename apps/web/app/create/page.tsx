import { getServerSession } from "next-auth"
import CreateLink from "../../components/createLink"
import { authOptions } from "../../lib/configs/authOptions"
import { redirect } from "next/navigation"

export default async function Create() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <CreateLink />
    </div>
  )
}
