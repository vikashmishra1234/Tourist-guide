import React from "react";
import { FaLocationArrow } from "react-icons/fa";
import './style.scss'
const Cards = ({ data }) => {
  return (
    <div className="card-container">
      <div className="card-image">
        <img src={data.url} alt="unable to load image" />
      </div>
      <div className="card-para">
        <h2>{data.Name}</h2>
        {
          data.Price?<span>Thali Price: $ {data.Price}</span>:''
        }
        
        <div className="card-discription">{data.discription}</div>
        {
          data.winter?<div>
            <p style={{margin:"0",fontWeight:'bold',fontSize:'19px'}}>Winter<span style={{fontWeight:'300'}}>: {data.winter}</span></p>
            <p style={{margin:"",fontWeight:'bold',fontSize:'19px'}}>Summer: <span style={{fontWeight:'300'}}>{data.summer}</span></p>
          </div>:''
        }
        <div className="card-button">
          <a href={data.location} target="__blank">
            Location
            <div >
              <FaLocationArrow size={"20px"} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cards;
