import axios from "axios";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { deleteProfile } from "../../Services/Apis";
import Cookies from "js-cookie";

const Profile = ({ profileData, setTokenExits }) => {
  const [show, setShow] = useState(false);
  const Navigate = useNavigate();

  const handleDelete = async () => {
    const res = await deleteProfile();
    if (res.success) {
      Cookies.remove("priestToken");
      setTokenExits(false);
      alert(res.message);
      
    }
  };

  const hanldeLogOut = () => {
    Cookies.remove("priestToken");
    setTokenExits(false);
    
  };
  return (
    <div className="profile-wrapper">
      <h2>Your Profile</h2>
      <div className="profile-container">
        <div className="profile-image">
          {!profileData.Profile && (
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
              alt=""
            />
          )}
          {profileData.Profile && <img src={profileData.Profile} alt="" />}

          <div className="profile-name">
             <span>{profileData.Name}</span>
          </div>
          <div className='more'>
        <MdMoreVert onClick={()=>setShow(!show)} style={{cursor:'pointer'}} />
       { show&&
          <ul>
            <li onClick={hanldeLogOut}>LogOut</li>
            <li onClick={handleDelete}>Delete Account</li>
          </ul>
        }
        </div>
        </div>
        <div className="profile-about">
          <div className="bio">
           {profileData.Bio}
          </div>
          <div>
            <FaPhoneAlt color="blue" size={"23px"} />{" "}
            <span style={{marginLeft:'10px'}}>+91 {profileData.Phone.slice(2,)}</span>
          </div>
          <div>
            <span>Invites:{profileData.Invites}</span>
          </div>
          <div>
            <button
              onClick={() => {
                Navigate("/user/edit");
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
