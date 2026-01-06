"use client"

import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div>
      User name:{session?.user?.name}
      User email:{session?.user?.email}
      <div onClick={()=>signIn("google",{ callbackUrl: "/" })}>
        Login Google
      </div>
      <div onClick={()=>signIn("github",{ callbackUrl: "/" })}>
        Login github
      </div>
    </div>
  );
}
