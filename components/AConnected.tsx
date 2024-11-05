import { useState } from "react";
import Icon from "./images";
import React from "react";
import useMobileDetect from "../hooks/useMobileDetect";
const AConnected = () => {
  const [dealHover, setDealHover] = useState<any>(null);
  const isMobile = useMobileDetect();

  const apps = [
    { url: "https://discord.gg/xh8vR6JVzM", name: "Discord" },
    { url: "https://x.com/PrismaXai", name: "Twitter" },
    { url: "https://t.me/PrismaX_News", name: "Telegram" },
  ];
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="1000"
      className=" aos-init aos-animate   w-full   bg-[#04070D]">
      <div

        className=" w-container bg-[#04070D] pb-[125px] mo:pb-[44px]  m-auto mo:w-full  mo:pl-[28px]  mx-auto md:w-full   flex justify-between  ">
        <div className="fle bf  w-[700px]  mo:w-full flex-col justify-center mt-[194px] mo:mt-[20px] md:w-auto  font-semibold text-[50px] mo:text-[15px] smd:text-[40px] leading-[100px] smd:leading-[80px] mo:leading-[30px] montserrat">
          <div className="  text-center mo:w-full mo:text-left text-white">
            <div>
              {`Become One of the`}
            </div>
            <div>
              {`Originals Today!`}
            </div>

          </div>
          <div className=" flex gap-[60px] smd:gap-[30px] mo:gap-0 md:ml-[55px] justify-center  mo:ml-0 mo:flex-col pt-[89px] mo:pt-[20px]  font-normal text-[25px]  mo:text-[8px] leading-7 text-[#EEEEEEB2]">

            {apps.map((item, index) => {
              return (
                <div
                  key={`app_${index}`}
                  className={`sociallink ${dealHover?.isHover && dealHover.index === index
                    ? "text-[#FFFFFF]"
                    : " text-[#EEEEEE70]"
                    }`}

                  onMouseOver={() => {
                    setDealHover({ index, isHover: true });
                  }}
                  onMouseLeave={() => {
                    setDealHover({ index, isHover: false });
                  }}
                >
                  <div
                    className=" items-center smd:!text-[16pt] mo:!text-[8px] mo:!justify-start"
                    onClick={() => item.url && window.open(item.url, "_blank")}
                    style={{
                      display: 'flex', flexDirection: 'row', justifyContent: 'center',
                      gap: '6pt',
                      fontSize: '21pt',
                      height: '16pt',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon
                      name={item.name}
                      size={`${isMobile ? "14" : "22"}`}
                      color={`${dealHover?.isHover && dealHover.index === index
                        ? "#FFFFFF"
                        : " #EEEEEE70"
                        }`}
                    />
                    {item.name}
                    <div className="mo:hidden  ">
                      <Icon
                        name={"IconArrow"}
                        className="sociallinkarrow"
                        color={`${dealHover?.isHover && dealHover.index === index

                          ? "#FFFFFF"
                          : " #EEEEEE70"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex   md:w-[60vh] ">
          <img
            src={isMobile ? "./mo-connected.png" : "./test.png"}
            className="object-cover bg-cover   "

          />
        </div>
      </div>
    </div>
  );
};

export default AConnected;
