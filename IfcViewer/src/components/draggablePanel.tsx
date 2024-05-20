import React, {useState} from "react";
import Draggable from "react-draggable";
import  "./styles.css";

interface DataGridProps {
    // columns: Column[];
    data: any[];
}

export const DraggablePanel = ({children}) => {
    const [position,setPosition] = useState({x:20, y:20})
    const snapThreshold = 30;

    const handleDrag = (e, ui) => {
        setPosition({x: ui.x, y: ui.y})
    }

    const handleStop = () => {
        const {innerWidth, innerHeight} = window;
        let {x,y} = position;
        console.log(innerWidth,innerHeight)

        if(x < snapThreshold) {
            x=70;
        } else if (x > innerWidth - snapThreshold - 200) // 200 is the panel width
        {
            x = innerWidth - 230;
        }

        if(y <snapThreshold) {
            y= 0;
        } else if( y > innerHeight - snapThreshold - 100) {
            y = innerHeight - 150;
        }

        setPosition({x,y})

    }


    return(<>
    <Draggable
        position={position}
        onDrag={handleDrag}
        onStop={handleStop}
    >
        <div className="draggable-panel">
            {children}
        </div>

    </Draggable>
    </>
    )
}

export default DraggablePanel;
