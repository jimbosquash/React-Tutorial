import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { ControlPointSharp } from "@mui/icons-material"
import { useRef } from "react"
import SpinnningBox from "./spinningBox"


export default function LandingPage() { 
// green back ground
// logo in center
// button to enter to dashboard or upload file

// #241a1a
    return<>
    <Canvas>
        {/* <color args={['#241a1a']} attach="background"/> */}
    
    <SpinnningBox/>
    </Canvas>
    </>
}




