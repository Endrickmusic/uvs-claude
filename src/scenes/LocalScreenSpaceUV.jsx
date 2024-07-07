// src/scenes/LocalScreenSpaceUV.jsx
import React, { useRef, useMemo, useEffect } from "react"
import { useFrame, useThree, useLoader } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"
import { vertexShader, fragmentShader } from "../shaders/localScreenSpaceUV"

const LocalScreenSpaceUVMaterial = shaderMaterial(
  {
    uResolution: new THREE.Vector2(),
    uCubePosition: new THREE.Vector3(),
    uCubeViewPosition: new THREE.Vector3(),
    uCubeScale: new THREE.Vector3(),
    uvTexture: null,
    dpr: { value: window.devicePixelRatio },
  },
  vertexShader,
  fragmentShader
)

extend({ LocalScreenSpaceUVMaterial })

const LocalScreenSpaceUV = () => {
  const meshRef = useRef()
  const materialRef = useRef()
  const { size } = useThree()

  // Load a UV grid texture
  const texture = useLoader(THREE.TextureLoader, "./textures/UVs_03.jpg")

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const boundingBox = useMemo(
    () => new THREE.Box3().setFromObject(new THREE.Mesh(geometry)),
    [geometry]
  )
  const cubeBounds = useMemo(
    () => boundingBox.getSize(new THREE.Vector3()),
    [boundingBox]
  )

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value
        .set(size.width, size.height)
        .multiplyScalar(Math.min(window.devicePixelRatio, 2))
    }
  }, [size, window.devicePixelRatio])

  useFrame(({ camera, clock }) => {
    // animate the cube
    if (meshRef.current && materialRef.current) {
      const radius = 3
      const speed = 0.5

      const angle = clock.getElapsedTime() * speed
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      meshRef.current.position.x = x
      meshRef.current.position.y = y

      const cubeWorldPosition = meshRef.current.getWorldPosition(
        new THREE.Vector3()
      )

      // get the view position
      const viewPosition = cubeWorldPosition
        .clone()
        .applyMatrix4(camera.matrixWorldInverse)

      // console.log("World Position:", cubeWorldPosition.z)
      // console.log("View Position:", viewPosition.z)

      // get the screen position
      const cubeScreenPosition = cubeWorldPosition.project(camera)
      // console.log(cubeScreenPosition)

      materialRef.current.uCubePosition.copy(cubeScreenPosition)

      materialRef.current.uCubeViewPosition.copy(viewPosition)

      console.log(cubeScreenPosition.z)

      materialRef.current.uCubeScale.copy(meshRef.current.scale)
    }
  })

  return (
    <mesh scale={2} ref={meshRef} geometry={geometry}>
      <localScreenSpaceUVMaterial ref={materialRef} uvTexture={texture} />
    </mesh>
  )
}

export default LocalScreenSpaceUV
