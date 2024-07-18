'use client'

import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';

export default function MyApp({children}) {
  console.log("pageprops",children);
  return (
   <div>This is page index</div>
  );
}
