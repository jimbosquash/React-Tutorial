import { useTheme } from "@mui/material";
import React, {useEffect, useState} from "react";
import Draggable from "react-draggable";
import { tokens } from "../theme";
import  "./styles.css";

interface DataGridProps {
    // columns: Column[];
    data: any[];
}

export const DraggablePanel = ({children}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [position,setPosition] = useState({x:20, y:20})
    const snapThreshold = 30;

    useEffect(() => {
        setPosition({x: window.innerWidth - 400, y: window.innerHeight -750})
    }, [])
    



    const handleDrag = (e, ui) => {
        setPosition({x: ui.x, y: ui.y})
    }

    const handleStop = () => {
        const {innerWidth, innerHeight} = window;
        let {x,y} = position;
        console.log(innerWidth,innerHeight)

        if(x < snapThreshold) {
            x=70;
        } else if (x > innerWidth - snapThreshold - 350) // 200 is the panel width
        {
            x = innerWidth - 400;
        }

        if(y <snapThreshold) {
            y= 40;
        } else if( y > innerHeight - snapThreshold - 700) {
            y = innerHeight - 750;
        }

        setPosition({x,y})

    }


    return(<>
    <Draggable
   position={position}
        onDrag={handleDrag}
        onStop={handleStop}
    >
        <div className="draggable-panel"  style={{backgroundColor: colors.primary[400]}}>
            {children}
        </div>

    </Draggable>
    </>
    )
}

export default DraggablePanel;
