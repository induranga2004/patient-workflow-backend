// pages/index.js
import { useEffect } from 'react';
import { getUser } from '../lib/auth';

export default function Home(){
  useEffect(()=>{
    const u = getUser();
    if(!u) window.location.href = '/login';
    else if(u.role === 'ADMIN') window.location.href = '/admin/dashboard';
    else window.location.href = '/doctors';
  },[]);
  return null;
}
