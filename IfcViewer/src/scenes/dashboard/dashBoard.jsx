import Header from "../../components/Header";
import CsvReader from "../../components/dashboard/CsvReader";
import { tokens } from "../../theme";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import StatBox from "../../components/statBox.jsx";
import EmailIcon from "@mui/icons-material/Email";
import Team from "../../components/team";
import Bar from "../../components/BarChart";


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
            // sx={{ border: '2px solid grey' }}
            >
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

        {/* {Grid} */}

        <Box
            display='grid'
            gridTemplateColumns={"repeat(12,1fr)"}
            gridAutoRows='140px'
            padding='20px'
            gap='20px'>

        {/* {Row 1} */}
        
            <Box
            gridColumn={'span 3'}
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
            gridColumn={'span 3'}
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
            gridColumn={'span 3'}
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
        </Box>

{/* //Row 2 */}
        <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            >
            <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="sp"
            alignItems="center">
                <Box>
                    <Typography varient="h8" fontWeight={"600"} color={colors.grey[100]}>
                        Building Elements
                    </Typography>
                </Box>
            </Box>
            <Box height="250px" ml="-20px" width={"2500"}>
                <Bar isDashboard={true}/>
            </Box>




        </Box>


        {/* <Box
            m="20px"
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ border: '2px solid grey' }}>
                <CsvReader/>
            <Box>

            </Box> */}
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