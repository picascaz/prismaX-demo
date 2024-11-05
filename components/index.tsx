import React from "react";
import { useEffect, useState } from "react";

export default function Home({ data = [1, 2, 3] }) {
  const videos = ["./LOL.webm", "./oceans.mp4", "2.mp4"]; // 替换为你的视频路径
  const texts = [
    "这里是第一行文字...",
    "这里是第二行文字...",
    "这里是第三行文字...",
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // 当前视频索引
  const [videoSrc, setVideoSrc] = useState(videos[0]); // 初始视频源
  const [textContent, setTextContent] = useState(texts[0]); // 初始文字内容
  const [fade, setFade] = useState(true); // 控制视频的淡入淡出
  const [textAnimation, setTextAnimation] = useState("text-slide-in"); // 控制文字动画

  useEffect(() => {
    // 定时切换视频和文字
    const interval = setInterval(() => {
      setTextAnimation("text-slide-out"); // 开始淡出

      setTimeout(() => {
        // 等待淡出动画结束后切换视频
        setCurrentVideoIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % videos.length;
          setVideoSrc(videos[nextIndex]);
          setTextContent(texts[nextIndex]);
          setTextAnimation("text-slide-in"); // 淡入新文字
          return nextIndex;
        });
        setFade(true); // 淡入新视频
      }, 1000); // 动画时间同步，这里是 1秒的淡出时间
    }, 7000); // 每7秒切换

    return () => clearInterval(interval); // 清理定时器
  }, []);

  return (
    <div className="container">
      {/* 圆形视频播放部分 */}
      <div className="video-wrapper">
        <video
          src={videoSrc}
          autoPlay
          muted
          playsInline
          className={fade ? "fade-in" : "fade-out"} // 根据 fade 状态应用不同的类
        />
      </div>

      {/* 底部文字部分 */}
      <div className="text-wrapper">
        <div className={`text-line ${textAnimation}`}>{textContent}</div>
      </div>
    </div>
  );
}
