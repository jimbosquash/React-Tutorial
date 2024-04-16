import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./theme.js";
import AdminPanelSettingsOutlineIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlineIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlineIcon from "@mui/icons-material/SecurityOutlined";
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  var mockDataTeam

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
      cellClassName: "age-column--cell",
    },
    { field: "cost", headerName: "Cost", flex: 1,
  renderCell: (params) => ( <Typography color={colors.greenAccent[500]}>
    ${params.row.cost}
  </Typography>)},

    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="600"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlineIcon />}
            {access === "manager" && <SecurityOutlineIcon />}
            {access === "user" && <LockOpenOutlineIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];
  return (
    <Box m='20px'>
      {/* <Header title="TEAM" subtitle="Manage your teams data" /> */}
      <Box m='40px 0 0 0' height="75vh"
      sx={{
        "& .MuiDataGrid-cell": {
            borerBottom: "none"
        },
        "& .name-column--cell": {
            color: colors.greenAccent[300]
        },
        
      }}>
        {/* <DataGrid rows={mockDataTeam} columns={columns} /> */}
      </Box>
    </Box>
  );
};

export default Team;
