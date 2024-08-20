import {  signInWithPhoneNumber } from 'firebase/auth';
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { auth } from '../../firebase/setup';
import { RecaptchaVerifier } from 'firebase/auth';
import { phoneExit, priestLogin } from '../../Services/Apis';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loading } from '../Loader';
import { toast } from 'react-toastify';

const ForgetPass = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(null);
  const [user, setUser] = useState(null);
  const [isSend, setSend] = useState(false);
  const [loading,setLoading] = useState(false);
  const [isSent,setSent] = useState(false)
  const Navigate = useNavigate();
const sendOtp = async()=>{
  const res = await phoneExit(phone);
  if(!res){
    toast.error("Phone Does Not Exits");
    return;
  }
  try {
    const phoneNumber = '+' + phone;
    const recapta  = new RecaptchaVerifier(auth,'recapta',{});
    const confirmation = await signInWithPhoneNumber(auth,phoneNumber,recapta);
    
   setUser(confirmation);

   alert("OTP has been sent successfully");
   setSent(true)
   setSend(true)
  } catch (error) {
    console.log(error.message);
  }
 
}
const verfiyOtp=async()=>{
  try {
    
    const data = await user.confirm(otp);
    if(data.user.phoneNumber){
      const phones = phone.slice(2,);
      const res = await priestLogin({Phone:phones});
      localStorage.setItem("priestToken",res.token)
      Navigate('/register/user');
      alert(res.message)
    }
    
  } catch (error) {
    alert(error.message)
    console.log(error.message);
  }

}
  return (
    <div>
      {
        loading&&<Loading/>
      }
      <PhoneInput
        country={'in'}
        value={phone}
        onChange={(value) => setPhone(value)}
      />
      <div id='recapta'></div>
    <div>
<button disabled={isSent} onClick={sendOtp}>sendOtp</button>
    </div>

  { isSend&&<div>
      <input type="phone" onChange={(e)=>setOtp(e.target.value)} />
    <div>
      <button onClick={verfiyOtp}>verfiyOtp</button>
    </div>
    </div>}

    </div>
  )
}

export default ForgetPass
