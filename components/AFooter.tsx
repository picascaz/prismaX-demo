import { useRouter } from "next/navigation"
import React from "react"



const AFooter = () => {
  const ur = useRouter()


  return <div className=" bg-[#04070D]">
    <div style={{
      borderRadius: '30px 30px 0px 0px',
      background: '#202020'
    }} className=" w-full  mo:h-[44px] flex items-center h-[85px] pl-[14px] pr-[25px] justify-between">

      <div className=" flex  text-2xl leading-[30px] font-normal w-full">
        <div className=" justify-between flex  items-center w-full  mo:ml-0 mo:mx-4" >
          <div className=" cursor-pointer" onClick={() => ur.push('/')} >
            <img src="./logo.svg" className="mo:w-[68px] mo:h-[25px] " />
          </div>
          <div className="w-full justify-center mo:justify-end  text-[#FFFFFF] quattrocento font-bold mo:text-[10px] text-base leading-[22.22px] mo:leading-[11px]  text-right  ">
            © PRISMAX {new Date().getFullYear()}
          </div>
        </div>

      </div>
    </div>



  </div >

}

export default AFooter