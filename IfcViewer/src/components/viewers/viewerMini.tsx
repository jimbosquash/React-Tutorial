import * as OBC from "openbim-components";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import React from "react";
import * as FRAGS from "bim-fragment";
import JSZip from "jszip";
import { WebGLRenderer } from "three";
import GUI from 'lil-gui'
import { IfcPropertiesUtils } from "openbim-components";

const viewer = new OBC.Components();

// const gui = new GUI();

export default function IfcViewer() {
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      
      async function loadModelAndSetupScene() {
        if (!containerRef.current) {
          console.log('nothing found')
          return;
        
        }
        console.log(containerRef.current)

        setupViewer(viewer,containerRef.current);
  
        // set up fragment loader
        var fragments = new OBC.FragmentManager(viewer);
        var fragmentIfcLoader = new OBC.FragmentIfcLoader(viewer);
        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

        
        const mainToolbar = new OBC.Toolbar(viewer, {
          name: "Main Toolbar",
          position: "bottom",
        });
        mainToolbar.visible = true;
        mainToolbar.active = true;
        viewer.ui.addToolbar(mainToolbar);  
        createPropertyViewerPanel(fragmentIfcLoader,mainToolbar);     
        //var model = await loadDemoFragment(fragments);

        var model = await loadDemoIfcAsFragments(viewer,fragments,fragmentIfcLoader)


        setUpHighlightSelection(containerRef.current,model);
        var p = await model?.getLocalProperties()
        console.log(p)
      }
  
      loadModelAndSetupScene();

      return () => {
        window.removeEventListener("resize", () => {}); //handleResize
      };
    }, []); // Empty dependency array means this effect runs only once after the initial render
  
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
  }
  
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      console.log(window.innerHeight)
      var cam = viewer.camera.get();
      if (cam instanceof THREE.PerspectiveCamera) {
        cam.aspect = sizes.width / sizes.height;
        cam.updateProjectionMatrix();
      }
      var renderer = viewer.renderer.get();
  
      if (renderer instanceof THREE.WebGLRenderer) {
        renderer.setSize(sizes.width, sizes.height);
        //renderer.domElement.width = width;
        //renderer.domElement.height = height;
      }
    });

    return (
      <>
        <div ref={containerRef} />
      </>
    );
  }

  async function loadDemoIfcAsFragments(
    viewer: OBC.Components,
    fragments: OBC.FragmentManager,
    fragmentIfcLoader: OBC.FragmentIfcLoader
  ): Promise<FRAGS.FragmentsGroup | undefined> {
    console.log('attempting to load test ifc file')
    try {
      const file = await fetch("../../../resources/ZEN.ifc");
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const loadedModel = await fragmentIfcLoader.load(buffer);
      viewer.scene.get().add(loadedModel);
      console.log(viewer.scene);
      return loadedModel;
    } catch (error) {
      console.error("Failed to load model:", error);
    }
    return undefined;
  }


function setupViewer(viewer: OBC.Components, container: HTMLDivElement) {

    const rendererComponent = new OBC.PostproductionRenderer(viewer,container);
    rendererComponent.resize(new THREE.Vector2(window.innerWidth, window.innerHeight));
    viewer.renderer = rendererComponent;
    viewer.renderer.enabled = true;

    viewer.init();
    viewer.scene = new OBC.SimpleScene(viewer);
    viewer.raycaster = new OBC.SimpleRaycaster(viewer);
  
    const scene = viewer.scene.get();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);  
    scene.add(ambientLight, directionalLight);
    const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
    cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);
    viewer.camera = cameraComponent;
    viewer.camera.enabled;
    var grid =new OBC.SimpleGrid(viewer, new THREE.Color('#A0C3AF'));
    scene.background = new THREE.Color('#4D534F');

    const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7

    // const plane = new THREE.Mesh(
    // new THREE.PlaneGeometry(20, 20),
    // material
    // )
  

  // const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(0.5, 32, 32),
  //   material)
  
  // plane.rotation.x = - Math.PI * 0.5
  // plane.position.y = - 0.5
  // plane.position.x = 2
  // plane.position.z = -2.5
  
  // scene.add(sphere, plane)
  console.log(scene)
  }

  async function loadDemoFragment(fragments : OBC.FragmentManager) : Promise<FRAGS.FragmentsGroup> {
    const file = await fetch("../resources/small.frag");
    const data = await file.arrayBuffer();
  
    const buffer = new Uint8Array(data);
  
    const model =  await fragments.load(buffer);
    console.log(model);
  
    const properties = await fetch("../resources/small.json");
    model.setLocalProperties(await properties.json());
    return model;
  }

async function setUpHighlightSelection(container : HTMLDivElement, model : FRAGS.FragmentsGroup | undefined) {
if(model === undefined)
{
  console.log('model is undefined')
  return 
}
    const propsProcessor = new OBC.IfcPropertiesProcessor(viewer);
    propsProcessor.process(model);
const propsManager = new OBC.IfcPropertiesManager(viewer);
propsProcessor.propertiesManager = propsManager;


    const highlighter = new OBC.FragmentHighlighter(viewer);
    highlighter.setup();
    highlighter.updateHighlight();
    
    highlighter.outlineEnabled = true;
    if(viewer.renderer instanceof OBC.PostproductionRenderer)
    {
      viewer.renderer.postproduction.enabled = true;
      viewer.renderer.postproduction.customEffects.outlineEnabled = true;  
    }
  
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: '#BCF124',
      depthTest: false,
      opacity: 0.8,
      transparent: true
      });

    highlighter.add('default', [highlightMaterial]);

    const outlineProps = {
        color: 0xf0ff7a
    }
    highlighter.outlineMaterial.color.set(outlineProps.color);
      highlighter.zoomToSelection = true;
      highlighter.fillEnabled = true;
  
      // gui.addColor(highlightMaterial,'color').name('Fill color')
      // gui.addColor(outlineProps,'color').name('outline color')
      // gui.add(highlightMaterial,'opacity').min(0).max(1).step(0.01);
      // gui.add(highlighter,'zoomToSelection')
      // gui.add(highlighter,'fillEnabled')

      let lastSelection;
      let singleSelection = {value: true,};
  
      async function highlightOnClick(event) {  
        const result = await highlighter.highlight('default', singleSelection.value);
        if (result) {
        {
          lastSelection = {};
          console.log("result: ");
          console.log(result.id);
          //var selectedProps = await model.getProperties(result.id)  
          //console.log(selectedProps);
          console.log(model.getObjectById(result.id));
          

        }
        for (const fragment of result.fragments) 
        {
            const fragmentID = fragment.id;
            lastSelection[fragmentID] = [result.id];

            const expressID = [result[fragmentID]][0];
            var model;
            for(const [_key, value] of model.keyFragments) 
            {
                if(value === fragmentID) 
                {
                    //model = group;
                    break;
                }
            }
            if(model) {
                propsProcessor.renderProperties(model, expressID);
                }
        }
        }
        }
  
        container.addEventListener('click', (event) => highlightOnClick(event));
  }


  async function createPropertyViewerPanel(fragmentIfcLoader: OBC.FragmentIfcLoader, mainToolbar: OBC.Toolbar){
  
    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    if (ifcButton instanceof OBC.Button) {
      console.log(ifcButton);
      mainToolbar.addChild(ifcButton);
    }
    const propsFinder = new OBC.IfcPropertiesFinder(viewer);
    const propsp = new OBC.IfcPropertiesFinder(viewer);
    await propsFinder.init();
    //propsFinder.uiElement.get("queryWindow").visible = true;
    mainToolbar.addChild(propsFinder.uiElement.get("main"));
  }