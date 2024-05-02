
import { useThree } from "@react-three/fiber";
import * as WEBIFC from "web-ifc";
import { Fragment, useEffect, useState } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";
import React from "react";
import * as FRAGS from "bim-fragment";
import { Color, MeshStandardMaterial } from "three";
import { IfcPropertiesUtils } from "openbim-components";



export default function HandleIFC({ containerRef, path, name, propertiesPath}) {

    //Function to return a temporary mesh with just a box while the IFC has not loaded
    const setTempModel = () => {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial()
        return new THREE.Mesh(geometry, material)
    }

    // Get the scene from the underlying instance of threejs
    const { scene } = useThree()
    // State that will contain the rendered model at everytime, starts with a temporary cube
    const [meshObj, setMeshObj] = useState<any>(setTempModel())

    // On component mount, load the IFC model
    // On component unmount, clear the IFC model
    useEffect(() => {
        // If the canvas exists
        if (containerRef.current) {
            console.log(containerRef.current)
            // Setup OBC as per example
            const components = new OBC.Components()
            components.scene = new OBC.SimpleScene(components)
            components.renderer = new OBC.SimpleRenderer(components, containerRef.current)
            const cameraComponent = new OBC.OrthoPerspectiveCamera(components);
            cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);
            components.camera = cameraComponent;
            components.camera.enabled;
            components.init()

            const fragmentIfcLoader = new OBC.FragmentIfcLoader(components)
            var fragmentManager = new OBC.FragmentManager(components);

            fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true
            fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true

            async function loadDemoFragment(path : string,fragments : OBC.FragmentManager) : Promise<FRAGS.FragmentsGroup> {
                const file = await fetch(path);
                const data = await file.arrayBuffer();
              
                const buffer = new Uint8Array(data);
              
                const model =  await fragments.load(buffer);
                console.log(model)
                setMeshObj(model);

                

                const properties = await fetch(propertiesPath);
                model.setLocalProperties(await properties.json());

                console.log(model)
                const map: { [expressID: number]: Set<number> } = {};

                var res = await IfcPropertiesUtils.getRelationMap(model,WEBIFC.IFCRELDEFINESBYPROPERTIES,async (relatingID, relatedIDs) => {
                    if (!map[relatingID]) 
                    map[relatingID] = new Set();
                    const props: number[] = [];
                    await IfcPropertiesUtils.getPsetProps(model, relatingID, (propID) => {
                      props.push(propID);
                      map[relatingID].add(propID);
                      if (!map[propID]) map[propID] = new Set();
                      map[propID].add(relatingID);
                    });
                    for (const relatedID of relatedIDs) {
                      map[relatingID].add(relatedID);
                      for (const propID of props) map[propID].add(relatedID);
                      if (!map[relatedID]) map[relatedID] = new Set();
                      map[relatedID].add(relatedID);
                    }
                  }
                )
                console.log(res)


                for(var i = 0; i < model.children.length; i++)
                {

                    var child = model.children[i]
                    if(child instanceof THREE.InstancedMesh)
                    {
                        //console.log(child);
                        if(child.instanceColor !== null){
                            var oldColor = child.instanceColor.array;
                            var material = new MeshStandardMaterial();
                            material.color = new THREE.Color(oldColor[0],oldColor[1],oldColor[2]);
                            material.side = THREE.DoubleSide;
                            child.material = [material]

                        //     if(child.material[0] instanceof THREE.MeshLambertMaterial)
                        // {
                        //     // console.log(child.material[0].color);
                        //     //console.log(child);
                        //     //child.material[0].color.setColorName("purple")
                        //     child.material[0].side = THREE.DoubleSide;


                        // }
                        }
                        
                        
                    }
                    else
                    {
                        console.log('not frag')
                    }
                }

                return model;
              }

            // Load the fragments
             //loadIfcAsFragments()

             const m = loadDemoFragment(path,fragmentManager);
        }
        else
        {
            console.log("no container ref")
        }

        return () => {
            // Get the model from the threeJS scene found by the name given when loading the IFC fragments, and clear it from the scene
            // IMPORTANT NOTE: It might be wise to use the ".dispose" method available from OBC components to dispose all OBC elements, not just the model in threejs
            const model = scene.children.find((ele) => ele.name === name)
            if (model) {
                model.clear()
            }
        }
    },[])

    //Return a primitive containg the model set in the meshObj state, initially it'll be the cube, then the IFC
    // Idea: might be possible to use <Suspense> here and create a loading state, instead of the temp cube
    return (
        <primitive object={meshObj} />
    )
}
