'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "~/hooks/api/auth";
import { trpc } from "~/trpc/client";

export default function Home() {
  const {user} = useUser();
  const router = useRouter();

  useEffect(() =>{
    if(user && user.id){
        router.replace('/dashboard')
    }
    else{
      router.replace('/login')
    }
  },[user, router])
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2>Server message: {JSON.stringify(user)}</h2>
      </div>
    </main>
  );
}
