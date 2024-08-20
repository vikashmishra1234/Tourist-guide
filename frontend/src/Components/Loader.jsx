import { ColorRing } from "react-loader-spinner"
export const Loading = ()=>{
 return <div
   className="loading"
 >
   <div  className="load">

     <ColorRing
           visible={true}
           height="80"
           width="80"
           className="load"
           ariaLabel="color-ring-loading"
           wrapperStyle={{}}
           wrapperClass="color-ring-wrapper"
         
           />
           Loading...
   </div>
           
 </div>
}