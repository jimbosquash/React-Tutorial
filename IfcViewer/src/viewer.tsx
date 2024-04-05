import * as OBC from 'openbim-components';
import * as THREE from "three"
import { useRef, useEffect } from 'react';
import React from 'react';
import { OrthoPerspectiveCamera } from 'openbim-components';
import * as FRAGS from "bim-fragment";


function Viewer() {
    const containerRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 0.1, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if(containerRef.current)
            containerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Add this inside the useEffect hook after initializing the camera
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        });

        // Add this function inside the useEffect hook
        const renderScene = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
            requestAnimationFrame(renderScene);
        };
        // Call the renderScene function to start the animation loop
        renderScene();

        // Add this inside the useEffect hook
        return () => {
            //window.removeEventListener('resize', undefined);//handleResize
        };
    }, []);





return (
<>
<canvas ref={containerRef}/>
</>
);
}

function IfcViewer() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadModelAndSetupScene() {
            if (!containerRef.current) {
                return;
            }
            const viewer = new OBC.Components();
            const rendererComponent = new OBC.SimpleRenderer(viewer,containerRef.current)
            rendererComponent.resize(new THREE.Vector2(window.innerWidth, window.innerHeight));
            viewer.renderer = rendererComponent;
            viewer.renderer.enabled = true; 
            setupViewer(viewer);
    
            // set up fragment loader
            let fragments = new OBC.FragmentManager(viewer);
            let fragmentIfcLoader = new OBC.FragmentIfcLoader(viewer);
            
            const mainToolbar = new OBC.Toolbar(viewer, {name: 'Main Toolbar', position: 'bottom'});
            viewer.ui.addToolbar(mainToolbar);
            const ifcButton = fragmentIfcLoader.uiElement.get("main");
            if(ifcButton instanceof OBC.Button)
                {
                    console.log(ifcButton);
                    mainToolbar.addChild(ifcButton)
                }
                const propsFinder = new OBC.IfcPropertiesFinder(viewer);
                await propsFinder.init();
                //propsFinder.uiElement.get("queryWindow").visible = true;
                mainToolbar.addChild(propsFinder.uiElement.get("main"))


            //fragmentIfcLoader.setup()
            //If you want to the path to unpkg manually, then you can skip the line 
            //above and set them manually as below:
            // fragmentIfcLoader.settings.wasm = {
            // path: "https://unpkg.com/web-ifc@0.0.50/",
            // absolute: true}


            fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
            fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;        // Assuming loadIfcAsFragments now correctly returns a THREE.Object3D instance
            try {
                const loadedModel = await loadIfcAsFragments(fragmentIfcLoader);
                viewer.scene.get().add(loadedModel);
                console.log(viewer.scene);
            } catch (error) {
                console.error("Failed to load model:", error);
            }
        }
    
        loadModelAndSetupScene();
    }, []); // Empty dependency array means this effect runs only once after the initial render
    


    
return (
<>
<div ref={containerRef}/>
</>
);
}




function setupViewer(viewer : OBC.Components) {

    
        viewer.init();
    
        //viewer.onInitialized.add(() => {})

        const sceneComponent = new OBC.SimpleScene(viewer)
        viewer.scene = sceneComponent;
        const scene = sceneComponent.get();
        const ambientLight = new THREE.AmbientLight(0xE6E7E4, 1);
        const directionalLight = new THREE.DirectionalLight(0xF9F9F9, 0.75);
        const raycasterComponent = new OBC.SimpleRaycaster(viewer);
        viewer.raycaster = raycasterComponent;
        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
        scene.add(ambientLight, directionalLight);
        var bg = new THREE.Color(0x666666)
        scene.background = bg;
        
        cameraComponent.controls.setLookAt(10,10,10,0,0,0);
        viewer.camera = cameraComponent
        var grid =         new OBC.SimpleGrid(viewer, new THREE.Color(0x666666))

        //if(typeof viewer.camera === OBC.OrthoPerspectiveCamera)
        if (viewer.camera instanceof OBC.OrthoPerspectiveCamera) {
            // The type of viewer.camera is narrowed down to OBC.OrthoPerspectiveCamera inside this block
            console.log(viewer.camera);
            
          }

          //demo add cube
          const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
cube.position.set(0, 1.5, 0);
scene.add(cube);


}


async function loadIfcAsFragments(fragmentIfcLoader: OBC.FragmentIfcLoader): Promise<FRAGS.FragmentsGroup>  {
    const file = await fetch('../../../resources/ZEN.ifc');
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer);
    console.log(model);
    return model;
    }

export default IfcViewer;
