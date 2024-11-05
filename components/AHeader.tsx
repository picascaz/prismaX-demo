import { useRouter } from "next/navigation"
import React from "react"

const AHeader = () => {

  const ur = useRouter()

  return <div className="   mo:py-[5px]  bg-black ">
    <div className=" m-auto mo:w-full mo:pl-[24px] mo:pr-[29px] mx-auto md:w-full  mo:mt-[6px]">
      <div className="  flex  text-2xl leading-[30px] font-normal px-[70px] mo:px-0">
        <div className=" justify-between flex  items-center w-full" >
          <div className=" cursor-pointer" onClick={() => ur.push('/')} >
            <img src="./logo.svg" className=" mo:w-[150px] mo:h-[50px]" />
          </div>
          {/* <button className="prismaX-join-btn items-center hover:text-[#FFFFFF] text-[#EEEEEECC] quattrocento font-normal mo:text-[10px] text-[20.05px] leading-[22.22px] text-center w-[199px] mo:w-[94px] mo:h-[24px]  h-[50px]  ">
            <div className="!bg-[#1C2023] h-full rounded-lg w-full items-center justify-center flex">
              Join Community
            </div>
          </button> */}
        </div>

      </div>
    </div>



  </div >

}

export default AHeader