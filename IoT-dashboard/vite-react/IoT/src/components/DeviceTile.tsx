import { useState, useEffect } from "react"
import axios from "axios"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import OpacityIcon from "@mui/icons-material/Opacity"

interface Device {
    temperature?: number,
    pressure?: number,
    humidity?: number,
    deviceId: number,
    readingDate?: Date
}

function DeviceTile({id, setSelected, setManage}) {
    const [data, setData] = useState<Device[]>([]);
    const [color, setColor] = useState("#202020");

    const getDevice = async() => {
        const url = "http://localhost:3100/api/data/"+id+"/2";
        axios
        .get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then((res) => {
            setData(res.data.map((el) => {return {
                temperature: el.temperature,
                pressure: el.pressure,
                humidity: el.humidity,
                deviceId: el.deviceId,
                readingDate: Date.parse(el.readingDate)
            }}));
        })
        .catch((error) => {console.log(error);});
    }

    const handleDetails = () => {
        const url = "http://localhost:3100/api/data/"+id;
        axios
        .get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then((res) => {
            if(res.data.length < 1)
                setSelected([{deviceId: id}]);
            else
                setSelected(res.data.map((el) => {return {
                    temperature: el.temperature,
                    pressure: el.pressure,
                    humidity: el.humidity,
                    deviceId: el.deviceId,
                    readingDate: new Date(el.readingDate)
                }}));
        })
        .catch((error) => {console.log(error);});
        setManage(false);
    }

    const checkAlert = () => {
        if(data.length < 2)
            return;

        const idx = data.length-1;
        const temp = Math.abs(data[idx-1].temperature - data[idx].temperature);
        const prs = Math.abs(data[idx-1].pressure - data[idx].pressure);
        const hum = Math.abs(data[idx-1].humidity - data[idx].humidity);
        if(temp > 5 || prs > 10 || hum > 5)
            setColor("#902020");
    }

    useEffect(() => {getDevice();}, [])
    useEffect(() => {checkAlert();}, [data])

    return(
        <Card style={{padding: 16, backgroundColor: color, color: '#FFF', minHeight: '24vh', position: 'relative'}}>
            <Typography variant="h6" sx={{borderBottom: 4, paddingBottom: '10px'}}>Device No. {id}</Typography>
            {data.length > 0 ? <Typography style={{paddingTop: '10px'}} component="div">
               <Typography variant="h6" component="div">
                   <DeviceThermostatIcon></DeviceThermostatIcon>
                   <span className="value">{data[0]?.temperature}</span> <span>&deg;C</span>
               </Typography>
               <Typography variant="h6" component="div">
                   <CloudUploadIcon></CloudUploadIcon>
                   <span className="value">{data[0]?.pressure}</span> hPa
               </Typography>
               <Typography variant="h6" component="div">
                   <OpacityIcon></OpacityIcon>
                   <span className="value">{data[0]?.humidity}</span>%
               </Typography>
            </Typography> :
            <Typography variant="h6" style={{paddingTop: '10px'}} component="div">No data</Typography>}
            <Button
                onClick={ () => handleDetails() }
                style={{position: 'absolute', bottom: '16px'}}
                >Details</Button>
        </Card>
    );
}

export default DeviceTile;