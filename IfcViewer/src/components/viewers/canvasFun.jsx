import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Select, useSelect, useCursor, Edges } from '@react-three/drei'
import '../../styles.css'
import {useRef, useState} from 'react'

export default function CanvasFun()
{
    const containerRef = useRef(null);
    const [selected, setSelected] = useState([]);

    
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

            

            <Select multiple box onChange={console.log('select')} >
                <mesh position={[4,-0.1,0]} scale={[0.2,0.5,8]}>
                    <boxGeometry />

                    <meshStandardMaterial transparent={true} color={"#69726D"}/>
                </mesh>

                <mesh scale={10} rotation-x={Math.PI * -0.5}>
                <planeGeometry/>

                <meshStandardMaterial transparent={true} color={"#A0C3AF"}/>
            </mesh>
                
                <Cube scale={0.9} position={[-1, 0, 0]} color="orange" thickness={2} envMapIntensity={5} />
                <Cube scale={0.9} position={[0, 0, 0]} color="#eb8686" envMapIntensity={2} />
                
            </Select>
            {/* <mesh position={[4,-0.1,0]} scale={[0.2,0.5,8]}>
                    <boxGeometry />

                    <meshStandardMaterial transparent={true} color={"#69726D"}/>
                </mesh> */}
                {/* <mesh position={[-4,-0.1,0]} scale={[0.2,0.5,8]}>
                    <boxGeometry />
                    <meshStandardMaterial transparent={true} color={"#69726D"}/>
                </mesh> */}
            <Grid 
            infiniteGrid={true}
            cellColor={"#A0C3AF"}
            sectionColor={'#A0C3AF'}
            fadeDistance={25}
            fadeStrength={1}/>
    </Canvas>
      );
}


function Cube({ color = 'white', thickness = 1, roughness = 0.5, envMapIntensity = 1, transmission = 1, metalness, ...props }) {
    const [hovered, setHover] = useState(false)
    //const selected = useSelect().map((sel) => sel.userData.store)
    console.log(useSelect());

    // const [store, materialProps] = useControls(selected, {
    //   color: { value: color },
    //   roughness: { value: roughness, min: 0, max: 1 },
    //   thickness: { value: thickness, min: -10, max: 10 },
    //   envMapIntensity: { value: envMapIntensity, min: 0, max: 10 },
    //   transmission: { value: transmission, min: 0, max: 1 },
    //   ...(metalness !== undefined && { metalness: { value: metalness, min: 0, max: 1 } })
    // })
    //const isSelected = !!selected.find((sel) => sel === store)
    useCursor(hovered)
    return (
      <mesh
        {...props}
        // userData={{ store }}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}>
        <boxGeometry />
        <meshStandardMaterial transparent={true} color={"#69726D"}/>
        <Edges visible={true} scale={1.1} renderOrder={1000}>
          <meshBasicMaterial transparent color="#333" depthTest={false} />
        </Edges>
      </mesh>
    )
  }
