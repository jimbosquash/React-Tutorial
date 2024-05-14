import { Canvas, ThreeElements, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Box } from '@react-three/drei'
import '../../styles.css'
import {useEffect, useRef, useState} from 'react'
import {LoadModel} from './handleIfc';
import HandleIFC from './handleIfc';
import React from 'react';
import * as FRAGS from "bim-fragment";
import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import * as OBC from "openbim-components";





export default function ViewerFiber({ifcModel, newComponents})
{
    const containerRef = useRef(null);
    const [fragGroup,setFragGroup] = useState<FRAGS.FragmentsGroup>();

    useEffect(() => {
        if(ifcModel)
            setFragGroup(ifcModel);
        
    },[ifcModel])


    console.log('viewer')
    return (
        <Canvas
        ref={containerRef}
        shadows
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ - 4, 3, 6 ]
        } }>
            <OrbitControls makeDefault />
            <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
            <ambientLight intensity={ 3.5 } />
            <LoadModel ifcModel={fragGroup}></LoadModel>
            {/* <HandleIFC containerRef={containerRef} path={"../resources/small.frag"} propertiesPath={"../resources/small.json"} name={"TestFrag"} /> */}
            <Grid 
            infiniteGrid={true}
            cellColor={"#A0C3AF"}
            sectionColor={'#A0C3AF'}
            fadeDistance={25}
            fadeStrength={1}/>
    </Canvas>
      );
}

            {/* <HandleIFC containerRef={containerRef} path={"../resources/small.frag"} propertiesPath={"../resources/small.json"} name={"TestFrag"} /> */}

// export function loadModel({ifcModel}) {
//     // Get the scene from the underlying instance of threejs
//     const { scene } = useThree()
//     // State that will contain the rendered model at everytime, starts with a temporary cube
//     const [meshObj, setMeshObj] = useState<any>()

//     // On component mount, load the IFC model
//     // On component unmount, clear the IFC model
//     useEffect(() => {

//         const setTempModel = () => {
//             const geometry = new THREE.BoxGeometry()
//             const material = new THREE.MeshBasicMaterial()
//             return new THREE.Mesh(geometry, material)
//         }

//         setMeshObj(setTempModel());

//         if (ifcModel) {
//             console.log("seting meshes: ",ifcModel)
//             setMeshObj(ifcModel);
//         }
//         else
//         {
//             console.log("no container ref")
//         }

//         return () => {
//             // IMPORTANT NOTE: It might be wise to use the ".dispose" method available from OBC components to dispose all OBC elements, not just the model in threejs
//             if (ifcModel && scene.children.includes(ifcModel)) {
//                 scene.remove(ifcModel);
//             }
//         }
//     },[ifcModel, scene])

//     // Idea: might be possible to use <Suspense> here and create a loading state, instead of the temp cube
//     return meshObj ? <primitive object={meshObj} /> : null;
    
// }


