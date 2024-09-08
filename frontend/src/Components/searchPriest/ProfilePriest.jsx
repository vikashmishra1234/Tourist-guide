import React, { useContext, useEffect, useState } from "react";
import PriestIntro from "./PriestIntro";
import { useLocation } from "react-router-dom";
import Reveiw from "../Resgistration/Reveiw";
import { Loading } from "../Loader";
import { useFetchPriests } from "../ReactQuery";


const ProfilePriest = ({ setChanges }) => {

  const location = useLocation();
  const {data:resPriest,isLoading:loading} = useFetchPriests();

  const [priest,setPriest] = useState();
  useEffect(()=>{
    const searchQuery = location.search;
    const queryParams = new URLSearchParams(searchQuery);
    const priestId = queryParams.get("priestId");
    const priestes =resPriest&&resPriest.find(obj => obj._id === priestId);
    setPriest(priestes)

  },[resPriest])
 
 
  return (
    <div >

        {loading?<Loading/>:priest&&<PriestIntro profile={true} priest={priest} />}
        {!loading?priest&&<Reveiw priestId={priest._id}/>:<Loading/>}
    </div>
  );
};

export default ProfilePriest;
