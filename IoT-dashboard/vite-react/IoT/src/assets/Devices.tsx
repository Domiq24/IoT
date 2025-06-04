

function DeviceInfo() {
    return(
        <Card>
            <Stack direction="column">
                {hasData &&<Typography>Device No. {data?.deviceNum}</Typography>
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
                </Typography>) ||
                <Typography>No data</Typography>}
            </Stack>
        </Card>
    );
}

export default DeviceInfo;