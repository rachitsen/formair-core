'use client';
import { trpc } from "~/trpc/client";

export default function Home() {
  const {data} = trpc.chaicode.useQuery({email:"anb@gmail.com"})
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2>Server message: {data?.message}</h2>
      </div>
    </main>
  );
}
