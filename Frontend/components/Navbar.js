
import Link from 'next/link';
import { getUser, logout } from '../lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar(){

    const [u,setU]= useState(null)
    const router = useRouter()

    useEffect(()=> {setU(getUser())},[])

    const onLogout = () => {
        logout()
        router.push('/login')
    }




    return(
        <div className="nav">
      <div className="nav-inner">
        <div className="brand"><Link href="/">Hospital</Link></div>
        <div>
          {!u && (<>
            <Link href="/login">Login</Link>
            <Link href="/register" style={{marginLeft:12}}>Register</Link>
          </>)}
          {u && u.role === 'PATIENT' && (<>
            <Link href="/doctors">Doctors</Link>
            <Link href="/appointments" style={{marginLeft:12}}>My Appointments</Link>
            <a onClick={onLogout} style={{marginLeft:12, cursor:'pointer'}}>Logout</a>
          </>)}
          {u && u.role === 'ADMIN' && (<>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/doctors" style={{marginLeft:12}}>Manage Doctors</Link>
            <a onClick={onLogout} style={{marginLeft:12, cursor:'pointer'}}>Logout</a>
          </>)}
        </div>
      </div>
    </div>
    )
}

