'use client'
import 'bootstrap/dist/css/bootstrap.css';
import './page.module.css';
import './globals.css';


export default function Home({children}) {
  return (
    <main >
      {children}
    </main>
  );
}
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';

// // Define Home component
// const Home = () => {
//   const router = useRouter();

//   useEffect(() => {
//     // Ensure router is available before using it
//     if (router) {
//       router.replace('/pages/tables');
//     }
//   }, [router]); // Depend on router to ensure useEffect runs when router changes

//   return null; // Since this is a redirecting component, return null
// };

// export default Home;