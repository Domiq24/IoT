import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import OpacityIcon from "@mui/icons-material/Opacity"

function DeviceDetailTile({data, setSelected, manage, setManage}) {

    const hasData = (data.temperature != null);

    return(
        <Card style={{padding: 16, backgroundColor: '#202020', color: '#FFF', minHeight: '16vh', position: 'relative', margin: 'auto'}} >
            <Typography variant="h6" sx={{borderBottom: 4, paddingBottom: '10px'}}>Device No. {data.deviceId}</Typography>
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
            <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex', marginTop: "24px"}}}>
                <Button onClick={() => setSelected([])} sx={{display: 'block'}}>Back</Button>
                {hasData &&<Button onClick={() => setManage(!manage)} sx={{display: 'block'}}>Manage</Button>}
            </Box>
        </Card>
    );
}

export default DeviceDetailTile;