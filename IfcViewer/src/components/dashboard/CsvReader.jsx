import { useState } from "react";
import Papa from "papaparse";
import './styles.css';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme.js";
import { DataGrid } from "@mui/x-data-grid";



export default function DataGridComponent() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //todo create button that lets you remap grid by element count


  const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          Papa.parse(file, {
              complete: (results) => {
                  const data = results.data;
                  if (data.length > 0) {
                      // Create columns from the first row headers
                      const cols = data[0].map((header, index) => ({
                          field: header,
                          headerName: header,
                          minWidth: 120,
                          flex: 1
                      }));
                      setColumns(cols);

                      // Create rows from the remaining data
                      const rowsData = data.slice(1).map((row, index) => {
                          let rowData = {};
                          row.forEach((element, idx) => {
                              rowData[data[0][idx]] = element;
                          });
                          return { id: index, ...rowData };
                      });
                      setRows(rowsData);
                  }
              },
              header: false,
          });
      }
  };

  return (
      <Box m='20px'width='100vh'>
          <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
              <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv"
              />
              <DataGrid 
              rows={rows} 
              columns={columns} 
              sx={{ height: '100%' }}
              checkboxSelection
              density={"compact"} />
          </Box>
      </Box>
  );
}