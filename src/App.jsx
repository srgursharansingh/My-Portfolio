import { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import Hero from './Components/Hero';
import About from './Components/About';
import CurvedLoop from './Animation/curvedloop';
import ProjectShowcase from './Components/Projects';
import Footer from './Components/Footer';
function App() {

  return (
    <>
      <div className='items-center justify-center w-screen overflow-x-hidden bg-black'>
        <Header/>
        <Hero className='relative w-screen overflow-x-hidden'/>
        <About className='relative w-screen overflow-x-hidden z-100'/>
        <CurvedLoop 
   marqueeText="Contact ✦ Me  ✦"
   speed={3}
    curveAmount={200}
    direction="right"
    interactive={true}
    className="z-0 -mt-50 h-20vh"
  />
<ProjectShowcase/>
<Footer/>
        </div>
  </>
  );
}

export default App;
