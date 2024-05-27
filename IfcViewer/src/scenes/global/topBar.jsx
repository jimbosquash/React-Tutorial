import { Box, Button, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import {useContext, useState, useEffect} from "react"
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import UploadIfcButton from "../../components/uploadIfcButton";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";
import React from "react";

const RoutingButton = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Link>
        <IconButton
        active="true"
        style={{
          color: colors.grey[100],
        }}
        onClick={() => {
            setSelected(title)
            console.log(to)
        }}
        icon={icon}
        to={to}
      >
        {icon}
        {/* <Typography>{title}</Typography> */}
        </IconButton>
    </Link>
    );
  };

export default function Topbar({onComponentsSet,onIfcFileLoad}) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [fileName, setFileName] = useState("");
    const [selected, setSelected] = useState("dashboard");


    const handleIFCLoad = (ifcModel) => {
        onIfcFileLoad(ifcModel)
    }

    useEffect(() => {},[fileName])

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* <Box display="flex" backgroundColor={colors.primary[400]}
            borderRadius="3px">
                <InputBase sx={{ ml : 2, flex: 1}} placeholder="Search"/>
                <IconButton type="button" sx={{ p: 1}}>
                    <SearchIcon/>
                </IconButton>
            </Box> */}
            <Box display="flex">
                <UploadIfcButton setFileName={setFileName} onIfcFileLoad={handleIFCLoad} /> 
            </Box>
            <Typography
            variant="h6"
            fontWeight='bold'
            sx={{color: colors.grey[100]}}>
            {fileName}
          </Typography>
            <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ?(<DarkModeOutlinedIcon/>) : (<LightModeOutlinedIcon/>)}
            </IconButton>
            <RoutingButton 
            title="Dashboard"
            to="/dashboard"
            icon={<MenuOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            />
            <RoutingButton 
            title="Viewer"
            to="/viewerFiber"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            />
            <Box mt="20px">
          
        </Box>
            
            </Box>
            

        </Box>
    )
}
