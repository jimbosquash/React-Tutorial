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

export default function DashBoard(){
    const containerRef = useRef<HTMLElement>(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [csvData,setCsvData] = useState([]);
    const [ifcModel,setIfcModel] = useState([]);
    const [obcComponents, setObcComponents] = useState([])

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

  return<>
    <Box         
        m="20px">
        <Box
            m="20px"
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            >
            <Header title="Module Data Assistant" subtitle="Display ifc data in meaningful ways" />
            <Box>
                <UploadCsvButton onFileLoad={handleFileLoad}/>
            </Box>
            <Box>
                <UploadIfcButton onIfcFileLoad={handleIFCLoad}/>
            </Box>
        </Box>

        {/* {Grid} */}

        <Box 
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
                gridColumn="span 6"
                gridRow="span 3"
                backgroundColor={colors.primary[400]}
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
                <Box ml="10px" mb="-70px" width={"90%"} height={"90%"}>
                    {/* <Bar isDashboard={true}/> */}
                    <MyResponsivePie/>
                </Box>
            </Box>

            <Box
                gridColumn="span 6"
                gridRow="span 3"
                backgroundColor={colors.primary[400]}
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
                <Box ml="10px" mb="-70px" width={"90%"} height={"90%"}>
                    <Bar isDashboard={true}/>
                </Box>
            </Box>

            
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
        </Box>
    </Box>
  </>
}

