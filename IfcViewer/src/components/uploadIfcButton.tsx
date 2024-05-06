import {Button, useTheme} from "@mui/material";
import React, { useRef } from "react";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import * as OBC from "openbim-components";
import * as FRAGS from "bim-fragment";

import {tokens} from "../theme"
import SetUpIfcComponents from "./setUpIfcComponents";


async function readIfcFile(file: File, containerRef : React.RefObject<HTMLElement | undefined>) {
      const components = SetUpIfcComponents(containerRef);
      components.uiEnabled = false;

      const fragmentIfcLoader = components.tools.get(OBC.FragmentIfcLoader);
      const propsProcessor = components.tools.get(OBC.IfcPropertiesProcessor);

      //const file = await fetch("../../../resources/ZEN.ifc");
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const loadedModel = await fragmentIfcLoader.load(buffer);

    //   propsProcessor.process(loadedModel);

    //   // the map.key = proprtySet, values = elements with set
    //   const mapByProperties = await OBC.IfcPropertiesUtils.getRelationMap(loadedModel,WEBIFC.IFCRELDEFINESBYPROPERTIES,(async (propertySetID, _relatedElementsIDs) => { 

    //     var element = await propsProcessor.getProperties(loadedModel,_relatedElementsIDs.toString());
            
    //     if(element)
    //         {
    //             const newElement : buildingElement = {
    //                 expressID: element[0].expressID,
    //                 GlobalID: element[0].GlobalId.value,
    //                 type: element[0].type,
    //                 properties: []
    //             };                
    //             OBC.IfcPropertiesUtils.getPsetProps(loadedModel,propertySetID,(async (propertyId) => {
    //                 var property = await propsProcessor.getProperties(loadedModel,propertyId.toString());
    //                 if(property)
    //                 {
    //                     newElement.properties.push({
    //                         name: property[0].Name.value,
    //                         value: property[0].NominalValue.value})
    //                 }
    //             }))
    //             console.log(newElement);
    //         }
    // } ))
    //   console.log(loadedModel);

    //   return loadedModel;
  }


  interface buildingElement {
    expressID: number;
    GlobalID: string;
    type: number;
    properties: any[]
  }

export default function UploadIfcButton({onIfcFileLoad}) {
    const containerRef = useRef<HTMLElement | undefined>(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file)
        {
            console.log("start loading ifc file",file)
            const loadedModel = readIfcFile(file, containerRef);     
            onIfcFileLoad(loadedModel);
        }
    }

    
    const handleClick = () => {
        document.getElementById('ifcFileInput')?.click();
    }

    return<>
    <div>
            <input
                type="file"
                id="ifcFileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".Ifc"
            />
            <Button
                    onClick={handleClick}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    }}>
                    <UploadOutlinedIcon sx={{ mr: "10px" }} />
                    Upload .ifc
                </Button>
        </div>
    </>
}