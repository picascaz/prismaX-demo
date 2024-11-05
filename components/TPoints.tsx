import { useTexture, useVideoTexture } from '@react-three/drei';
import { PointLightHelperProps, RawShaderMaterialProps, ShaderMaterialProps, useFrame, useLoader, useThree } from '@react-three/fiber';

import gsap from 'gsap';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import * as THREE from "three";

const getPosition = (count = 300, mesh: any) => {
  const positions = []
  for (let index = 0; index < count; index++) {
    const x = (Math.random() * 2 - 1) * 1
    const y = (Math.random() * 2 - 1) * 1
    const z = (Math.random() * 2 - 1) * 1
    // 判断是否在圆内
    if (mesh) {
      const position = new THREE.Vector3(x, y, z)
      const mat4 = new THREE.Matrix4()
      var localPosition = position.applyMatrix4(mat4.copy(mesh!.matrixWorld).invert());
      if (mesh!.geometry.boundingSphere.containsPoint(localPosition)) {
        positions.push(x, y, z)
      } else {
        positions.push(0, 0, 0)
      }
    } else {
      positions.push(x, y, z)
    }
  }

  return positions
}

const getBasePositions = (points: string | any[] | THREE.TypedArray, scale = 4) => {
  const positions = []
  for (let index = 0; index < points.length; index += 3) {
    const x = points[index]
    const y = points[index + 1]
    const z = points[index + 2]
    const vec3 = new THREE.Vector3(x, y, z).multiply(new THREE.Vector3(Math.random() * scale, Math.random() * scale, Math.random() * scale))

    positions.push(vec3.x, vec3.y, vec3.z)
  }
  return positions
}
const getCirclePositions = (count = 300, mesh: any) => {

  const positions = []
  for (let index = 0; index < count; index++) {
    const x = (Math.random() * 2 - 1) * 1
    const y = (Math.random() * 2 - 1) * 1
    const z = 0//(Math.random() * 2 - 1) * 2
    // 判断是否在圆内
    const position = new THREE.Vector3(x, y, z)
    const mat4 = new THREE.Matrix4()
    var localPosition = position.applyMatrix4(mat4.copy(mesh.matrixWorld).invert());
    if (mesh.geometry.boundingSphere.containsPoint(position)) {
      positions.push(x, y, z)
    } else {
      positions.push(0, 0, 0)
    }
  }
  return positions

}

const getParams = (count = 300) => {
  const speed = []
  const scale = []
  for (let index = 0; index < count; index++) {
    speed.push(0.5 + Math.random() * 0.5)
    scale.push(Math.random())
  }
  return [speed, scale]
}

