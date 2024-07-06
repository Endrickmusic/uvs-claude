// src/scenes/LocalScreenSpaceUV.jsx
import React, { useRef, useMemo, useCallback } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"
import { vertexShader, fragmentShader } from "../shaders/localScreenSpaceUV"

const LocalScreenSpaceUVMaterial = shaderMaterial(
  {
    uResolution: new THREE.Vector2(),
    uCubePosition: new THREE.Vector3(),
    uCubeViewPosition: new THREE.Vector3(),
    uCubeBounds: new THREE.Vector3(),
    uCubeScale: new THREE.Vector3(),
    uvTexture: null,
    uDpr: 1,
    uCamPos: new THREE.Vector3(),
    uCamToWorldMat: new THREE.Matrix4(),
    uCamInverseProjMat: new THREE.Matrix4(),
    uInverseModelMat: new THREE.Matrix4(),
    uTime: 0,
    uMouse: new THREE.Vector2(),
    uForward: new THREE.Vector3(),
  },
  vertexShader,
  fragmentShader
)

extend({ LocalScreenSpaceUVMaterial })

const LocalScreenSpaceUV = () => {
  const meshRef = useRef()
  const materialRef = useRef()
  const { size, camera } = useThree()

  // Use useMemo for static or rarely changing values
  const texture = useMemo(
    () => new THREE.TextureLoader().load("./textures/UVs_03.jpg"),
    []
  )
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const boundingBox = useMemo(
    () => new THREE.Box3().setFromObject(new THREE.Mesh(geometry)),
    [geometry]
  )
  const uCubeBounds = useMemo(
    () => boundingBox.getSize(new THREE.Vector3()),
    [boundingBox]
  )

  // Use useCallback for the frame update function
  const updateUniforms = useCallback(
    ({ clock, mouse }) => {
      if (!meshRef.current || !materialRef.current) return

      const material = materialRef.current
      const mesh = meshRef.current

      // Update cube position
      const radius = 3
      const speed = 0.5
      const angle = clock.getElapsedTime() * speed
      // mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)

      // Calculate positions
      const cubeWorldPosition = mesh.getWorldPosition(new THREE.Vector3())
      const viewPosition = cubeWorldPosition
        .clone()
        .applyMatrix4(camera.matrixWorldInverse)
      const cubeScreenPosition = cubeWorldPosition.clone().project(camera)

      // Update uniforms
      material.uResolution.set(window.innerWidth, window.innerHeight)
      material.uDpr = window.devicePixelRatio
      material.uCubePosition.copy(cubeScreenPosition)
      material.uCubeViewPosition.copy(viewPosition)
      material.uCubeBounds.copy(uCubeBounds.clone().project(camera))
      material.uCubeScale.copy(mesh.scale)
      material.uTime = clock.getElapsedTime()
      material.uMouse.set(mouse.x, mouse.y)
      material.uCamPos.copy(camera.position)
      material.uCamToWorldMat.copy(camera.matrixWorld)
      material.uCamInverseProjMat.copy(camera.projectionMatrixInverse)
      material.uInverseModelMat.copy(mesh.matrixWorld).invert()

      // console.log("camera postion", camera.position)

      const forward = new THREE.Vector3(0, 0, -1)
      camera.getWorldDirection(forward)
      // const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      //   camera.quaternion
      // )
      material.uForward.copy(forward)
      console.log("forward", forward)
    },
    [camera, uCubeBounds]
  )

  useFrame(updateUniforms)

  return (
    <mesh scale={3} ref={meshRef} geometry={geometry}>
      <localScreenSpaceUVMaterial ref={materialRef} uvTexture={texture} />
    </mesh>
  )
}

export default LocalScreenSpaceUV
