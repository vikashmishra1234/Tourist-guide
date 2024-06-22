import { ColorRing } from "react-loader-spinner"
export const Loading = ()=>{
 return <div
    style={{position:'fixed',left:'47%',top:'50%',width:'fit-content'}}
 >

     <ColorRing
           visible={true}
           height="80"
           width="80"
           ariaLabel="color-ring-loading"
           wrapperStyle={{}}
           wrapperClass="color-ring-wrapper"
         
           />
 </div>
}