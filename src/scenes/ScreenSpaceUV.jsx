// src/scenes/ScreenSpaceUV.jsx
import React, { useMemo } from "react"
import { shaderMaterial } from "@react-three/drei"
import { extend, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { vertexShader, fragmentShader } from "../shaders/screenSpaceUV"

const ScreenSpaceUVMaterial = shaderMaterial(
  { resolution: new THREE.Vector2() },
  vertexShader,
  fragmentShader
)

extend({ ScreenSpaceUVMaterial })

const ScreenSpaceUV = () => {
  const { viewport, size } = useThree()

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height)
  }, [viewport])

  return (
    <mesh geometry={geometry}>
      <screenSpaceUVMaterial resolution={[size.width, size.height]} />
    </mesh>
  )
}

export default ScreenSpaceUV
