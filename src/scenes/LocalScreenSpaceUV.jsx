// src/scenes/LocalScreenSpaceUV.jsx
import React, { useRef, useMemo } from "react"
import { useFrame, useThree, useLoader } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"
import { vertexShader, fragmentShader } from "../shaders/localScreenSpaceUV"

const LocalScreenSpaceUVMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    cubeCenter: new THREE.Vector4(),
    cubeBounds: new THREE.Vector3(),
    uvTexture: null,
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
  const texture = useLoader(THREE.TextureLoader, "./textures/uvs_01.jpg")

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const boundingBox = useMemo(
    () => new THREE.Box3().setFromObject(new THREE.Mesh(geometry)),
    [geometry]
  )
  const cubeBounds = useMemo(
    () => boundingBox.getSize(new THREE.Vector3()),
    [boundingBox]
  )

  useFrame(({ camera, clock }) => {
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
      const cubeScreenPosition = cubeWorldPosition.project(camera)
      // console.log(cubeScreenPosition)

      materialRef.current.resolution.set(size.width, size.height)
      materialRef.current.cubeCenter.set(
        cubeScreenPosition.x,
        cubeScreenPosition.y,
        cubeScreenPosition.z,
        1
      )
      // materialRef.current.cubeCenter.set(
      //   (cubeScreenPosition.x + 1) / 2,
      //   (cubeScreenPosition.y + 1) / 2,
      //   cubeScreenPosition.z,
      //   1
      // )
      materialRef.current.cubeBounds.copy(cubeBounds)
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <localScreenSpaceUVMaterial ref={materialRef} uvTexture={texture} />
    </mesh>
  )
}

export default LocalScreenSpaceUV
