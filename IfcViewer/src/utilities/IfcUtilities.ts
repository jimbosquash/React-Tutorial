
import {Button, useTheme} from "@mui/material";
import React, { useRef } from "react";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import * as OBC from "openbim-components";
import * as FRAGS from "bim-fragment";
import * as WEBIFC from "web-ifc";

export interface buildingElement {
    expressID: number;
    GlobalID: string;
    type: number;
    properties: {name: string, value: string}[]
  }
  
export async function GetBuildingElements(loadedModel : FRAGS.FragmentsGroup, components : OBC.Components)
{
    const propsProcessor = components.tools.get(OBC.IfcPropertiesProcessor);
    const foundElements: buildingElement[] = [];
    await OBC.IfcPropertiesUtils.getRelationMap(loadedModel,WEBIFC.IFCRELDEFINESBYPROPERTIES,(async (propertySetID, _relatedElementsIDs) => { 

        var element = await propsProcessor.getProperties(loadedModel,_relatedElementsIDs.toString());
            
        if(element)
            {
                const newElement : buildingElement = {
                    expressID: element[0].expressID,
                    GlobalID: element[0].GlobalId.value,
                    type: element[0].type,
                    properties: []
                };                
                OBC.IfcPropertiesUtils.getPsetProps(loadedModel,propertySetID,(async (propertyId) => {
                    var property = await propsProcessor.getProperties(loadedModel,propertyId.toString());
                    if(property)
                    {
                        newElement.properties.push({
                            name: property[0].Name.value,
                            value: property[0].NominalValue.value})
                    }
                }))
                //console.log("new element: ",newElement);
                foundElements.push(newElement)
            }
    } ))
    return foundElements;
}