import Header from "../../components/Header";
import CsvReader from "./CsvReader";
import { tokens } from "../../theme";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import StatBox from "../statBox.jsx";
import EmailIcon from "@mui/icons-material/Email";
import Team from "../team";


export default function DashBoard(){

    const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return<>
  <Box m="20px">
    <Box
        m="20px"
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ border: '2px solid grey' }}>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
            <Button
                sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                }}>
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Download Reports
            </Button>
        </Box>
    </Box>
    <Box
        m="20px"
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ border: '2px solid grey' }}>
            <CsvReader/>
        <Box>

        </Box>
    </Box>

  </Box>
  </>


//     return<>
//         <Box 
//         m="20px"
//         width="100vw" 
//         height="100vh" 
//             >
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
//                 <Box>
//                     <Button
//                         sx={{
//                         backgroundColor: colors.blueAccent[700],
//                         color: colors.grey[100],
//                         fontSize: "14px",
//                         fontWeight: "bold",
//                         padding: "10px 20px",
//                         }}
//                     >
//                         <DownloadOutlinedIcon sx={{ mr: "10px" }} />
//                         Download Reports
//                     </Button>
//                 </Box>
//             </Box>  

//             {/* GRID & CHARTS */}
//             <Box
//                 display="grid"
//                 gridTemplateColumns="repeat(12, 1fr)"
//                 gridAutoRows="140px"
//                 gap="20px"
//                 width="100vw" // Makes the grid full width
//                 height="100vh" // Makes the grid full height

//             >
//                 {/* ROW 1 */}
//                 <Box
//                 gridColumn="span 3"
//                 backgroundColor={colors.primary[400]}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 >
                    
//     <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
//       This Box renders as an HTML section element.
//     </Box>
//     <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
//       This Box renders as an HTML section element.
//     </Box>
//                 {/* <StatBox
//                     title="12,361"
//                     subtitle="Emails Sent"
//                     progress="0.75"
//                     increase="+14%"
//                     icon={
//                     <EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }}/>
//                     }/> */}
// {/*                     
//                     <StatBox
//                     title="12,361"
//                     subtitle="Emails Sent 2"
//                     progress="0.75"
//                     increase="+14%"
//                     icon={
//                     <EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }}/>
//                     }/> */}
// {/* 
//                     <StatBox
//                     title="12,361"
//                     subtitle="Emails Sent 3"
//                     progress="0.75"
//                     increase="+14%"
//                     icon={
//                     <EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }}/>
//                     }/> */}
//                 </Box>
//             </Box>
//         </Box>
//         </>
}

{/* 
    <CsvReader/>
    </> */}