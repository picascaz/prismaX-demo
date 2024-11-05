"use client";

import React, { useState } from "react";
import AnimText from "../animtext/AnimText";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import * as TWEEN from "@tweenjs/tween.js";
import Icon from "../images";

//region: configs
// const videoUrls = ['video1.mp4', 'video2.mp4', 'video3.mp4']
const videoUrls = ["./video/video1.mp4", "./video/video2.mp4", "./video/video3.mp4"];

const particleSizeBase = 6;
const particleSizeAlter = 2;
const spawnRadius = 2.4;
const sqrRadius = spawnRadius * spawnRadius;

const particleNum = 20000;

//endregion

let container: any = null;
let width: number,
  height = null;
let renderer: any = null;
let renderTarget: any = null;
let noise: any = null;

let particleScene: any = null;
let videoScene: any = null;

let videoElements: any = [];
let videoTextures: any = [];

let videoMaterial: any = null;

let camera: any = null;

let time: any = 0;
let vidParticle: any = null;

let vidParticleConfig: any = {
  progress: 0,
  spreadBase: 0.8,
  spreadAlter: 0.2,
  sampleScalar: 1000,
  timeScalar: 0.2,
  amplitude: 0.1,
};

let bgParticle: any = null;
let bgParticleConfig: any = {
  num: 300,
  progress: 0,
  sampleScalar: 1000,
  timeScalar: 0.07,
  amplitude: 0.1,
};

