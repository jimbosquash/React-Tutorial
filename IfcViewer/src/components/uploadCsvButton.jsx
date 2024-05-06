import React, { useState } from 'react';
import {Button, useTheme} from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Papa from "papaparse";
import {tokens} from "../theme"


function UploadCsvButton({ onFileLoad }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [elements, setElements] = useState(null);

    const handleFileChange = (event) => {
        console.log(event.target.files)
        const file = event.target.files[0];
        if (file) {
          Papa.parse(file, {
              header: true,
              complete: function(results) {
                //console.log(results)

                  setElements(results.data)
                  onFileLoad(results.data)
              }
          });
        }
    };


    const handleClick = () => {
        console.log("click")
        document.getElementById('csvFileInput').click();
    };

    return (
        <div>
            <input
                type="file"
                id="csvFileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".csv"
            />
            <Button
                    onClick={handleClick}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    }}>
                    <UploadOutlinedIcon sx={{ mr: "10px" }} />
                    Upload Module .Csv
                </Button>
        </div>
    );
}

export default UploadCsvButton;
