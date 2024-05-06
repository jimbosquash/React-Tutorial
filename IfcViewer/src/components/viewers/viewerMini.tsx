import * as OBC from "openbim-components";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import React from "react";
import * as FRAGS from "bim-fragment";
import JSZip from "jszip";
import { WebGLRenderer } from "three";
import GUI from 'lil-gui'
import * as WEBIFC from "web-ifc";
import { IfcCategoryMap, IfcPropertiesUtils } from "openbim-components";

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
        viewer.uiEnabled = true;
        const fragments = viewer.tools.get(OBC.FragmentManager);
        const fragmentIfcLoader = viewer.tools.get(OBC.FragmentIfcLoader);
        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

        
        const mainToolbar = new OBC.Toolbar(viewer, {
          name: "Main Toolbar",
          position: "bottom",
        });
        mainToolbar.visible = true;
        mainToolbar.active = true;
        viewer.ui.addToolbar(mainToolbar);  


        var model = await loadDemoIfcAsFragments(viewer,fragments,fragmentIfcLoader)
        setUpHighlightSelection(containerRef.current,model);
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
        renderer.setSize(sizes.width, sizes.height * 0.7);
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
  
  // set up property searching
    const propsProcessor = new OBC.IfcPropertiesProcessor(viewer);
    propsProcessor.process(model);


    const propsManager = new OBC.IfcPropertiesManager(viewer);
    propsProcessor.propertiesManager = propsManager;

    propsProcessor.uiElement.get("propertiesWindow").visible = true


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

    var highlighterEvents = highlighter.events;

    highlighterEvents.select.onHighlight.add( async (selection) => {
      const fragmentID = Object.keys(selection)[0];
      const expressID = [...selection[fragmentID]][0];
      let localModel
      console.log("groups", model)

      for (const group of viewer.tools.get(OBC.FragmentManager).groups) {
      for(const [_key, value] of group.keyFragments) {
      if(value === fragmentID) {
      model = group;
      break;
      }
      }
      }
      console.log("express id", expressID)
      // console.log("index map",propsProcessor.get())
      if(model) {
      const { name } = await IfcPropertiesUtils.getEntityName(model, expressID);
      // console.log("entity selected", name)
      GetAllProperties(propsProcessor,model,expressID);
      propsProcessor.renderProperties(model, expressID);
      }
      }
      );
  }

   async function GetAllProperties(propProcessor: OBC.IfcPropertiesProcessor, model: FRAGS.FragmentsGroup, expressID: number) {
    if (!model.hasProperties) {
      throw new Error("FragmentsGroup properties not found.");
    }

    const modelElementsIndexation = propProcessor.get()[model.uuid];
    if (!modelElementsIndexation) return null;

    const entity = await model.getProperties(expressID);
    console.log("entity",entity)

    const ignorable = propProcessor.entitiesToIgnore.includes(entity?.type);
    if (!entity || ignorable) return null;

    if (entity.type === WEBIFC.IFCPROPERTYSET)
      {
        const pset = await model.getProperties(expressID);
        console.log("pSet found:", pset)
        //return newPsetUI(model, expressID);
      }
      else
      {
        console.log("type:", IfcCategoryMap[entity.type])
      }

    //const mainGroup = await newEntityTree(model, expressID);

// my custom part
const psetPropsIDs = await IfcPropertiesUtils.getPsetProps(model,expressID,(async (newId) => {console.log("prop:",await model.getProperties(newId))}))
console.log(psetPropsIDs)

  const psetPropsID = await IfcPropertiesUtils.getPsetProps(
  model,
  expressID,
  async (propID) => {
    const prop = await model.getProperties(propID);
    console.log("props", prop)
    if (!prop) 
      return;
    // const tag = await newPropertyTag(
    //   model,
    //   psetID,
    //   propID,
    //   "NominalValue"
    // );
    // if (tag) {
    //   uiGroup.addChild(tag);
    // }
  }
);
// my custom part end

    // if (!mainGroup) return null;
    // addEntityActions(model, expressID, mainGroup);

    // mainGroup.onExpand.add(async () => {
    //   const { uiProcessed } = mainGroup.data;
    //   if (uiProcessed) return;
    //   mainGroup.addChild(...newAttributesUI(model, expressID));
    //   const elementPropsIndexation = modelElementsIndexation[expressID] ?? [];
    //   for (const id of elementPropsIndexation) {
    //     const entity = await model.getProperties(id);
    //     if (!entity) continue;

    //     const renderFunction =
    //       _renderFunctions[entity.type] ?? _renderFunctions[0];

    //     const ui = modelElementsIndexation[id]
    //       ? await newEntityUI(model, id)
    //       : await renderFunction(model, id);

    //     if (!ui) continue;
    //     mainGroup.addChild(...[ui].flat());
    //   }

    //   mainGroup.data.uiProcessed = true;
    // });

    // return mainGroup;
  }

  // async function newEntityTree(model: FRAGS.FragmentsGroup, expressID: number) {
  //   const entity = await model.getProperties(expressID);
  //   if (!entity) return null;
  //   //const currentUI = _currentUI[expressID];
  //   //if (currentUI) return currentUI;
  //   // const entityTree = new TreeView(this.components);
  //   //_currentUI[expressID] = entityTree;
  //   // const entityTree = this._entityUIPool.get();
  //   entityTree.title = `${IfcCategoryMap[entity.type]}`;
  //   const { name } = await IfcPropertiesUtils.getEntityName(model, expressID);
  //   entityTree.description = name;
  //   return entityTree;
  // }

  // async function newPsetUI(model: FRAGS.FragmentsGroup, psetID: number) {
  //   const uiGroups: TreeView[] = [];
  //   const pset = await model.getProperties(psetID);
  //   if (!pset || pset.type !== WEBIFC.IFCPROPERTYSET) {
  //     return uiGroups;
  //   }


// my custom part
// const psetPropsID = await IfcPropertiesUtils.getPsetProps(
//   model,
//   psetID,
//   async (propID) => {
//     const prop = await model.getProperties(propID);
//     if (!prop) 
//     return;
//     console.log("props", prop)
//     // const tag = await newPropertyTag(
//     //   model,
//     //   psetID,
//     //   propID,
//     //   "NominalValue"
//     // );
//     // if (tag) {
//     //   uiGroup.addChild(tag);
//     // }
//   }
// );
// my custom part end


    // const uiGroup = await newEntityTree(model, psetID);
    // if (!uiGroup) {
    //   return uiGroups;
    // }

    //await this.addPsetActions(model, psetID, uiGroup);

    // uiGroup.onExpand.add(async () => {
    //   const { uiProcessed } = uiGroup.data;
    //   if (uiProcessed) return;
    //   const psetPropsID = await IfcPropertiesUtils.getPsetProps(
    //     model,
    //     psetID,
    //     async (propID) => {
    //       const prop = await model.getProperties(propID);
    //       if (!prop) return;
    //       const tag = await newPropertyTag(
    //         model,
    //         psetID,
    //         propID,
    //         "NominalValue"
    //       );
    //       if (tag) {
    //         uiGroup.addChild(tag);
    //       }
    //     }
    //   );

    //   if (!psetPropsID || psetPropsID.length === 0) {
    //     const template = `
    //      <p class="text-base text-gray-500 py-1 px-3">
    //         This pset has no properties.
    //      </p>
    //     `;
    //     const notFoundText = new SimpleUIComponent(this.components, template);
    //     uiGroup.addChild(notFoundText);
    //   }
    //   uiGroup.data.uiProcessed = true;
    // });

    // uiGroups.push(uiGroup);
    // return uiGroups;
  //}



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