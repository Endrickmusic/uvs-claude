// src/components/Controls.jsx
import React from "react"

const Controls = ({ setScene }) => {
  return (
    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <button onClick={() => setScene("standard")}>Standard UV</button>
      <button onClick={() => setScene("screenSpace")}>Screen Space UV</button>
      <button onClick={() => setScene("worldSpace")}>World Space UV</button>
      {/* Add more buttons for other UV types */}
    </div>
  )
}

export default Controls
