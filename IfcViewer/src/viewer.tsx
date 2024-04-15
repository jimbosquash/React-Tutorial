import * as OBC from "openbim-components";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import React from "react";
import * as FRAGS from "bim-fragment";
import JSZip from "jszip";
import { WebGLRenderer } from "three";
import { CustomEffectsPass } from "openbim-components/src/navigation/PostproductionRenderer/src/custom-effects-pass";
import GUI from 'lil-gui'

const viewer = new OBC.Components();

const gui = new GUI();

function IfcViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadModelAndSetupScene() {
      if (!containerRef.current) {
        return;
      }
      
      setupViewer(viewer,containerRef.current);

      // set up fragment loader
      var fragments = new OBC.FragmentManager(viewer);
      var fragmentIfcLoader = new OBC.FragmentIfcLoader(viewer);
      fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
      fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;


      const mainToolbar = new OBC.Toolbar(viewer, {
        name: "Main Toolbar",
        position: "left",
      });
      viewer.ui.addToolbar(mainToolbar);

      createPropertyViewerPanel(fragmentIfcLoader,mainToolbar);     
      createIfcImportButton(fragmentIfcLoader,mainToolbar);
      createDisposeFragmentsButton(fragments,mainToolbar);
      createImportFragButton(fragments,mainToolbar);
      createExportFragButton(fragments,mainToolbar);
      setUpHighlightSelection(containerRef.current);
      //   const loadedModel = await loadDemoIfcAsFragments(viewer,fragments,fragmentIfcLoader);

      // note: for now The WASM files are copied manually from the unpkg link bellow
      //If you want to the path to unpkg manually, then you can skip the line
      //above and set them manually as below:
      // fragmentIfcLoader.settings.wasm = {
      // path: "https://unpkg.com/web-ifc@0.0.50/",
      // absolute: true}

      
      var model = await loadDemoFragment(viewer,fragments);
      //var prop = model.getProperties();
      console.log(model);
      console.log(await model.getProperties(11));
      const classifier = new OBC.FragmentClassifier(viewer);
      classifier.byStorey(model);
      classifier.byEntity(model);
      classifier.byModel

      const modelTree = new OBC.FragmentTree(viewer);
      await modelTree.init();
      modelTree.update(['ifcRel']);
      const toolbar = new OBC.Toolbar(viewer);
      mainToolbar.addChild(modelTree.uiElement.get("main"));
      viewer.ui.addToolbar(toolbar);

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



function createImportFragButton(fragments: OBC.FragmentManager, mainToolbar: OBC.Toolbar){
  const openButton = new OBC.Button(viewer);
        openButton.materialIcon = "folder_open";
        openButton.tooltip = "Import frag";
        mainToolbar.addChild(openButton);
        openButton.onClick.add(() => importExternalFragment(fragments));
}

function createExportFragButton(fragments: OBC.FragmentManager, mainToolbar: OBC.Toolbar){
  const openButton = new OBC.Button(viewer);
        openButton.materialIcon = "folder";
        openButton.tooltip = "export frag";
        mainToolbar.addChild(openButton);
        openButton.onClick.add(() => exportFragments(fragments));
}

async function createPropertyViewerPanel(fragmentIfcLoader: OBC.FragmentIfcLoader, mainToolbar: OBC.Toolbar){
  
  const ifcButton = fragmentIfcLoader.uiElement.get("main");
  if (ifcButton instanceof OBC.Button) {
    console.log(ifcButton);
    mainToolbar.addChild(ifcButton);
  }
  const propsFinder = new OBC.IfcPropertiesFinder(viewer);
  await propsFinder.init();
  //propsFinder.uiElement.get("queryWindow").visible = true;
  mainToolbar.addChild(propsFinder.uiElement.get("main"));
}

async function createIfcImportButton(fragmentIfcLoader: OBC.FragmentIfcLoader, mainToolbar: OBC.Toolbar){
  
  const ifcButton = fragmentIfcLoader.uiElement.get("main");
  if (ifcButton instanceof OBC.Button) {
    console.log(ifcButton);
    mainToolbar.addChild(ifcButton);
  }
}


async function setUpHighlightSelection(container : HTMLDivElement) {
  const highlighter = new OBC.FragmentHighlighter(viewer);
  highlighter.setup();
  highlighter.updateHighlight();
  var postproduction = viewer.renderer;
  
  highlighter.outlineEnabled = true;
  if(viewer.renderer instanceof OBC.PostproductionRenderer)
  {
    viewer.renderer.postproduction.enabled = true;
    //console.log(viewer.renderer.postproduction);

  }

  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 'green',
    depthTest: false,
    opacity: 0.8,
    transparent: true
    });
  highlighter.add('default', [highlightMaterial]);

  highlighter.outlineMaterial.color.set(0xf0ff7a);


    highlighter.zoomToSelection = true;
    highlighter.fillEnabled = true;

    let lastSelection;
    let singleSelection = {value: true,};

    async function highlightOnClick(event) {
      //console.log(lastSelection);

      const result = await highlighter.highlight('default', singleSelection.value);

      if (result) {
      {
        lastSelection = {};
        console.log("result: ");
        console.log(result);
        console.log(highlighter);

      }
      for (const fragment of result.fragments) {
      const fragmentID = fragment.id;
      lastSelection[fragmentID] = [result.id];
      }
      }
      }

      container.addEventListener('click', (event) => highlightOnClick(event));
}

