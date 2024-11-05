import React, { Suspense, use, useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei';
import TPoints from './TPoints';
type Props = {
  debug?: boolean
}

const videos = ['./1.mp4', './2.mp4']
let idx = 0
function ThreeScene({ debug = true }: Props) {

  const [videoUrl, setVideoUrl] = useState(videos[idx])
  const [isShow, setIsShow] = useState(true)

  const setVisible = (v: boolean | ((prevState: boolean) => boolean)) => {
    setIsShow(v)
    if (v) {
      setVideoUrl(videos[idx])
      idx += 1
      if (idx > 1) {
        idx = 0
      }
    }
  }





  return (
    <Canvas >
      <Suspense fallback={null}>
        <TPoints />
      </Suspense>
    </Canvas>
  );
}

export default ThreeScene;
