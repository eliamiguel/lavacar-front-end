'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    router.push('/login');
  }, [router])

  return (
   <div className="flex justify-center items-center min-h-screen">
      <p>Redirecionando...</p>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    </div>
  );
}
