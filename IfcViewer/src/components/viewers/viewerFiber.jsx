import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import '../../styles.css'
import {useRef} from 'react'
import HandleIFC from './handleIfc.tsx';




export default function ViewerFiber()
{
    const containerRef = useRef(null);


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
            {/* <mesh scale={10} rotation-x={Math.PI * -0.5}>
                <planeGeometry/>
                <meshStandardMaterial color={"ivory"}/>
            </mesh> */}

            <HandleIFC containerRef={containerRef} path={"../resources/small.frag"} propertiesPath={"../resources/small.json"} name={"TestFrag"} />
            <Grid 
            infiniteGrid={true}
            cellColor={"#A0C3AF"}
            sectionColor={'#A0C3AF'}
            fadeDistance={25}
            fadeStrength={1}/>
    </Canvas>
      );
}



//     useEffect(() => {
// // set up of attaching new ifc things to fiber

// async function loadModelAndSetupScene() {
//     if (!containerRef) {
//       console.log('no current found')
//         return;
//     }
//     console.log(containerRef.current)

//     // setupViewer(viewer,containerRef.current);

//     // // set up fragment loader
//     // var fragments = new OBC.FragmentManager(viewer);
//     // var fragmentIfcLoader = new OBC.FragmentIfcLoader(viewer);
//     // fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
//     // fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;
//   }

//   loadModelAndSetupScene();
//         //console.log(containerRef.current)

//     })