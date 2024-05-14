import Header from "../../components/Header";
import { tokens } from "../../theme";
import { Box, Typography, useTheme } from "@mui/material";
import Bar from "../../components/BarChart";
import "./dashBoardStyles.css"
import ElementGrid from "../../components/ElementGrid";
import {useState, useEffect, useRef} from "react";
import UploadCsvButton from "../../components/uploadCsvButton";
import MyResponsivePie from "../../components/pie";
import UploadIfcButton from "../../components/uploadIfcButton";
import SummaryRow from "./summaryRow";
import SetUpIfcComponents from "../../components/setUpIfcComponents";
import {getStationBarChartArray, buildingElement, GetBuildingElements} from "../../utilities/IfcUtilities"
import * as OBC from "openbim-components";
import React from "react";
import * as FRAGS from "bim-fragment";


export default function DashBoard({ onIfcFileLoad,onComponentsSet}){
    const containerRef = useRef<HTMLElement>(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [csvData,setCsvData] = useState([]);
    const [ifcModel,setIfcModel] = useState<FRAGS.FragmentsGroup>();
    const [barChartData,setBarChartData] = useState<any[]>([]);
    const [obcComponents, setObcComponents] = useState<OBC.Components>();
    const [buildingElements,setBuildingElements] = useState<buildingElement[]>([]);


    const boxStyle = { 
        backgroundColor: colors.primary[400],
        borderRadius: 4,
        // display: "flex",
        justifyContent:"center",
    }

    useEffect(() => {
        const components = SetUpIfcComponents(containerRef);
        components.uiEnabled = false;
        setObcComponents(components);
    },[])

    const handleFileLoad = (loadedFile) => {
        console.log("Received data", loadedFile)
        setCsvData(loadedFile);
    }

    const handleIFCLoad = (loadedifcFile) => {
        console.log("upload complete")
        setIfcModel(loadedifcFile);
    }


    useEffect(() => {
        console.log("dashBoard getting elements start")

        async function asyncGetElements() {
            if(!ifcModel || !obcComponents)
                return;
            var newBuildingElements = await GetBuildingElements(ifcModel, obcComponents)
            var data = getStationBarChartArray(newBuildingElements);
            setBarChartData(data)


            setBuildingElements(newBuildingElements);
        }

        if(obcComponents && ifcModel)
            {
                asyncGetElements();
                console.log("dashBoard getting elements", buildingElements)
                onIfcFileLoad(ifcModel);
                onComponentsSet(obcComponents);


            }  
        },[ifcModel] )

  return<>
    <Box component={"div"}         
        m="20px">
        <Box
            component={"div"}
            m="20px"
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            >
            <Header title="Module Data Assistant" subtitle="Display ifc data in meaningful ways" />
            {/* <Box component={"div"}>
                <UploadCsvButton onFileLoad={handleFileLoad}/>
            </Box> */}
            <Box component={"div"}>
                <UploadIfcButton onIfcFileLoad={handleIFCLoad}/>
            </Box>
        </Box>

        {/* {Grid} */}

        <Box 
        component={"div"}
         className="scrollable-container"
            display='grid'
            height={"100%"}

            gridTemplateColumns={"repeat(12,1fr)"}
            gridAutoRows='140px'
            padding='20px'
            gap='20px'>
        <SummaryRow data={ifcModel} components={obcComponents}/>
            {/* //Row 2 */}
            

            <Box
                component={"div"}
                gridColumn="span 6"
                gridRow="span 3"
                style={boxStyle}                
                >
                <Box
                component={"div"}
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                    <Box  component={"div"}>
                        <Typography variant="h6" fontWeight={"600"} color={colors.grey[100]}>
                            Element types by Station
                        </Typography>
                    </Box>
                </Box>
                <Box component={"div"} ml="10px" mb="-70px" width={"90%"} height={"90%"}>
                    <Bar data={barChartData} keys={["CE", "UN", "EP", "Other"]} isDashboard={true}/>
                </Box>
            </Box>

            <Box
            style={boxStyle}
            component={"div"}
            gridColumn="span 6"
            gridRow="span 3"
            >
                <Box
                component={"div"}
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                    <Box  component={"div"}>
                        <Typography variant="h6" fontWeight={"600"} color={colors.grey[100]}>
                            Building Elements
                        </Typography>
                    </Box>
                </Box>
                <Box  component={"div"} ml="10px" mb="-70px" width={"90%"} height={"90%"}>
                    {/* <Bar isDashboard={true}/> */}
                    <MyResponsivePie/>
                </Box>
            </Box>
        </Box>
    </Box>
  </>
}

            {/* <Box
                gridColumn={'span 5'}
                gridRow={'span 2'}
                backgroundColor={colors.primary[400]}
                display='flex'
                alignContent="center"
                justifyContent="center"
                >
                    <Box
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                    <Box>
                        <Typography variant="h8" fontWeight={"600"} color={colors.grey[100]}>
                            Building Elements
                        </Typography>
                    </Box>
                </Box>
                <Box height="250px" width={"90%"}>
                    <ElementGrid data={csvData} isDashboard={true}/>
                </Box>
            </Box> */}

