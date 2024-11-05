import FollowMouseImage from "./FloowMouseImage";
import Spline from "@splinetool/react-spline";
import React from "react";
import useMobileDetect from "../hooks/useMobileDetect";


const APrismaXPov = () => {

  const isMobile = useMobileDetect()

  return (
    <div className=" bg-[#0C0C0C]">
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="w-container  aos-init aos-animate  prismax  overflow-x-hidden bg-[#0C0C0C] m-auto mo:w-full mo:px-[30px]   mx-auto md:w-full md:px-[70px]   text-[#FFFFFF]">
        <div className="  flex w-full pt-[113px] mo:pt-[46px]  ">
          <div className="w-full ">
            <div className="flex flex-col">
              <div className=" mo:pl-0 mo:justify-center mo:flex font-semibold text-4xl mo:text-2xl leading-[43.88px]">
                PrismaX PoV
              </div>
              {/* <div className="sm:hidden font-semibold mo:text-[10px]  text-xl leading-6 mo:leading-3 flex justify-center mt-[42px]">
              PrismaX Tools & Infra
            </div> */}
              {isMobile ? <div className="flex md:pt-[50px] ws:pt-[100px] sm:hidden ">
                <div className="">
                  <video
                    src="./oll.mp4"
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="auto"
                    style={{ mixBlendMode: "lighten" }}
                    className=" mt-[-200px]    mo:mt-0 md:mt-[-200px] bt:mt-[-80px] sm:px-[100px] "
                  />
                  <div className=" text-[#FFFFFF] relative text-center font-semibold text-xl md:text-base mo:text-[7px] mo:leading-[8px] leading-6 montserrat items-center mo:top-[-150px] top-[-450px] md:top-[-450px] bt:top-[-490px] ws:top-[-250px]  flex justify-center bg-cover ">
                    <div className="w-[200px] mo:w-full top-[-80px] mo:top-0 ws:top-[-40px]   relative left-[240px] mo:left-[-10px] md:left-[150px] bt:left-[100px] ws:left-[50px]">
                      <div>First Person</div>
                      <div>View Data</div>
                    </div>

                    <FollowMouseImage src={"./pov.png"} />
                    <div className="w-[215px] mo:w-full top-[-80px] mo:top-0 ws:top-[-40px]  relative right-[200px] mo:right-[-10px] md:right-[150px] bt:right-[100px] ws:right-[50px]">
                      <div>High Quality</div>
                      <div>Data for Gen AI</div>
                    </div>
                  </div>
                </div>
              </div>
                :
                <div className="mo:hidden  ">
                  <div className="relative  w-full h-[calc(620px)] overflow-hidden my-5 flex justify-start flex-col ">
                    {/* <div className=" font-semibold mo:text-[10px]  text-xl leading-6 mo:leading-3 flex justify-center ">
                  PrismaX Tools & Infra
                </div> */}

                    <div className=" font-semibold text-xl leading-normal montserrat mo:w-full relative top-[-150px]  px-[230px] md:px-[150px] al:px-[100px] ws:px-10 al:text-sm text-center h-full items-center flex w-full justify-between ">
                      <div>
                        <div>First Person</div>
                        <div>View Data</div>
                      </div>
                      <div>
                        <div>High Quality</div>
                        <div>Data for Gen AI</div>
                      </div>
                    </div>

                    <video
                      src="./oll.mp4"
                      autoPlay
                      muted
                      preload="auto"
                      playsInline
                      loop
                      className="absolute inset-20 top-[-170px] py-0 w-full h-full object-cover pl-[110px] pr-[260px] md:pr-[310px] pt-[35px]  mix-blend-lighten"
                    />
                    <FollowMouseImage src={"./pov.png"} />
                    <Spline
                      className="mo:!hidden absolute inset-10 md:inset-4 top-[-10px] md:top-[-20px]   !m-auto !justify-center !flex w-full"
                      scene="https://prod.spline.design/9KEU1wON2uHX2IuF/scene.splinecode"
                    />
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APrismaXPov;
