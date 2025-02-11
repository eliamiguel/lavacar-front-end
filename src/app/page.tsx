'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    router.push('/main');
  }, [router])
  return (
   <div className="flex justify-center items-center min-h-screen">
      <p>Redirecionando...</p>
    </div>
  );
}
