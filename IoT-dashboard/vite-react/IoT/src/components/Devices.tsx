import {useState} from "react"
import DeviceTile from './DeviceTile.tsx'
import DeviceDetailTile from './DeviceDetailTile.tsx'
import SidePanel from './SidePanel.tsx'
import AllDevicesScatterChart from './AllDevicesScatterChart.tsx'
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

interface Device {
    temperature?: number,
    pressure?: number,
    humidity?: number,
    deviceId: number,
    readingDate?: Date
}

function Devices({data}) {
    const [selected, setSelected] = useState<Device[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [manage, setManage] = useState(false);



    const dataFilter = (item: Device) => {
        const date = new Date(item.readingDate)
        const curr_date = new Date();
        return date != null && date < curr_date && date.getDate() > curr_date.getDate() - 1;
    }
    const allData = data.filter((item) => dataFilter(item));



    return(
    <>
        <Container maxWidth='false' sx={{padding: 4, backgroundColor: '#101010', height: '55vh', justifyContent: 'center'}}>
            {selected.length > 0 ? <Grid container spacing={6} justifyContent='center' height="100%">
                <Grid size={2} alignContent="center">
                    <DeviceDetailTile data={selected[selected.length-1]} setSelected={setSelected} manage={manage} setManage={setManage}/>
                </Grid>
                <Grid size={7} alignContent="center">
                    <SidePanel selected={selected} setSelected={setSelected} manage={manage} setManage={setManage}/>
                </Grid>
            </Grid>
            : <AllDevicesScatterChart devices={data.length}/>}
        </Container>
        <Grid container spacing={3} justifyContent='center' sx={{borderTop: 8, padding: 4}}>
            {data.map(item =>
                <Grid size={1.8}>
                    <DeviceTile id={item.deviceId} setSelected={setSelected} setManage={setManage}/>
                </Grid>
            )}
        </Grid>
    </>
    )
}

export default Devices