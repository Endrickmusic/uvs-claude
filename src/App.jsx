// src/App.jsx
import React, { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Controls from "./components/Controls"
import StandardUV from "./scenes/StandardUV.jsx"
import ScreenSpaceUV from "./scenes/ScreenSpaceUV.jsx"
import WorldSpaceUV from "./scenes/WorldSpaceUV.jsx"
import LocalScreenSpaceUV from "./scenes/LocalScreenSpaceUV.jsx"

const scenes = {
  standard: StandardUV,
  screenSpace: ScreenSpaceUV,
  worldSpace: WorldSpaceUV,
  localScreenSpace: LocalScreenSpaceUV,
  // Add more scenes here as you implement them
}

function App() {
  const [currentScene, setCurrentScene] = useState("localScreenSpace")
  const Scene = scenes[currentScene]

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, -5], zoom: 100, near: 0.01, far: 1000 }}
      >
        <Scene />
        <OrbitControls />
      </Canvas>
      <Controls setScene={setCurrentScene} />
    </div>
  )
}

export default App
