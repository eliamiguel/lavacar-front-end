"use client"; 

import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { makeRequest } from '../../../axios';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';


export default function MainHome({children}:{children:ReactNode}) {
    const router = useRouter()

    const { data, isError, error, isSuccess}= useQuery({
      queryKey:["refresh"],
      queryFn:async ()=> await makeRequest.get('/auth/refresh')
      .then((res)=>{
        return res.data;
      }),
      retry:false,
      refetchInterval:60 * 50 * 1000
    })
  
    if(isSuccess){
      console.log(data.message)
    }
  
    useEffect(()=>{
      if(isError){
        console.log(error)
        router.push('/login')
      }
    }, [isError, error, router])

  return (
    <div>
      <Sidebar/>
      <Header/>
        {children}

    </div>
    
  );
}