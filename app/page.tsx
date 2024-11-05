"use client";

import React, { useEffect } from "react";
import Intro from "../components/intro/Intro";
import APrismaXPov from "../components/APrismaXPov";
import AConnected from "../components/AConnected";
import AFooter from "../components/AFooter";
import AHeader from "../components/AHeader";
import Aos from "aos";

import "aos/dist/aos.css";

export default function RootLayout() {
  useEffect(() => {
    Aos.init({
      disable: false,
      startEvent: "DOMContentLoaded",
      initClassName: "aos-init",
      animatedClassName: "aos-animate",
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 400,
      easing: "ease",
      once: false,
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }, []);

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);
  return (
    <>
      <AHeader />
      <Intro />
      <APrismaXPov />
      <AConnected />
      <AFooter />
    </>
  );
}
