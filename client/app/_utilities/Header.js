"use client";
import {useState, useEffect} from "react";
import { useRouter, usePathname } from 'next/navigation';
import secureLocalStorage from "react-secure-storage";
// import 'react-toastify/dist/ReactToastify.css';

const Useractions = () => {
  // const [isSigned, setIsSigned] = useState(false);
  // useEffect(() => {
  //   return (
  //     <>
  //     (isSigned == true && loggedToken) ?
  //     <button type="submit" className='text-link' onClick={()=>{ secureLocalStorage.clear(); router.push("/account"); }}><b>Sign Out</b></button>
  //     : <button type="submit" className='text-link'><b>Sign In</b></button>
  //     </>
  //   )
  // })
} 

export default function Header() {
  const router = useRouter();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [isSigned, setIsSigned] = useState(false);
  
//   const loggedToken = secureLocalStorage.getItem("jwtToken");
//   useEffect(() => {
//     if(!loggedToken){
//       router.replace("/account");
//       setIsSigned(false);
//     }else {
//       setIsSigned(true);
//     }
//   }, [loggedToken, router])
  

  let toggleSidebar = () => {
    if (value == "open-sidebar") {
      setisSidebarOpen("");
      dispatch(setDrawerState("closed-sidebar"));
    } else {
      setisSidebarOpen("open");
      dispatch(setDrawerState("open-sidebar"));
    }
  };

  
  const logOut = async ()=>{
    // await getRequest("/logout");
    secureLocalStorage.removeItem("jwtToken")
  }

  const pathname = usePathname()

  return (
    <header className="top-header w-full py-3 bg-white sticky top-0 z-40 shadow">
      <div className="row">
        <div className="container">
            <div className="grid grid-cols-3 items-center justify-center space-x-2">
                <div className='cursor-pointer '>{(pathname != "/") && <span className='w-10 flex bg-[#333] rounded-lg border border-gray-300 p-1 transition-colors hover:border-gray-300 hover:bg-theme-black  text-white  hover:text-white' onClick={() => router.back()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg></span>}</div>
                <div className="flex justify-center">
                    <a href="/">
                    <b>CAPTURED.</b>
                    {/* <img src="/images/bjss-logo.png" width={60} alt="srhr-logo" className="rounded-[0] bg-none" /> */}
                    </a>
                </div>
                <div className="account-widget flex items-center justify-end text-black">
                  {
                    (isSigned == true) ?
                    <button type="submit" className='text-link' onClick={()=>{ secureLocalStorage.clear(); router.push("/account"); }}><b>Sign Out</b></button>
                    : <button type="submit" className='text-link'><b>Sign In</b></button>
                  }
                </div>
            </div>
        </div>
      </div>
    </header>
  );
}