import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { registration, updateProfile } from "../../Services/Apis";
import { Navigate, useNavigate } from "react-router-dom";
import ContextProvider from "../../Context/ContextProvider";
import { Loading } from "../Loader";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import { auth } from "../../firebase/setup";
import './style.scss'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-toastify";

const SignUp = ({ button, heading, user_id }) => {
  const [profile, setProfile] = useState("");
  const [isEdit, setEdit] = useState(heading);
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState("");
  const [isOtpSent, setIsOptSent] = useState(false);
  const [otp, setOTP] = useState(null);
  const [isVerify,setPhoneVerified] = useState(false);
  const [priestFormData,setPriestFormData] = useState({})
  const { priest, setPriest, setTokenExits } = useContext(ContextProvider);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  useEffect(()=>{
    
    isEdit&&(
      delete priest.Password,
      delete priest.Phone,
      setPriestFormData(priest)
      
    )
  },[isEdit,priest])

//profile upload on cloudinary
  const handleProfile = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "vikashmishra");
    setLoading(true);
    await axios
      .post("https://api.cloudinary.com/v1_1/dwjh8zji6/image/upload", formData)
      .then((resp) => {
        setLoading(false);
        setProfile(resp.data.url);
        priest.Profile = resp.data.url;
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };


  // handleForm Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(priestFormData.Phone)
    if(priestFormData.Phone && !isVerify){
      
      toast.error("Please Verify the Phone")
       
    }
    else if (isEdit) {
     
      // profile edit code
      setLoading(true);
      phone&&(priestFormData.Phone=phone.slice(2,))
      const res = await updateProfile(priestFormData);
      setLoading(false);
      if (res && res.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          text: res.message,
          showConfirmButton: false,
          timer: 1100,
        });
        Navigate("/user");
      }
    } 
    // new User registration if phone is verified
    else  {
      setLoading(true);
      
      console.log(priestFormData);
      const res = await registration(priestFormData);
      setLoading(false);
      if (res.success) {
        Cookies.set("priestToken", res.token);
        setTokenExits(true);
        Navigate("/user");
        Swal.fire({
          position: "center",
          icon: "success",
          text: res.message,
          showConfirmButton: false,
          timer: 1100,
        });
      }
    }
  };

  const handleChange = (e) => {
    setPriestFormData({ ...priestFormData, [e.target.name]: e.target.value });
  };

  //sending an otp to the phone number
  const sendOtp = async () => {
    console.log(priestFormData.Phone)
    if(!priestFormData.Phone || priestFormData.Phone.length!=12){
      toast.error("Please Enter an valid Phone Number");
      return ;
    }
    try {
      const phoneNumber = "+" + priestFormData.Phone;
      const recapta = new RecaptchaVerifier(auth, "recapta", {
        size:"invisible"
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recapta
      );
      toast.success("OTP has been sent !");
      setUser(confirmation);
      setIsOptSent(true);
    } catch (error) {
      toast.error(error.message)
      console.error(error);
    }
  };
  //verifying the otp
  const verfiy = async () => {
   try {

     const data = await user.confirm(otp);
     if (data.user.phoneNumber) {
       setPhoneVerified(true)
       setIsOptSent(false);
       toast.success("Phone Verified Successfully");
     }
   } catch (error) {
      toast.error(error.message)
      console.error(error);
   }
  };
  return (
    <div className="login-container">
      {loading && <Loading />}
      <form action="" className="login-form" onSubmit={handleSubmit}>
        <div className="signup">
          <div>{isEdit ? <h3>{heading}</h3> : <h3>Register</h3>}</div>
          <input
          className="int"
            required
            value={priestFormData.Name}
            onChange={handleChange}
            name="Name"
            type="text"
            placeholder="Your Name"
          />

          {/* phone-verifying-code */}
          <div className="input-phone2">
              <PhoneInput
                id="phonev"
                name='Phone'
                country={"in"}
                placeholder="89794xxxxx"
                value={priestFormData.Phone}
                onChange={(value) =>{
                  priestFormData.Phone = value
                } }
              />
              <button type="button" disabled={isOtpSent} className="otp-btn" onClick={sendOtp}>
                sendOTP
              </button>
            </div>
            
            <div>
              <div id="recapta"></div>
            </div>
            {isOtpSent ? (
              <div className="input-phone2">
                <input
                className="int"
                  type="text"
                  placeholder="Enter 6 Digit OTP"
                  onChange={(e) => setOTP(e.target.value)}
                />{" "}
                <button type="button" className="otp-btn" disabled={!otp} onClick={verfiy}>verfiyOTP</button>
              </div>
            ) : (
              ""
            )}


          <input
          className="int"
            required={!isEdit}
            value={priestFormData.Whatsapp}
            onChange={handleChange}
            name="Whatsapp"
            type="tel"
            placeholder="Whatsapp"
          />
          <textarea
            style={{ maxWidth: "100%" }}
            type="text"
            value={priestFormData.Bio}
            placeholder="Bio"
            name="Bio"
            onChange={handleChange}
            required={!isEdit}
          />
          <input
          className="int"
            required={!isEdit}
            onChange={handleChange}
            name="Password"
            type="password"
            placeholder={isEdit ? "Enter New Password" : "Set Password"}
          />
          <input
          className="int" onChange={handleProfile} name="Profile" type="file" />
          <div>
            {profile && <img height={50} width={30} src={profile} alt="" />}
          </div>
          {isEdit ? (
            <button disabled={loading} type="submit">
              {button}
            </button>
          ) : (
            <button disabled={loading} type="submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
