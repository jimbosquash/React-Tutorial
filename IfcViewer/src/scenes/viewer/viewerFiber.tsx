import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import '../../styles.css'
import {useEffect, useState} from 'react'
import LoadModel from '../../utilities/modelLoader';
import React from 'react';
import * as FRAGS from "bim-fragment";

export default function ViewerFiber({ifcModel})
{
    // const containerRef = useRef(null);                               //only need this if passing it into the ifc creation object
    const [fragGroup,setFragGroup] = useState<FRAGS.FragmentsGroup>();

    useEffect(() => {
        if(ifcModel)
            setFragGroup(ifcModel);
        
    },[ifcModel])


    console.log('viewer')
    return (
        <Canvas
        // ref={containerRef}
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