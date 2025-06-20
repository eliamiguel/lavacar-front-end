"use client"; 

import { ReactNode } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

export default function MainHome({children}:{children:ReactNode}) {
  return (
    <div>
      <Sidebar/>
      <Header/>
      {children}
    </div>
  );
}