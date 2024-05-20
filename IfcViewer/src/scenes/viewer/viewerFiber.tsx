import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import '../../styles.css'
import {useEffect, useState} from 'react'
import LoadModel from '../../utilities/modelLoader';
import React from 'react';
import * as FRAGS from "bim-fragment";
import { buildingElement, GetBuildingElements } from '../../utilities/IfcUtilities';
import DraggableDataGrid from '../../components/draggabeDataGrid';
import DraggablePanel from '../../components/draggablePanel';


export default function ViewerFiber({ifcModel, components})
{
    // const containerRef = useRef(null);                               //only need this if passing it into the ifc creation object
    const [fragGroup,setFragGroup] = useState<FRAGS.FragmentsGroup>();
    const [loading, setLoading] = useState(false);
    const [buildingElements, setBuildingElements] = useState<buildingElement[]>([]);


    useEffect(() => {
        const fetchBuildingElements = async () => {
            if(ifcModel) {
                setLoading(true)
                setFragGroup(ifcModel);
                try{
                    const newBuildingElements = await GetBuildingElements(ifcModel,components);
                    setBuildingElements(newBuildingElements);
                 } catch (error) {
                    console.error("Error fetching building elements",error)
                } finally {
                    setLoading(false)
                }
            }
        };

        fetchBuildingElements();
    },[ifcModel,components]);

    useEffect(() => {
        console.log("elements changed, grouping starting")

        //set data for table
    }, [buildingElements])

    if(loading) return <div>Loading...</div>;

    return (
        <>
        <DraggablePanel>
            <h3> Building Elements</h3>
            <DraggableDataGrid data={buildingElements}/>
        </DraggablePanel>
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
    </>
      );
}