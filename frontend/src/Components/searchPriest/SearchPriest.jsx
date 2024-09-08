import React, { useContext, useEffect, useState } from 'react'
import PriestIntro from './PriestIntro'
import './style.scss'
import { Loading } from '../Loader'
import { useFetchPriests } from '../ReactQuery'
const SearchPriest = ({changes}) => {
    const {data:priests,isLoading:loading} = useFetchPriests()
   

    useEffect(()=>{
        window.scrollTo(0, 0);
        
    },[])
    if(loading){
        return <Loading/>
    }
  return (
    <>
    <section className='search-priest'>
        <div className='heading'>
            <h2>
                Some Popular Priest In Mathura-Vrindavan
            </h2>
        </div>
       {
        priests&&priests.length>0&&priests.map((priest)=>(
            <PriestIntro priest={priest} key={priest._id}/>
        ))
       }
    </section>
    </>
  )
}

export default SearchPriest