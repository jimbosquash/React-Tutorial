import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { tokens } from "../../theme";
import StatBox from "../../components/statBox.jsx";
import EmailIcon from "@mui/icons-material/Email";
import Construction from "@mui/icons-material/Construction";
import ListAlt from "@mui/icons-material/ListAlt";
import Timer from "@mui/icons-material/Timer";
import { useEffect } from "react";
import * as FRAGS from "bim-fragment";
import { buildingElement, GetBuildingElements } from "../../utilities/IfcUtilities";
import * as OBC from "openbim-components";
import { Email } from "@mui/icons-material";


function getEPElementCount(elements: buildingElement[])
{
    return elements.filter(element => element.properties.some(property => property.value.includes("EP-"))).length;
}
function getUniqueElementCount(elements: buildingElement[])
{
    const groupedByProductCode: Record<string, buildingElement[]> = {};


    elements.forEach(element => {
        const codeFilter = element.properties.find(prop => prop.name ==="Productcode")
        if(codeFilter)
        {
            const productCode = codeFilter.value;
            if(!groupedByProductCode[productCode]) {
                groupedByProductCode[productCode] = []
            }
            groupedByProductCode[productCode].push(element)

        }
    })
    return Object.keys(groupedByProductCode).length;
}




export default function SummaryRow({data, components}) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [buildingElements,setBuildingElements] = useState<buildingElement[]>([]);
    const [totalCount, setTotalCount] = useState<number>()
    const [uniqueProductCodes, setUnqiueProductCodeCount] = useState<number>()

    const boxStyle = { 
        backgroundColor: colors.primary[400],
        borderRadius: 4,
        display: "flex",
        alignContent: "center",
        justifyContent:"center",
        height: "120px"
    }


    useEffect(() => {
        async function asyncGetElements() {
            var newBuildingElements = await GetBuildingElements(data, components)
            setBuildingElements(newBuildingElements);
        }

        if(components && data)
            asyncGetElements();  

        },[data] )

        useEffect(() =>{
            if(!buildingElements)
                return; 
            console.log('setting summary data')
            setTotalCount(buildingElements.length);
            setUnqiueProductCodeCount(getUniqueElementCount(buildingElements))
        }, [buildingElements])




    return <>
     <Box
            component={'section'}
            gridColumn={'span 3'}
            style={boxStyle}
            >
                <StatBox
                title={totalCount}
                subtitle="Total Elements"
                progress="0.75"
                increase="+14%"
                icon={
                    <Construction
                        sx={{ color:colors.greenAccent[600],fontSize: "26px"}}
                    />
                }
                />

            </Box>

            <Box
            component={'section'}
            gridColumn={'span 3'}
            style={boxStyle}
            >
                <StatBox
                title={uniqueProductCodes}
                subtitle="Different Elements"
                progress="0.12"
                increase="+54%"
                icon={
                    <Timer
                        sx={{ color:colors.greenAccent[600],fontSize: "26px"}}
                    />
                }
                />
            </Box>

            <Box
            component={'section'}
            gridColumn={'span 3'}
            style={boxStyle}
            >
                <StatBox
                title="1,432"
                subtitle="Building Steps"
                progress="0.86"
                increase="-12%"
                icon={
                    <ListAlt
                        sx={{ color:colors.greenAccent[600],fontSize: "26px"}}
                    />
                }
                />
            </Box>
            
    </>
}