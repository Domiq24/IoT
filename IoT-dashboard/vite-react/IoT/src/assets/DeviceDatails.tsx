import Container from "@mui/material/Container"
import { Card } from "@mui/material/Card"
import { Typography } from "@mui/material/Typography"

function DeviceInfo() {
    return(
        <Container>
            <Card>
                {hasData &&<Typography>Device No. {data?.deviceId}</Typography>
                <Typography style={{paddingTop: '10px'}} component="div">
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
                </Typography>}
            </Card>
        </Container>
    );
}

export default DeviceInfo;