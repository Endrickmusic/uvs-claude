// src/scenes/LocalScreenSpaceUV.jsx
import React, { useRef, useMemo, useState } from "react"
import { useFrame, useThree, useLoader, extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { vertexShader, fragmentShader } from "../shaders/localScreenSpaceUV"

const LocalScreenSpaceUVMaterial = shaderMaterial(vertexShader, fragmentShader)

extend({ LocalScreenSpaceUVMaterial })

const LocalScreenSpaceUV = () => {
  const meshRef = useRef()
  const materialRef = useRef()
  const { size, camera } = useThree()

  const [worldToObjectMatrix, setWorldToObjectMatrix] = useState(
    new THREE.Matrix4()
  )

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

  const uniforms = useMemo(
    () => ({
      resolution: new THREE.Vector2(),
      cubePosition: new THREE.Vector3(),
      cubeViewPosition: new THREE.Vector3(),
      cubeBounds: new THREE.Vector3(),
      cubeScale: new THREE.Vector3(),
      uvTexture: null,
      dpr: window.devicePixelRatio,
      uCamPos: camera.position,
      uCamToWorldMat: camera.matrixWorld,
      uCamInverseProjMat: camera.projectionMatrixInverse,
      uInverseModelMat: new THREE.Matrix4(),
    }),
    [camera.position, camera.matrixWorld, camera.projectionMatrixInverse]
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

      const viewPosition = cubeWorldPosition
        .clone()
        .applyMatrix4(camera.matrixWorldInverse)

      console.log("World Position:", cubeWorldPosition.z)
      console.log("View Position:", viewPosition.z)

      const cubeScreenPosition = cubeWorldPosition.project(camera)
      // console.log(cubeScreenPosition)

      materialRef.current.uniforms.resolution.set(
        window.innerWidth,
        window.innerHeight
      )
      materialRef.current.uniforms.dpr = window.devicePixelRatio
      console.log(window.devicePixelRatio)

      // materialRef.current.resolution.set(size.width, size.height)
      materialRef.current.uniforms.cubePosition.set(
        cubeScreenPosition.x,
        cubeScreenPosition.y,
        cubeScreenPosition.z,
        1
      )

      materialRef.current.uniforms.cubeViewPosition.set(
        viewPosition.x,
        viewPosition.y,
        viewPosition.z,
        1
      )

      console.log(cubeScreenPosition.z)

      // Calculate cube bounds in screen space
      // This is a simplified example and might need adjustment based on your specific setup
      const cubeSize = new THREE.Vector3()
      meshRef.current.geometry.computeBoundingBox()
      meshRef.current.geometry.boundingBox.getSize(cubeSize)
      cubeSize.multiply(meshRef.current.scale)
      // materialRef.current.cubeBounds.set(
      //   (cubeSize.x / size.width) * 2.0,
      //   (cubeSize.y / size.height) * 2.0,
      //   cubeSize.z
      // )
      const cubeScreenBounds = cubeBounds.project(camera)
      materialRef.current.uniforms.cubeBounds.copy(cubeScreenBounds)
      console.log(cubeScreenBounds)

      materialRef.current.uniforms.cubeScale.copy(meshRef.current.scale)
    }
  })

  return (
    <mesh scale={2} ref={meshRef} geometry={geometry}>
      <localScreenSpaceUVMaterial
        ref={materialRef}
        // uvTexture={texture}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default LocalScreenSpaceUV
