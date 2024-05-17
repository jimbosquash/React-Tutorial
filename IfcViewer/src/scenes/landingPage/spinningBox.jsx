import * as THREE from "three"
import { Html, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Add, AddCircleRounded, ControlPointSharp } from "@mui/icons-material"
import { useRef,useState } from "react"
import React from "react"
import { defaultGetRowsToExport } from "@mui/x-data-grid/internals"
import { green } from "@mui/material/colors"
import UploadIfcButton from "../../components/uploadIfcButton"
import {Button, Fab, useTheme} from "@mui/material";
import {tokens} from "../../theme"
import { useEffect } from "react"



// points of interest

const points = [
    {
        position: new THREE.Vector3(1.55,0.3,-0.6),
        element: document.querySelector(".point-0")   
    }
]


export default function SpinnningBox() {
    const cube = useRef();
    useFrame((state,delta) => {
        cube.current.rotation.y += delta * 0.2;


        for(const point of points)
        {
            const screenPos = point.position.clone();
            // screenPos.project(camera);
        }


    })

    const eventHandler = (event) => {
        console.log("the event occured")
        // cube.current.material.color.set(green);
        cube.current.wireframe = !cube.current.wireframe;
        console.log(cube.current.wireframe)
    }
    
    return<>
    <OrbitControls/>
    <mesh ref={cube} onClick={eventHandler}>
        <Html> 
            <FloatingButton parentMesh={cube}/>
        </Html>
        <boxGeometry/>
        <meshNormalMaterial/>
    </mesh>
    </>
}


function FloatingButton({parentMesh}) {
    const [showMessage,setShowMessage] = useState(0);
    const [zoom,setZoom] = useState(0);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        console.log("message show = ", showMessage)
    },[showMessage])

    return (
        <div>
            <Fab size="small" 
            sx={{
                backgroundColor: colors.blueAccent[600],
                transform: zoom ? "scale(1.2)" : "scale(0.8)",
                transition: "transform 0.18s ease-in-out",
            }}
            onMouseEnter={() => {
                setZoom(true)
                setShowMessage(true)}} 
            onMouseLeave={() => {
                setZoom(false)
                setShowMessage(false)}}>
                <Add/>
            </Fab>
            
        </div>
    );
}


// <Button 
//                 onMouseEnter={() => {setShowMessage(true)}} 
//                 onMouseLeave={() => {setShowMessage(false)}}
//                 sx={{
//                     backgroundColor: colors.blueAccent[700],
//                     color: colors.grey[100],
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                     // width: "auto",
//                     top:"-20px",
//                     left:"-50px",
//                     whiteSpace: "nowrap",
//                     padding: "10px 20px",
//                 }}>
//                 {/* <UploadOutlinedIcon sx={{ mr: "10px" }} /> */}
//                 {showMessage && <h4>I am showing a message</h4>}
//             </Button>
            