import { useState } from "react"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import OpacityIcon from "@mui/icons-material/Opacity"

function DeviceTile({idx, data}) {

    const hasData = (data != null);

    return(
        <Card style={{padding: 16, backgroundColor: '#202020', color: '#FFF', minHeight: '24vh', position: 'relative'}}>
            <Typography variant="h6" sx={{borderBottom: 4, paddingBottom: '10px'}}>Device No. {idx}</Typography>
            {hasData ? <Typography style={{paddingTop: '10px'}} component="div">
               <Typography variant="h6" component="div">
                   <DeviceThermostatIcon></DeviceThermostatIcon>
                   <span className="value">{data?.temperature}</span> <span>&deg;C</span>
               </Typography>
               <Typography variant="h6" component="div">
                   <CloudUploadIcon></CloudUploadIcon>
                   <span className="value">{data?.pressure}</span> hPa
               </Typography>
               <Typography variant="h6" component="div">
                   <OpacityIcon></OpacityIcon>
                   <span className="value">{data?.humidity}</span>%
               </Typography>
            </Typography> :
            <Typography variant="h6" style={{paddingTop: '10px'}} component="div">No data</Typography>}
            <Button style={{position: 'absolute', bottom: '16px'}}>DETAILS</Button>
        </Card>
    );
}

export default DeviceTile;