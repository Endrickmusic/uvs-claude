// src/scenes/StandardUV.jsx
import React, { useMemo } from "react"
import { shaderMaterial } from "@react-three/drei"
import { extend, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { vertexShader, fragmentShader } from "../shaders/standardUV"

const StandardUVMaterial = shaderMaterial({}, vertexShader, fragmentShader)

extend({ StandardUVMaterial })

const StandardUV = () => {
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height)
  }, [viewport])

  return (
    <mesh geometry={geometry}>
      <standardUVMaterial />
    </mesh>
  )
}

export default StandardUV
