import { FC, Suspense, useEffect, useState } from "react";
import ThreeScene from './ThreeScene';
import useMobileDetect from "@/hooks/useMobileDetect";
import LoadingFull from "./ALoading";
import Icon from "./images";
import React from "react";
const ABanner: FC<{ onShow?: () => void }> = ({ onShow }) => {

  const videos = ["./1.mp4", "./2.mp4", ""];

  const mobileTexts = [
    `
    <div>This is PrismaX, A Base Layer for <div>
    <div>Real-World Multimodal GenAI Apps</div>
     `
    ,
    `<div>High-quality data can only come from <div>
    <div>Real people…… and real human effort will<div>
     <div> always have real value.</div>`,
    `
    <div>PrismaX envisions a world where AI </div>
    <div> achieves human-level comprehension of </div>
     <div>the real world, recognizing the invaluable </div>
     <div>role of human effort in this endeavor.</div>
     `,
  ];
  const texts = [
    `<div>This is PrismaX, A Base Layer for Real-World Multimodal GenAI Apps<div>`,

    "<div>High-quality data can only come from Real people……<div><div>and real human effort will always have real value.</div>",

    `<div>PrismaX envisions a world where AI achieves human-</div>
     <div>level comprehension of the real world, recognizing the</div>
     <div>invaluable role of human effort in this endeavor.</div>`,

  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const isMobile = useMobileDetect()
  const [textContent, setTextContent] = useState(isMobile ? mobileTexts[0] : texts[0]);
  const [textAnimation, setTextAnimation] = useState("text-slide-in");
  const [isClickEnter, setIsClickEnter] = useState(false)
  const [dealHover, setDealHover] = useState<any>(null);
  const [isScroll, setIsScroll] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);



  useEffect(() => {
    setTextContent(isMobile ? mobileTexts[0] : texts[0]);
  }, [isMobile])

  useEffect(() => {
    const interval = setInterval(() => {

      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => {
          setTextAnimation("text-slide-out");
          const nextIndex = (prevIndex + 1) % videos.length;
          setTextAnimation("text-slide-in");
          setTextContent(isMobile ? mobileTexts[nextIndex] : texts[nextIndex]);
          return nextIndex;
        });
      }, 1000);
    }, 7000);

    return () => clearInterval(interval);
  }, [isClickEnter, isMobile]);



  useEffect(() => {
    const disableScroll = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    };

    if (!scrollEnabled || !isClickEnter) {
      // 禁用 PC 端滚轮滚动
      window.addEventListener('wheel', disableScroll, { passive: false });

      // 禁用移动端触摸滑动
      window.addEventListener('touchmove', disableScroll, { passive: false });

      // 禁用 body 滚动（CSS 方式）
      document.body.style.overflow = 'hidden';
    } else {
      // 启用 PC 端滚轮滚动
      window.removeEventListener('wheel', disableScroll);
      // 启用移动端触摸滑动
      window.removeEventListener('touchmove', disableScroll);
      // 启用 body 滚动
      document.body.style.overflow = 'auto';
    }

    // 15秒后启用滚动
    const timeoutId = setTimeout(() => {
      setScrollEnabled(true);
      typeof onShow === 'function' && onShow()
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('wheel', disableScroll);
      window.removeEventListener('touchmove', disableScroll);
      document.body.style.overflow = 'auto';
    };
  }, [scrollEnabled, isClickEnter]);


  return (
    <Suspense fallback={<LoadingFull />}>
      <div className="  ">
        <div
          className={`w-container   h-auto flex-col flex justify-center mo:justify-start mo:mt-20   m-auto mo:w-full  mo:px-[30px] min-h-screen mo:min-h-0 mo:h-[calc(620px)] mx-auto md:w-full md:px-[70px]  pb-5 mo:pb-0`}
        >
          {isClickEnter ?
            <div
              data-aos="fade-up"
              data-aos-duration="2500"
              className="w-full"
            >
              <div className=" w-full banner ">
                <div id="particle-container" className=" h-[600px] flex">
                  <ThreeScene />
                </div>
              </div>
              <div
                className={`text-wrapper flex mo:mt-5  justify-between flex-row   h-[120px]  w-full   px-[150px] mo:px-0 md:px-[60px]  `}
                key={currentVideoIndex}
              >
                <div
                  className={`text-line font-normal !text-xl  md:text-base mo:!text-[16px]   montserrat text-[#FFFFFF]  ${textAnimation}`}
                  dangerouslySetInnerHTML={{ __html: textContent }}
                />
                <button
                  onMouseOver={() => {
                    setDealHover(true);
                  }}
                  onMouseLeave={() => {
                    setDealHover(false);
                  }}
                  onClick={() => {
                    setScrollEnabled(true)
                    typeof onShow === 'function' && onShow()
                    const element = document.getElementsByClassName('prismax')[0];
                    element.scrollIntoView({ behavior: "auto", block: 'start' });
                  }
                  }
                  className={` mo:hidden flex items-center gap-[18px]  quattrocento text-xl text-[#EEEEEEB2]  ${isScroll || dealHover ? "text-[#FFFFFF]" : "text-[#EEEEEEB2]"
                    } `}
                >
                  <div className={` ${dealHover && '!border-[#fff]'}`}>
                    <Icon
                      name={"IconScroll"}
                      color={isScroll || dealHover ? "#FFFFFF" : "#EEEEEE70"}
                    />
                  </div>
                  Scroll Down
                </button>
              </div>
            </div>
            :
            <div className="flex flex-col justify-between  mo:gap-[10px]  gap-20 lg:gap-[10vh] ">
              <div
                className={`text-line md:text-base   w-full  quattrocento  justify-center text-center font-medium text-2xl  mo:text-xl sm:hidden text-[#FFFFFF]  ${textAnimation}`}
              >How Can We Help AI See the World?</div>
              <div className="flex justify-center  ">
                <video
                  src={'./cicle.mov'}
                  autoPlay
                  muted
                  loop
                  preload="auto"
                  playsInline
                  className=" w-[40vh]"
                />
              </div>

              <div className="flex items-center  justify-between w-full   mo:mt-10 ">
                <div
                  className={`text-line  w-full float-left md:text-xl quattrocento font-medium text-2xl mo:hidden  text-[#FFFFFF]  ${textAnimation}`}
                >How Can We Help AI See the World?</div>
                <div className="  flex  w-full mo:justify-center">
                  <button
                    data-aos="fade-up"
                    data-aos-duration="3000"
                    data-aos-easing="linear"
                    onClick={() => {
                      setIsClickEnter(true)
                      typeof onShow === 'function' && onShow()
                    }
                    }
                    className=" rounded-[500px] ml-[-60px] mo:ml-0  border w-[10.4375rem] h-[3.6875rem] border-[hsla(0,0%,100%,.2)] text-[16px]  font-medium  hover:border-[#fff] btnE quattrocento"
                  >ENTER
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </Suspense>
  );
};

export default ABanner;
