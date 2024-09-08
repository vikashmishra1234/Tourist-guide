import React from 'react'
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa6";
import '../Resgistration/style.scss'
import { updatePriestInvites } from '../../Services/Apis';


const PriestIntro = ({priest,profile}) => {
    const Navigate = useNavigate();
    const increaseInvites = async(id)=>{
        await updatePriestInvites(id);     
    }
  return (
    <div className='profile-wrapper'>
      {
       profile&&<h2>Profile</h2>}
    <div className='profile-container'>
        <div className='profile-image' >
           
            {

          !priest.Profile&&<img src="https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg" alt="" />
            }
            {
                priest.Profile&&<img src={priest.Profile} alt="" />
            }

            <div className='profile-name'>
            <span>{priest.Name}</span>
            </div>
        </div>
        <div className='profile-about'>
            <div className="bio">
                {priest.Bio}
            </div>
            <div>
            <FaPhoneAlt color='blue' size={'21px'} /> <span>+91 {priest.Phone.slice(2,)}</span>
            </div>
            <div>
                <span>Invites:{priest.Invites}</span>
            </div>
            <div>
{          

    !profile?<button onClick={()=>Navigate(`/priest?priestId=${priest._id}`)}>View Profile</button>:
    <div id='btns'>

        <a href={`tel:${priest.Phone}`} onClick={()=>increaseInvites(priest._id)} > <FaPhoneAlt size={21}/> Invite</a>
        <a style={{background:'#76e076'}} href={`https://wa.me/${priest.Whatsapp}`} > <FaWhatsapp size={23}/> Invite</a>
    </div>



}    </div>
        </div>
   
    </div>
   
</div>
  )
}

export default PriestIntro