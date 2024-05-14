import {Button, useTheme} from "@mui/material";
import React, { useRef } from "react";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import * as OBC from "openbim-components";
import * as FRAGS from "bim-fragment";
import {tokens} from "../theme"
import SetUpIfcComponents from "./setUpIfcComponents";
import { GetBuildingElements } from "../utilities/IfcUtilities";



async function readIfcFile(file: File, containerRef : React.RefObject<HTMLElement | undefined>) : Promise<FRAGS.FragmentsGroup | undefined> {
    const components = SetUpIfcComponents(containerRef);
    //components.uiEnabled = false;

    const fragmentIfcLoader = components.tools.get(OBC.FragmentIfcLoader);

    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const loadedModel = await fragmentIfcLoader.load(buffer);

    const propsProcessor = components.tools.get(OBC.IfcPropertiesProcessor);
    propsProcessor.process(loadedModel);

    const foundElements = await GetBuildingElements(loadedModel,components);
    //console.log(foundElements);
    return loadedModel;
  }



  interface UploadIfcButtonProps {
      onIfcFileLoad: (model: any) => void;
  }
  
  const UploadIfcButton: React.FC<UploadIfcButtonProps> = ({ onIfcFileLoad }) => {
      const containerRef = useRef<HTMLElement>(null);
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
  
      const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files ? event.target.files[0] : null;
          if (file) {
              console.log("Start loading IFC file:", file.name);
              const loadedModel = await readIfcFile(file, containerRef); // Ensure readIfcFile is defined and imported
              onIfcFileLoad(loadedModel);
          }
      };
  
      const handleClick = () => {
          document.getElementById('ifcFileInput')?.click();
      };
  
      return (
          <div>
              <input
                  type="file"
                  id="ifcFileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".ifc"
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
                  Upload .IFC
              </Button>
          </div>
      );
  };
  
  export default UploadIfcButton;
  