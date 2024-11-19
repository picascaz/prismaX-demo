'use client'

import React from "react";
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const gltfUrl = 'model.glb'
let currentgltf = null
let bubbleContainer = null
const videoTextureURL = 'pol.mp4'

export default function ModelPage() {
  function StartThree() {

    const scene = new THREE.Scene()

    const container = document.getElementById('three')
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio * 2)
    container.appendChild(renderer.domElement)

    const width = container.clientWidth,
      height = container.clientHeight
    renderer.setSize(width, height)
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.5, 200);
    camera.position.set(0, 0.2, 15);

    //on window resize
    window.addEventListener('resize', () => {
      const width = container.clientWidth,
        height = container.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    })

    //load hdri
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()

    //load jpg as texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/hdri.jpg', function (texture) {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture
      scene.environment = envMap

      pmremGenerator.dispose()
    })


    /*
    const hdriLoader = new RGBELoader()
    let hdri = null
    hdriLoader.load('/hdri.hdr', function (texture) {
      hdri = pmremGenerator.fromEquirectangular(texture).texture
      texture.dispose()
      scene.environment = hdri
      //scene.background = hdri

      pmremGenerator.dispose()
    })
       */

    //ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
    scene.add(ambientLight)

    //center spotlight
    const pointLght = new THREE.PointLight(0xffffff, 200)
    pointLght.position.set(0, -1.3, 0.55)
    //radius
    pointLght.distance = 1.5
    scene.add(pointLght)

    //center spotlight2
    const pointLght2 = new THREE.PointLight(0xffffff, 20)
    pointLght2.position.set(-2.5, -1.3, 1)
    //radius
    pointLght2.distance = 3
    scene.add(pointLght2)


    //center spotlight3
    const pointLght3 = new THREE.PointLight(0xffffff, 20)
    pointLght3.position.set(0.2, 1, 0.3)
    //radius
    pointLght3.distance = 1
    scene.add(pointLght3)

    const loader = new GLTFLoader()

    async function LoadGLTF(url, progressCallback) {
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          function (gltf) {
            //change metiallic
            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                child.material.color = new THREE.Color(0xffffff)
                child.material.metalness = 0.7
                child.material.roughness = 0.2
                //map denoise
                child.material.map.encoding = THREE.sRGBEncoding
                child.material.map.anisotropy = 16
                //sample
                child.material.map.minFilter = THREE.NearestFilter
                child.material.map.magFilter = THREE.NearestFilter
                child.material.map.premultiplyAlpha = false;

                child.material.alphaTest = 0.01
                child.material.transparent = true
                //apply
                child.material.needsUpdate = true
              }
            })
            resolve(gltf)
          },
          function (xhr) {
            if (progressCallback) progressCallback(xhr.loaded / xhr.total)
          },
          function (error) {
            reject(error)
          }
        )
      })
    }

    LoadGLTF(gltfUrl, (progress) => {
      console.log(progress)
    }).then((gltf) => {
      currentgltf = gltf

      currentgltf.scene.rotation.x = 0
      currentgltf.scene.rotation.y = Math.PI / 2
      scene.add(gltf.scene)
    }).catch((error) => {
      console.error(error)
    });

    renderer.setAnimationLoop(render)
    function render(timestamp, frame) {
      renderer.render(scene, camera)
    }

    bubbleContainer = new THREE.Group()

    //left
    {
      //create bubbles using rects
      //from left to right
      const bubbleCount = 100
      const bubbleSize = 0.05
      const bubbleSpeed = 0.015
      //list of bubbles
      const bubbles = []
      const bubbleOpacity = []
      const bubbleSpeeds = []

      const geometry = new THREE.PlaneGeometry(bubbleSize, bubbleSize)
      const tex = new THREE.TextureLoader().load('/bubble.png')
      tex.encoding = THREE.sRGBEncoding
      for (let i = 0; i < bubbleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          map: tex
        })

        const bubble = new THREE.Mesh(geometry, material)
        bubble.position.set(
          Math.random() * 5 - 8,
          Math.random() * 3.6 - 2,
          Math.random() - 8
        )
        //random rotation
        bubble.rotation.z = Math.random() * Math.PI * 2
        //bubble.rotation.y = Math.random() * Math.PI * 2
        bubbles.push(bubble)
        //init bubble opacity
        bubbleOpacity.push(0)
        bubbleSpeeds.push(bubbleSpeed + Math.random() * 0.004)
        //scene.add(bubble)

        bubbleContainer.add(bubble)
      }

      const updaetBubbles = function () {
        for (let i = 0; i < bubbleCount; i++) {
          const bubble = bubbles[i]
          bubble.position.x += bubbleSpeeds[i]

          if (bubbleOpacity[i] < 1 && bubble.position.x < -4) {
            bubbleOpacity[i] += 0.01
          } else if (bubble.position.x > -4) {
            bubbleOpacity[i] -= 0.01
          }

          const lastScale = bubble.scale.x
          const sizeSpeed = 0.025
          if (bubble.position.x < -5.5) {
            //size enlarge
            bubble.scale.set(lastScale + sizeSpeed, lastScale + sizeSpeed, lastScale + sizeSpeed)
          } else {
            bubble.scale.set(lastScale - sizeSpeed, lastScale - sizeSpeed, lastScale - sizeSpeed)
          }

          if (bubble.position.x > -2) {
            bubble.position.x = -9
            //reset opacity
            bubbleOpacity[i] = 0
            //new speed
            bubbleSpeeds[i] = bubbleSpeed + Math.random() * 0.004
            //new z
            bubble.position.y = Math.random() * 3.6 - 2

            //reset size
            bubble.scale.set(1, 1, 1)
          }

          //opacity
          bubble.material.opacity = bubbleOpacity[i]
        }
      }

      //run 30 times
      for (let i = 0; i < 1000; i++) {
        updaetBubbles()
      }

      setInterval(() => {
        updaetBubbles()
      }, 30);
    }

    //right
    {
      //create bubbles using rects
      //from left to right
      const bubbleCount = 25
      const bubbleSize = 0.2
      const bubbleSpeed = 0.015
      //list of bubbles
      const bubbles = []
      const bubbleOpacity = []
      const bubbleSpeeds = []

      const geometry = new THREE.PlaneGeometry(bubbleSize, bubbleSize)
      const tex = new THREE.TextureLoader().load('/bubble2.png')
      tex.encoding = THREE.sRGBEncoding

      for (let i = 0; i < bubbleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          map: tex
        })

        const bubble = new THREE.Mesh(geometry, material)
        bubble.position.set(
          Math.random() * 5 + 2,
          Math.random() * 3.2 - 1.6,
          Math.random() - 8
        )
        bubble.rotation.z = Math.random() * Math.PI * 2

        bubbles.push(bubble)
        //init bubble opacity
        bubbleOpacity.push(0)
        bubbleSpeeds.push(bubbleSpeed + Math.random() * 0.004)
        //scene.add(bubble)

        bubbleContainer.add(bubble)
      }

      const updaetBubbles = function () {
        for (let i = 0; i < bubbleCount; i++) {
          const bubble = bubbles[i]
          bubble.position.x += bubbleSpeeds[i]

          if (bubbleOpacity[i] < 1 && bubble.position.x < 6) {
            bubbleOpacity[i] += 0.005
          } else if (bubble.position.x > 6) {
            bubbleOpacity[i] -= 0.01
          }

          //size enlarge
          const lastScale = bubble.scale.x
          const enlargeSpeed = 0.015
          bubble.scale.set(lastScale + enlargeSpeed, lastScale + enlargeSpeed, lastScale + enlargeSpeed)

          if (bubble.position.x > 8) {
            bubble.position.x = 2
            //reset opacity
            bubbleOpacity[i] = 0
            //new speed
            bubbleSpeeds[i] = bubbleSpeed + Math.random() * 0.004
            //new z
            bubble.position.y = Math.random() * 3.2 - 1.6,
              //reset size
              bubble.scale.set(1, 1, 1)
          }

          //opacity
          bubble.material.opacity = bubbleOpacity[i]
        }
      }

      //run 30 times
      for (let i = 0; i < 1000; i++) {
        updaetBubbles()
      }

      setInterval(() => {
        updaetBubbles()
      }, 30);
    }

    scene.add(bubbleContainer)
  }

  React.useEffect(() => {
    StartThree()

    //when mouse moves, rotate currentgltf
    document.addEventListener('mousemove', (event) => {
      if (currentgltf) {
        //look at mouse
        const x = event.clientX
        const y = event.clientY

        const width = window.innerWidth
        const height = window.innerHeight

        const xpercent = x / width
        const ypercent = y / height

        const xangle = (xpercent - 0.5) * Math.PI
        const yangle = (ypercent - 0.5) * Math.PI

        currentgltf.scene.rotation.x = yangle / 60
        currentgltf.scene.rotation.y = xangle / 60 + Math.PI / 2

        bubbleContainer.rotation.x = yangle / 60
        bubbleContainer.rotation.y = xangle / 60
      }
    })
  }, [])

  return (
    <>
      <div style={{ width: '100vw', height: '60vw' }}>
        <div
          id="three"
          style={{
            backgroundColor: 'transparent', width: '100vw', height: '60vw', position: 'absolute'
          }}
        >
        </div>
        <div style={{ position: 'absolute', margin: '6vw' }}>
          <h1
            style={{ fontSize: '4vw' }}
          >PrismaX PoV</h1>
        </div>
      </div >
    </>
  )
}