import Header from "../../components/Header";
import { tokens } from "../../theme";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import StatBox from "../../components/statBox.jsx";
import EmailIcon from "@mui/icons-material/Email";
import Team from "../../components/team";
import Bar from "../../components/BarChart";
import "./dashBoardStyles.css"
import ElementGrid from "../../components/ElementGrid";
import {useState} from "react";
import UploadCsvButton from "../../components/uploadCsvButton";
import MyResponsivePie from "../../components/pie";



export default function DashBoard(){
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [csvData,setCsvData] = useState([]);

    const handleFileLoad = (loadedFile) => {
        console.log("Received data", loadedFile)
        setCsvData(loadedFile);
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

        {/* {Row 1} */}
        
            <Box
            gridColumn={'span 4'}
            backgroundColor={colors.primary[400]}
            display='flex'
            alignContent="center"
            justifyContent="center"
            >
                <StatBox
                title="597"
                subtitle="out going"
                progress="0.75"
                increase="+14%"
                icon={
                    <EmailIcon
                        sx={{ color:colors.greenAccent[600],fontSize: "26px"}}
                    />
                }
                />

            </Box>

            <Box
            gridColumn={'span 4'}
            backgroundColor={colors.primary[400]}
            display='flex'
            alignContent="center"
            justifyContent="center"
            >
                <StatBox
                title="43,546"
                subtitle="incoming mail"
                progress="0.12"
                increase="+54%"
                icon={
                    <EmailIcon
                        sx={{ color:colors.greenAccent[600],fontSize: "26px"}}
                    />
                }
                />
            </Box>

            <Box
            gridColumn={'span 4'}
            backgroundColor={colors.primary[400]}
            display='flex'
            alignContent="center"
            justifyContent="center"
            >
                <StatBox
                title="1,432"
                subtitle="calls going"
                progress="0.86"
                increase="-12%"
                icon={
                    <EmailIcon
                        sx={{ color:colors.greenAccent[600],fontSize: "26px"}}
                    />
                }
                />
            </Box>



            {/* //Row 2 */}
            <Box
                gridColumn="span 3"
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
                <Box height="100%" ml="10px" mb="-70px" width={"90%"} height={"90%"}>
                    {/* <Bar isDashboard={true}/> */}
                    <MyResponsivePie/>
                </Box>
            </Box>

            <Box
                gridColumn="span 4"
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
                <Box height="100%" ml="10px" mb="-70px" width={"90%"} height={"90%"}>
                    <Bar isDashboard={true}/>
                </Box>
            </Box>

            
            <Box
                gridColumn={'span 5'}
                gridRow={'span 3'}
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
                </Box>

           
        </Box>
    </Box>
  </>
}

