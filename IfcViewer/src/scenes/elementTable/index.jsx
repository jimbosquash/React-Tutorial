import { Box } from "@mui/system";
import Header from "../../components/Header";
import ElementGrid from "../../components/ElementGrid";

const ElementTable = () => {
    return (
        <Box m="20px">
            <Header title="Element Overview" subtitle="Building Element Meta Data" />
            <Box height="75vh">
                <ElementGrid/>
                </Box>
        </Box>
    )
}

export default ElementTable;