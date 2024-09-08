import React, { useState, lazy, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import ContextProvider from './Context/ContextProvider';
import Cookies from 'js-cookie'

// Lazy load components
const Auth = lazy(() => import('./Components/auth/Auth'));
const Registration = lazy(() => import('./Components/Resgistration/Registration'));
const SignUp = lazy(() => import('./Components/auth/SignUp'));

const Footer = lazy(()=>import('./Components/footer/Footer'))
const ForgetPass = lazy(() => import('./Components/auth/ForgetPass'));
const Restaurent = lazy(() => import('./Components/Restaurents/Restaurent'));
const Home = lazy(() => import('./Components/Home/Home'));
import SearchPriest from './Components/searchPriest/SearchPriest'
import ProfilePriest from './Components/searchPriest/ProfilePriest'
import { Loading } from './Components/Loader';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [changes, setChanges] = useState(Math.random());
  const {setTokenExits} = useContext(ContextProvider);
  const token = Cookies.get("priestToken");

  useEffect(()=>{
   if(token){
    setTokenExits(true);
   }
   else{
    setTokenExits(false);
   }
  },[token])


  return (
    <>
      <Router>
        <Navbar />
        <Suspense fallback={<Loading/>}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/register' element={<Auth />} />
            <Route exact path='/user/edit' element={<SignUp key={Math.random()} heading={"Edit Profile"} button={"Update"} />} />
            <Route exact path='/restaurent' element={<Restaurent />} />
            <Route exact path='/forget/pass' element={<ForgetPass />} />
            <Route exact path='/user' element={<Registration />} />
          </Routes>
          
        </Suspense>
        
        <Routes>
            <Route exact path='/priest/find' element={<SearchPriest changes={changes} key={Math.random()} />} />
            <Route exact path='/priest' element={<ProfilePriest setChanges={setChanges} />} />
        </Routes>
        <ToastContainer position='top-center'/>
      </Router>
    </>
  );
};

export default App;
