// src/App.jsx
import React, { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Controls from "./components/Controls"
import StandardUV from "./scenes/StandardUV"
import ScreenSpaceUV from "./scenes/ScreenSpaceUV"
import WorldSpaceUV from "./scenes/WorldSpaceUV"
import LocalScreenSpaceUV from "./scenes/LocalScreenSpaceUV"

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
      <Canvas camera={{ position: [0, 0, -5] }}>
        <Scene />
        <OrbitControls />
      </Canvas>
      <Controls setScene={setCurrentScene} />
    </div>
  )
}

export default App
