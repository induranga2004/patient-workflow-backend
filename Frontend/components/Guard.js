// components/Guard.js
import { useEffect } from 'react';
import { getUser } from '../lib/auth';
import { useRouter } from 'next/router';

export function withAuth(AllowedRoles = []) {
  return function(Wrapped){
    return function Guarded(props){
      const router = useRouter();
      useEffect(()=>{
        const u = getUser();
        if(!u){ router.replace('/login'); return; }
        if(AllowedRoles.length && !AllowedRoles.includes(u.role)){
          router.replace('/'); return;
        }
      },[router]);
      return <Wrapped {...props} />;
    };
  };
}