export default function ModelPage() {
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [buttonText, setButtonText] = useState("ENTER");
  const [dealHover, setDealHover] = useState<any>(null);


  const group = new TWEEN.Group();

  function OnResize() {
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    renderTarget.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function getResolutionRatio() {
    const width = window.screen.width;
    const height = window.screen.height;

    const widthRatio = width / 1920;
    const heightRatio = height / 1080;
    const deviceRatio = window.devicePixelRatio === 1 ? 2 : 1;
    return Math.max(widthRatio, heightRatio) / deviceRatio;
  }

  function InitScene() {
    container = document.getElementById("three1");
    (width = container.clientWidth), (height = container.clientHeight);

    renderer = new THREE.WebGLRenderer({
      stencil: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    renderTarget = new THREE.WebGLRenderTarget(width, height);
    noise = createNoise3D();

    particleScene = new THREE.Scene();
    videoScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.05, 1000);
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, 0);
    window.addEventListener("resize", OnResize);
  }

  function InitVideoAndTextures() {
    const loadVideo = (url: string) => {
      return new Promise<HTMLVideoElement>((resolve) => {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.src = url;
        video.load();

        video.oncanplay = () => {
          resolve(video);
        };
      });
    };

    const createCanvasTexture = (video: HTMLVideoElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      function updateCanvasTexture() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          texture.needsUpdate = true;
        }
        requestAnimationFrame(updateCanvasTexture);
      }
      updateCanvasTexture();

      return texture;
    };

    // Create a placeholder texture
    const placeholderTexture = new THREE.Texture();
    placeholderTexture.minFilter = THREE.LinearFilter;
    placeholderTexture.magFilter = THREE.LinearFilter;

    const videoGeometry = new THREE.PlaneGeometry(6, 6);
    videoMaterial = new THREE.MeshBasicMaterial({ map: placeholderTexture });
    const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
    videoScene.add(videoPlane);

    Promise.all(videoUrls.map(loadVideo)).then((loadedVideos) => {
      videoElements = loadedVideos;
      videoTextures = loadedVideos.map(createCanvasTexture);

      // Update material with the first video texture
      videoMaterial.map = videoTextures[0];
      videoMaterial.needsUpdate = true;
    });
  }

  function InitVidParticles() {
    const psMat = new THREE.ShaderMaterial({
      uniforms: {
        videoTexture: { value: renderTarget.texture },
        spreadProgress: { value: 0 },
      },
      vertexShader: `
    attribute float size;
    varying vec4 vScreenPosition;
    uniform float spreadProgress;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * spreadProgress * spreadProgress;
      gl_Position = projectionMatrix * mvPosition;
      vScreenPosition = gl_Position;
    }
  `,
      fragmentShader: `
    uniform vec3 color;
    uniform sampler2D videoTexture;
    varying vec4 vScreenPosition;
    uniform float spreadProgress;
    void main() {
        vec2 screenUV = vScreenPosition.xy / vScreenPosition.w * 0.5 + 0.5;
        vec4 videoColor = texture2D(videoTexture, screenUV);
        float x =  gl_PointCoord.x -0.5;
        float y =  gl_PointCoord.y -0.5;
       
        if (x * x +y* y < 0.25){
        float a = 1.0 - pow(1.0 - spreadProgress,3.0);
            gl_FragColor = vec4(videoColor.rgb, a);
        }else{
            gl_FragColor = vec4(0,0,0,0);
        }
    }
  `,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.5,
    });
    const psGeo = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];

    const particleSizeRatio = getResolutionRatio();
    for (let i = 0; i < particleNum; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * spawnRadius;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      vertices.push(x);
      vertices.push(y);
      vertices.push(0);

      sizes.push(
        (particleSizeBase + Math.random() * particleSizeAlter) *
        particleSizeRatio
      );
    }

    const originalVertices = vertices.slice();

    psGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    psGeo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

    const particles = new THREE.Points(psGeo, psMat);
    particleScene.add(particles);

    vidParticle = {
      psMat,
      psGeo,
      vertices,
      sizes,
      originalVertices,
      particles,
    };
  }

  function InitNonVidParticles(timestamp = 0) {
    time = timestamp / 1000;
    const psMat = new THREE.ShaderMaterial({
      uniforms: { prog: { value: 0 } },
      vertexShader: `
    attribute float size;
    attribute float a;
    uniform float prog;
    varying float alpha;
    varying vec4 vScreenPosition;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
      vScreenPosition = gl_Position;
      alpha = a * prog;
    }
  `,
      fragmentShader: `
    varying float alpha;
    varying vec3 color;
    varying vec4 vScreenPosition;
    void main() {
        vec2 screenUV = vScreenPosition.xy / vScreenPosition.w * 0.5 + 0.5;
        float x =  gl_PointCoord.x -0.5;
        float y =  gl_PointCoord.y -0.5;
       
        if (x * x +y* y < 0.25){
            gl_FragColor = vec4(1,1,1,alpha);
        }else{
            gl_FragColor = vec4(0,0,0,0);
        }
    }
  `,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.5,
    });

    const psGeo = new THREE.BufferGeometry();
    const originalVertices = [];
    const sizes = [];
    const alpha = [];

    for (let i = 0; i < bgParticleConfig.num; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * spawnRadius * 0.92;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      originalVertices.push(x);
      originalVertices.push(y);
      originalVertices.push(1);

      sizes.push(
        particleSizeBase - 3 + Math.round(Math.random() * 2 * particleSizeAlter)
      );
      const a = Math.random();
      // limit a to 0.2, 0.4, 0.6,0.7,1
      if (a < 0.1) {
        alpha.push(0.2);
      } else if (a < 0.3) {
        alpha.push(0.4);
      } else if (a < 0.7) {
        alpha.push(0.5);
      } else if (a < 0.95) {
        alpha.push(0.6);
      } else {
        alpha.push(1.0);
      }
    }

    psGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(originalVertices, 3)
    );
    psGeo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    psGeo.setAttribute("a", new THREE.Float32BufferAttribute(alpha, 1));

    const particles = new THREE.Points(psGeo, psMat);
    particleScene.add(particles);

    bgParticle = { psMat, psGeo, originalVertices, sizes, particles };
  }

  function updateVidParticles(timestamp: any) {
    time = timestamp / 1000;
    const { psGeo, originalVertices } = vidParticle;
    const vertices = psGeo.attributes.position.array;
    const prog = vidParticleConfig.progress;
    const { sampleScalar, timeScalar, amplitude } = vidParticleConfig;
    for (let i = 0; i < vertices.length; i += 3) {
      const x =
        originalVertices[i] *
        (vidParticleConfig.spreadBase + prog * vidParticleConfig.spreadAlter);
      const y =
        originalVertices[i + 1] *
        (vidParticleConfig.spreadBase +
          prog * vidParticleConfig.spreadAlter) +
        (-prog * prog + 1.6 * prog - 0.6);
      const z =
        originalVertices[i + 2] *
        (vidParticleConfig.spreadBase + prog * vidParticleConfig.spreadAlter);

      const moderatedAmplitude = amplitude * prog;
      // * (0.6 + 0.4 * Math.sqrt((x * x + y * y) / sqrRadius))

      const noiseX =
        noise(
          sampleScalar * x,
          sampleScalar * y,
          sampleScalar * z + time * timeScalar
        ) * moderatedAmplitude;
      const noiseY =
        noise(
          sampleScalar * x + time * timeScalar,
          sampleScalar * y,
          sampleScalar * z
        ) * moderatedAmplitude;
      const noiseZ =
        noise(
          sampleScalar * x,
          sampleScalar * y + time * timeScalar,
          sampleScalar * z
        ) * moderatedAmplitude;

      vertices[i] = x + noiseX;
      vertices[i + 1] = y + noiseY;
      vertices[i + 2] = z + noiseZ;
    }

    psGeo.attributes.position.needsUpdate = true;
  }

  function updateNonVidParticles(timestamp: any) {
    const t = timestamp / 1000;
    const { psGeo, originalVertices } = bgParticle;
    const { sampleScalar, timeScalar, amplitude } = bgParticleConfig;
    const vertices = psGeo.attributes.position.array;
    const prog = bgParticleConfig.progress;
    // const z = -17 * prog + 10
    for (let i = 0; i < originalVertices.length; i += 3) {
      const x = originalVertices[i];
      const y = originalVertices[i + 1];

      const moderatedAmplitude = amplitude * 5;
      const noiseX =
        noise(sampleScalar * x, sampleScalar * y, t * timeScalar) *
        moderatedAmplitude;
      const noiseY =
        noise(sampleScalar * x + t * timeScalar, sampleScalar * y, 0) *
        moderatedAmplitude;
      // const noiseZ = noise(sampleScalar * x, sampleScalar * y + t * timeScalar, sampleScalar * z) * moderatedAmplitude

      vertices[i] = (10 - 9 * prog) * x + noiseX;
      vertices[i + 1] = (10 - 9 * prog) * y + noiseY;
      vertices[i + 2] = -0.1;
    }

    psGeo.attributes.position.needsUpdate = true;
  }

  function StartThree() {
    InitScene();
    InitVideoAndTextures();
    InitVidParticles();
    InitNonVidParticles();

    StartBgTween();

    // StartVidTween()

    function render(timestamp: any) {
      requestAnimationFrame(render);
      group.update(timestamp);

      updateVidParticles(timestamp);
      updateNonVidParticles(timestamp);
      renderer.setRenderTarget(renderTarget);
      renderer.render(videoScene, camera);

      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(particleScene, camera);
    }

    render(0);
  }

  function StartBgTween() {
    const tween = new TWEEN.Tween(bgParticleConfig, group)
      .to({ progress: 1 }, 5000)
      .onUpdate((p) => {
        bgParticle.psMat.uniforms.prog.value = p.progress;
      })
      .start();
  }


  const texts = [
    `High-quality data can only come from real\npeople…… and real human effort will always\nhave real value.`,
    `PrismaX envisions a world where AI\nachieves human-level comprehension of\nthe real world.`,
    `This is PrismaX, A Base Layer for\nReal-World Multimodal GenAI Apps.`,
  ];

  function StartVidTween() {
    const emergeTweens = [];
    const dismissTweens = [];

    for (let i = 0; i < videoUrls.length; i++) {
      const _i = i;
      const emerge = new TWEEN.Tween(vidParticleConfig, group)
        .to({ progress: 1 }, 1500)
        .onUpdate((param) => {
          vidParticle.psMat.uniforms.spreadProgress.value = param.progress;
          bgParticle.psMat.uniforms.prog.value = 1 - param.progress;
        })
        .easing(TWEEN.Easing.Back.In)
        .onStart(() => {

          //move video to start
          const playVideo = async () => {
            try {
              videoElements[_i].currentTime = 0;
              await videoElements[_i].play();
              videoMaterial.map = videoTextures[_i];
              videoMaterial.needsUpdate = true;

            } catch (e) {
              console.error("Video play failed:", e);
            }
          };
          playVideo();
          setText("");
          setTimeout(() => {
            setText(texts[_i]);
          }, 1000);
          if (_i === 1) {
            setCompleted(true)
            document.documentElement.style.overflow = "visible";
          }
        });
      emergeTweens.push(emerge);

      const dismiss = new TWEEN.Tween(vidParticleConfig, group)
        .to({ progress: 0 }, 1300)
        .delay(7000)
        .onUpdate((param) => {
          vidParticle.psMat.uniforms.spreadProgress.value = param.progress;
          bgParticle.psMat.uniforms.prog.value = 1 - param.progress;

        })
        .easing(TWEEN.Easing.Back.Out)
        .onComplete(() => {
          const index = (i + 1) % videoUrls.length;
          videoMaterial.map = videoTextures[index];
          videoElements[i].pause();
          videoElements[index].play();
          console.log('videoUrls.lengthvideoUrls.length', i, videoUrls.length);


          // if (i === 0) {
          //   // todo send out complete event
          //   setCompleted(true);
          //   //change html overflow to visible
          //   document.documentElement.style.overflow = "visible";

          // }
        })
        .onStart(() => {
          setText("");
        })

      dismissTweens.push(dismiss);
    }

    emergeTweens[0].chain(dismissTweens[0]);
    dismissTweens[0].chain(emergeTweens[1]);
    emergeTweens[1].chain(dismissTweens[1]);
    dismissTweens[1].chain(emergeTweens[2]);
    emergeTweens[2].chain(dismissTweens[2]);
    dismissTweens[2].chain(emergeTweens[0]);

    emergeTweens[0].start();
    videoElements[0].play();

  }

  React.useEffect(() => {
    StartThree();
  }, []);

  const [text, setText] = React.useState("");

  async function play() {
    setButtonText("REPLAY");
  }

  React.useEffect(() => {
    if (playing) {
      play();
    }
  }, [playing]);

  return (
    <>
      <div className="" style={{ width: "100%", height: "calc(93vh )" }}>

        <div className="sm:hidden relative z-[100000] ">
          <p
            className=" w-full pt-10 mo:pt-5 md:text-xl quattrocento mo:justify-center  mo:text-center font-medium  mo:text-lg  text-2xl   text-[#FFFFFF]"
            style={{
              visibility: playing ? 'hidden' : 'visible',
            }}
          >
            {`How Can We Help A.I.\nSee the World?`
              .split("\n")
              .map((line, lineIndex) => (
                <div key={lineIndex} style={{ marginLeft: lineIndex === 1 ? '130px' : '0' }}>
                  {line.split("").map((char, index) => (
                    <span
                      className="animspanonly"
                      key={Math.random()}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
              ))}
          </p>
        </div>

        <div className=" ">
          <div
            className="mo:top-[90px]"
            id="three1"
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "70%",
              position: "absolute",

            }}
          ></div>
        </div>

        <div className=" aos-init aos-animate   w-full prismax   overflow-x-hidden m-auto mo:w-full px-[100px] mo:px-20 flex-wrap justify-center mo:flex  mo:break-keep  mx-auto md:w-full md:px-[70px]   text-[#FFFFFF]">
          <div
            className=" mo:!bottom-[50pt] mo:mx-5 "
            style={{
              position: "absolute",
              bottom: "90pt",
              zIndex: 1,
            }}
          >
            <AnimText text={text} />
            <div className="mo:hidden ">
              <p
                className=" w-full md:text-xl quattrocento mo:justify-center  mo:text-center font-medium  mo:text-lg  text-2xl   text-[#FFFFFF]"
                style={{
                  display: playing ? "none" : "block",
                }}
              >
                {"How Can We Help A.I. See the World?"
                  .split("")
                  .map((char, index) => (
                    <span
                      className="animspanonly md:text-lg"
                      key={Math.random()}
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
              </p>
            </div>
          </div>
        </div>

        <div
          className=" mo:!bottom-[93pt] flex justify-center w-full"
          style={{
            display: playing ? "none" : "block",
            position: "absolute",
            bottom: "95pt",
            width: "100%",
            height: "20pt",
            color: "white",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <button
            className=" rounded-[500px]  mo:ml-0  border w-[10.4375rem] h-[3.6875rem] border-[hsla(0,0%,100%,.2)] text-[16px]  font-medium  hover:border-[#fff] btnE quattrocento"
            onClick={() => {
              StartVidTween();
              setPlaying(true);
            }}
          >
            {buttonText}
          </button>
        </div>
        <div className="flex justify-end mo:hidden   m-auto mo:w-full mo:px-[30px]   mx-auto md:w-full md:px-[70px] ">
          <div
            className=" flex"
            style={{
              display: completed ? "block" : "none",
              position: "absolute",
              bottom: "80pt",
              height: "20pt",
              color: "white",
              textAlign: "right",
              zIndex: 2,
              paddingRight: "40pt",
            }}
          >
            <div
              onMouseOver={() => {
                setDealHover(true);
              }}
              onMouseLeave={() => {
                setDealHover(false);
              }}
              className={`flex cursor-pointer scrollDown items-center gap-2 ${dealHover ? "text-[#FFFFFF]" : "text-[#EEEEEEB2] "
                }`}
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Icon
                name={"IconScroll"}
                color={dealHover ? "#FFFFFF" : "#EEEEEE70"}
              />
              Scroll Down
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
