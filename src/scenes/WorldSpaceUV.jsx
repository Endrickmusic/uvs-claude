// src/scenes/WorldSpaceUV.jsx
import React, { useMemo } from "react"
import { shaderMaterial } from "@react-three/drei"
import { extend, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { vertexShader, fragmentShader } from "../shaders/worldSpaceUV"

const WorldSpaceUVMaterial = shaderMaterial(
  { scale: 1.0 },
  vertexShader,
  fragmentShader
)

extend({ WorldSpaceUVMaterial })

const WorldSpaceUV = () => {
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height)
  }, [viewport])

  return (
    <mesh geometry={geometry}>
      <worldSpaceUVMaterial scale={0.1} />
    </mesh>
  )
}

export default WorldSpaceUV