function createDisposeFragmentsButton(fragments: OBC.FragmentManager, mainToolbar: OBC.Toolbar){
  
  function disposeFragments() {
    fragments.dispose();
    }

    const disposeButton = new OBC.Button(viewer);
    disposeButton.materialIcon = "delete";
    disposeButton.tooltip = "Delete model";
    mainToolbar.addChild(disposeButton);
    disposeButton.onClick.add(() => disposeFragments());
}

function setupViewer(viewer: OBC.Components, container: HTMLDivElement) {

  const rendererComponent = new OBC.PostproductionRenderer(viewer,container);
  rendererComponent.resize(new THREE.Vector2(window.innerWidth, window.innerHeight));
  viewer.renderer = rendererComponent;
  viewer.renderer.enabled = true;
  var renderer = rendererComponent.get();
  if(renderer instanceof WebGLRenderer)
  {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  const shadows = new OBC.ShadowDropper(viewer);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;

  //rendererComponent.postproduction.customEffects.outlineEnabled = true;

  viewer.init();
  //viewer.onInitialized.add(() => {})
  viewer.scene = new OBC.SimpleScene(viewer);
  viewer.raycaster = new OBC.SimpleRaycaster(viewer);

  const scene = viewer.scene.get();
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(2, 2, - 1)  
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.far = 6
  directionalLight.shadow.camera.top = 5
  directionalLight.shadow.camera.bottom = -5
  directionalLight.shadow.camera.left = 5
  directionalLight.shadow.camera.right = -5
  directionalLight.shadow.radius = 10
  //const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  //directionLightCameraHelper.visible = false
  //scene.add( directionLightCameraHelper)

  scene.add(ambientLight, directionalLight);
  //scene.background = new THREE.Color('white');
scene.children.forEach(element => {
  if(element instanceof FRAGS.FragmentsGroup)
  {
    console.log('group in scene')
  }
  console.log(element.type)
});
  scene.children

  const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
  cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);
  viewer.camera = cameraComponent;
  viewer.camera.enabled;
  var grid =new OBC.SimpleGrid(viewer, new THREE.Color('grey'));

  const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
  
// const floor = new THREE.CircleGeometry(10,32,0,Math.PI *2)
//   const mesh = new THREE.Mesh(floor,material)
//   mesh.receiveShadow = true;
//   mesh.position.set(0,-0.01,0)
//   mesh.lookAt(0,1,0)

  //scene.add(mesh)

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    material
)

  const testCube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material);
  testCube.position.set(2,0,2)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material)

testCube.castShadow = true;
sphere.castShadow = true;
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.position.x = 2
plane.position.z = -2.5

plane.receiveShadow = true;
scene.add(sphere, plane,testCube)
console.log(scene)
}


async function loadDemoIfcAsFragments(
  viewer: OBC.Components,
  fragments: OBC.FragmentManager,
  fragmentIfcLoader: OBC.FragmentIfcLoader
): Promise<FRAGS.FragmentsGroup | undefined> {
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

async function loadDemoFragment(components: OBC.Components, fragments : OBC.FragmentManager) : Promise<FRAGS.FragmentsGroup> {
  const file = await fetch("../resources/small.frag");
  const data = await file.arrayBuffer();

  const buffer = new Uint8Array(data);

  const model =  await fragments.load(buffer);
  console.log(model);

  const properties = await fetch("../resources/small.json");
  model.setLocalProperties(await properties.json());
  return model;
}

async function exportFragments(fragments: OBC.FragmentManager) {
  if (!fragments.groups.length) return;
  const group = fragments.groups[0];
  const data = fragments.export(group);
  const blob = new Blob([data]);
  const fragmentFile = new File([blob], "small.frag");
  const files: File[] = [];
  files.push(fragmentFile);
  const properties = group.getLocalProperties();
  console.log(properties);
  if (properties) {
    files.push(new File([JSON.stringify(properties)], "small.json"));
  }
  // const result = await downloadZip(files).blob();
  // Create a zip file
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  // Generate the zip file
  const content = await zip.generateAsync({ type: "blob" });
  // Trigger the download
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "example.zip"; // Name of the downloaded file
  document.body.appendChild(a); // Append the anchor to the body to make it "clickable"
  a.click(); // Programmatically click the anchor to trigger the download
  document.body.removeChild(a); // Clean up by removing the anchor
}


function importExternalFragment(fragments: OBC.FragmentManager) {
    console.log(fragments.groups.length);
    //if (fragments.groups.length) return;
  const input = document.createElement("input");
  input.type = "file";
  console.log(input.files);
  input.onchange = async () => {
    if (input.files !== null && input.files[0].name.includes(".frag")) {
      const url = URL.createObjectURL(input.files[0]);
      const result = await fetch(url);
      const data = await result.arrayBuffer();
      const buffer = new Uint8Array(data);
      fragments.load(buffer);
    }
    input.remove();
  };
  input.click();
}


export default IfcViewer;