const count = 1800
let i = 0
const videos = ['./walk1.mp4', './2.mp4']
let idx = 0
function TPoints() {
  const pointsRef = useRef<any>({});
  const videoPointsRef = useRef<any>();
  const videoShaderRef = useRef<any>({});
  const [visible, setVisible] = useState(true)


  const v_texture1 = useVideoTexture(videos[0], {
    playsInline: true,
    autoplay: true,
    hls: { abrEwmaFastLive: 1.0, abrEwmaSlowLive: 3.0, enableWorker: true }
  })
  v_texture1.needsUpdate = true
  const v_texture2 = useVideoTexture(videos[1], {
    playsInline: true,
    autoplay: true,
    hls: { abrEwmaFastLive: 1.0, abrEwmaSlowLive: 3.0, enableWorker: true }
  })
  v_texture2.needsUpdate = true


  const alphaTexture = useTexture('./assets/images/timelineDotMask.jpg')

  const bGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    return geometry
  }, [])

  const pGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1, 150, 150)
    return geometry
  }, [])


  const [circleMesh] = useMemo(() => {
    const circleMesh = new THREE.Mesh()
    circleMesh.geometry = new THREE.CircleGeometry(1, 32)
    circleMesh.material = new THREE.MeshBasicMaterial({
      color: 0xff0000
    })
    circleMesh.geometry.computeBoundingSphere()
    circleMesh.updateMatrixWorld();
    // scene.add(circleMesh)
    return [circleMesh]
  }, [])
  const [sphereGeometry] = useMemo(() => {
    const sphereGeometry = new THREE.Mesh()
    sphereGeometry.geometry = new THREE.SphereGeometry(1, 32)
    sphereGeometry.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })
    sphereGeometry.geometry.computeBoundingSphere()
    sphereGeometry.updateMatrixWorld();
    // scene.add(sphereGeometry)
    return [sphereGeometry]
  }, [])




  const updatePositions = (from: any, to: any) => {
    const positionAttribute = new THREE.BufferAttribute(from, 3)
    positionAttribute.needsUpdate = true
    bGeometry.setAttribute('position', positionAttribute)

    const toPosition = new THREE.BufferAttribute(to, 3)
    toPosition.needsUpdate = true
    bGeometry.setAttribute('to_position', toPosition)

    const speedAttr = new THREE.BufferAttribute(speeds, 1)
    speedAttr.needsUpdate = true
    bGeometry.setAttribute('speed', speedAttr)

    const scaleAttr = new THREE.BufferAttribute(scales, 1)
    scaleAttr.needsUpdate = true
    bGeometry.setAttribute('scale', scaleAttr)


  }

  let [basePositions, positions, circlePositions, toPPositions] = useMemo(() => {
    const positions = getPosition(count, sphereGeometry)
    const basePositions = getBasePositions(positions)
    const cpositions = getCirclePositions(count, circleMesh)
    const new_cpositions = getBasePositions(cpositions, 1)
    // const cpositions = pGeometry.attributes.position.array
    const pPositions = pGeometry.attributes.position.array
    const toPPositions = getBasePositions(pPositions, 1)
    pGeometry.setAttribute('to_position', new THREE.BufferAttribute(new Float32Array(toPPositions), 3))
    return [
      new Float32Array(basePositions),
      new Float32Array(positions),
      new Float32Array(new_cpositions),
      new Float32Array(pPositions),
      new Float32Array(toPPositions)
    ];
  }, []);

  let [speeds, scales] = useMemo(() => {
    const [speeds, scales] = getParams(count)
    return [new Float32Array(speeds), new Float32Array(scales)]
  }, [])



  const customShader = {
    uniforms: {
      time: {
        value: 0
      },
      process: {
        value: 0
      }
    },
    vertexShader: /* glsl */` 
      uniform float time; 
      attribute vec3 to_position;
      uniform  float process;
      attribute float scale;
      attribute float speed;
      varying vec2 vUv;
      varying vec3 vPos;
      void main () {     
          vec3 dist = to_position - position ;
          float percent = process / speed;
          vec3 pos ;
          if(percent < .95){
            pos = position + dist * process;  
          }else{
            pos = to_position;
          }   
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = scale;
        gl_PointSize *= 40.0 / -(modelViewMatrix * vec4(pos, 1.0)).z; 
        vUv = uv;
        vPos = pos;
      }`,
    fragmentShader: /* glsl */`  
      varying vec3 vPos;
      varying vec2 vUv; 
       void main(){
          float strength = distance(gl_PointCoord,vec2(0.5));
          float dis = length(gl_PointCoord.xy - 0.5);
          dis = smoothstep(0.5,0.0,dis);
          strength = step(0.5,strength);
          strength = 1.0 - strength; 
          if(strength == 0.0){
            discard;
          } 
          if(dis == 0.0){
            discard; 
          } 
          if(vPos.x == 0.0 && vPos.y == 0.0 && vPos.z == 0.0){
            discard;
          } 
           gl_FragColor = vec4(vec3(1.),dis*0.8);
          
    }`
  };

  const customCircleShader = {
    uniforms: {
      u_texture: {
        value: v_texture1
      },
      u_alphaTexture: {
        value: alphaTexture
      },
      process: {
        value: 0
      },

    },
    vertexShader: /* glsl */`
    varying vec2 vUv; 
    attribute vec3 to_position;
    uniform float process;
 
    void main() { 
        vUv =uv;   
        vec3 dist =position - to_position ; 
        vec3 pos ; 
        if(process <0.95){
            pos = to_position + dist * process;   
          }
          else{
            pos = position;
          }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
        gl_PointSize =10.0;
       
    }
    `,
    fragmentShader:  /* glsl */` 
    varying vec2 vUv;
    uniform sampler2D u_texture; 
    uniform sampler2D u_alphaTexture;
    uniform float process;
    void main() {    
        vec4 alpha = texture2D(u_alphaTexture,vUv);
        vec4 rgba = texture2D(u_texture,vUv); 
        gl_FragColor=vec4(rgba*alpha);  
}   `
  }

  const changeVideo = () => {
    if (customCircleShader.uniforms.u_texture.value === v_texture1) {
      customCircleShader.uniforms.u_texture.value === v_texture2
      videoShaderRef.current!.uniforms!.u_texture.value = v_texture2

    } else {
      customCircleShader.uniforms.u_texture.value === v_texture1
      videoShaderRef.current!.uniforms!.u_texture.value = v_texture1
    }

  }
  const globalToCircle = () => {
    changeVideo()
    customShader.uniforms.process.value = 0
    customCircleShader.uniforms.process.value = 0
    gsap
      .to(customShader.uniforms.process, {
        value: 1,
        duration: 3,
        onComplete: () => {
          setVisible(false)
          pointsRef.current?.scale.set(0.0001, 0.0001, 0.0001);
          videoPointsRef.current?.scale.set(5, 5, 5);
          if (pointsRef.current) {
            pointsRef.current.rotation.y = 0
          }
        }
      })

    gsap
      .to(customCircleShader.uniforms.process, {
        delay: 5,
        value: 1,
        duration: 3,
        onComplete: () => {
          setTimeout(() => {
            circleToGlobal()

          }, 3000);
        }
      })
  }

  const circleToGlobal = () => {
    customShader.uniforms.process.value = 1
    customCircleShader.uniforms.process.value = 1

    gsap
      .to(customCircleShader.uniforms.process, {
        value: 0,
        duration: 3,
        onComplete: () => {
          setVisible(true)
          pointsRef.current?.scale.set(2.5, 2.5, 2.5);
          videoPointsRef.current?.scale.set(0.0001, 0.0001, 0.0001);
          globalToCircle()
        },
      })
    gsap
      .to(customShader.uniforms.process, {
        delay: 3,
        value: 0,
        duration: 4,

      })
  }
  useEffect(() => {
    // if (pointsRef.current && videoPointsRef.current) {
    updatePositions(basePositions, positions)
    setVisible(true)
    // pointsRef.current.scale.set(2.5, 2.5, 2.5);
    videoPointsRef.current?.scale.set(0.0001, 0.0001, 0.0001);
    gsap.to(customShader.uniforms.process, {
      value: 1,
      duration: 4,
      onComplete: () => {
        updatePositions(positions, circlePositions)
        globalToCircle()
      }
    })
    // }
    // pointsRef.current, videoPointsRef.current
  }, []);






  useFrame((_, delta) => {
    if (pointsRef.current) {
      if (!visible) {
        pointsRef.current.rotation.y = 0
      } else {
        pointsRef.current.rotation.y += 0.001
      }
    }

  });


  return (
    <>
      <points ref={pointsRef} geometry={bGeometry} scale={2.5}  >
        <shaderMaterial
          attach="material"
          transparent
          blending={THREE.AdditiveBlending}
          vertexShader={customShader.vertexShader}
          fragmentShader={customShader.fragmentShader}
          uniforms={customShader.uniforms}
          toneMapped={false}

        />
      </points >

      <points ref={videoPointsRef} position={[0, 0, 0]} scale={[5, 5, 5]} geometry={pGeometry}   >
        <shaderMaterial
          attach="material"
          ref={videoShaderRef}
          // sizeAttenuation
          transparent
          uniforms={customCircleShader.uniforms}
          vertexShader={customCircleShader.vertexShader}
          fragmentShader={customCircleShader.fragmentShader}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </points>
    </>


  );
}

export default TPoints;
