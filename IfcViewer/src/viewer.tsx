import * as OBC from 'openbim-components';
import * as THREE from "three"
import { useRef, useEffect } from 'react';
import React from 'react';
import * as FRAGS from "bim-fragment";


function IfcViewer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewer = new OBC.Components();

    useEffect(() => {
        async function loadModelAndSetupScene() {
            if (!containerRef.current) {
                return;
            }
            const rendererComponent = new OBC.SimpleRenderer(viewer,containerRef.current)
            rendererComponent.resize(new THREE.Vector2(window.innerWidth, window.innerHeight));
            viewer.renderer = rendererComponent;
            viewer.renderer.enabled = true; 
            setupViewer(viewer);
    
            // set up fragment loader
            var fragments = new OBC.FragmentManager(viewer);
            var fragmentIfcLoader = new OBC.FragmentIfcLoader(viewer);
            
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


            // note: for now The WASM files are copied manually from the unpkg link bellow
            //fragmentIfcLoader.setup()
            //If you want to the path to unpkg manually, then you can skip the line 
            //above and set them manually as below:
            // fragmentIfcLoader.settings.wasm = {
            // path: "https://unpkg.com/web-ifc@0.0.50/",
            // absolute: true}

        

            fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
            fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;        
            try {
                const loadedModel = await loadIfcAsFragments(fragmentIfcLoader);
                viewer.scene.get().add(loadedModel);
                console.log(viewer.scene);
                exportFragments(fragments);
            } catch (error) {
                console.error("Failed to load model:", error);
            }
        }
    
        loadModelAndSetupScene();

        return () => {
            window.removeEventListener('resize',() =>{});//handleResize
        };
    }, []); // Empty dependency array means this effect runs only once after the initial render
    

    window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    var cam = viewer.camera.get();
    if ( cam instanceof THREE.PerspectiveCamera) {
    cam.aspect = width / height;
    cam.updateProjectionMatrix();
    }
    var renderer = viewer.renderer.get();

    if ( renderer instanceof THREE.WebGLRenderer) {
        renderer.setSize(width, height);
        renderer.domElement.width = width;
        renderer.domElement.height = height;
        }
    });


    
return (
<>
<div ref={containerRef}/>
</>
);
}




function setupViewer(viewer : OBC.Components) {

    
        viewer.init();
        //viewer.onInitialized.add(() => {})
        viewer.scene = new OBC.SimpleScene(viewer);
        viewer.raycaster = new OBC.SimpleRaycaster(viewer);

        const scene = viewer.scene.get();
        const ambientLight = new THREE.AmbientLight(0xE6E7E4, 1);
        const directionalLight = new THREE.DirectionalLight(0xF9F9F9, 0.75);
        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
        scene.add(ambientLight, directionalLight);
        scene.background = new THREE.Color(0x666666);
        
        cameraComponent.controls.setLookAt(10,10,10,0,0,0);
        viewer.camera = cameraComponent
        new OBC.SimpleGrid(viewer, new THREE.Color(0x666666))
          //demo add cube
          //addDemoCube(scene);
}



function addDemoCube(scene: THREE.Scene)
{
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

    async function exportFragments(fragments: OBC.FragmentManager) {
        if (!fragments.groups.length) return;
        const group = fragments.groups[0];
        const data = fragments.export(group);
        const blob = new Blob([data]);
        const fragmentFile = new File([blob], 'small.frag');
        const files: File[] = [];
        files.push(fragmentFile);
        const properties = group.getLocalProperties();
        console.log(properties);
        if (properties) {
        files.push(new File([JSON.stringify(properties)], 'small.json'));
        }
        // const result = await downloadZip(files).blob();
        // result.name = 'example';
        // download(result);
        }

        function download(file) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            }

export default IfcViewer;
