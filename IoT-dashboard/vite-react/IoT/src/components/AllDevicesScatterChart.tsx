import {useState, useEffect} from 'react'
import axios from 'axios'
import {ScatterChart, ChartDataProvider} from '@mui/x-charts'

interface Device {
    temperature?: number,
    pressure?: number,
    humidity?: number,
    deviceId: string,
    readingDate?: Date
}

function AllDevicesScatterChart() {
    const [data, setData] = useState<Device[]>([])
    const date = new Date()

    const getData = () => {
        const url = "http://localhost:3100/api/data/all";
        axios
        .get(url,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then((res) => {
            setData(res.data.map((el) => {
                return {
                    temperature: el.temperature,
                    pressure: el.pressure,
                    humidity: el.humidity,
                    deviceId: `${el.deviceId}_${el.readingDate}`,
                    readingDate: new Date(el.readingDate)
                }
            }))
        })
        .catch((error) => console.log(error));
    }

    const dateFormatter = (date) => {
        return `${date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0"+date.getMinutes()} ${date.getDate() >= 10 ? date.getDate() : "0"+date.getDate()}-${date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0"+(date.getMonth()+1)}-${date.getFullYear()}`
    }

    const formatTemp = ({id, x, y}) => {
        const deviceId = id.charAt(0) + (id.charAt(1) != "_" ? id.charAt(1) : "")
        return `Device ${deviceId}: ${y}°C (${dateFormatter(x)})`
    }
    const formatPrs = ({id, x, y}) => {
        const deviceId = id.charAt(0) + (id.charAt(1) != "_" ? id.charAt(1) : "")
        return `Device ${deviceId}: ${y}hPa (${dateFormatter(x)})`
    }
    const formatHum = ({id, x, y}) => {
        const deviceId = id.charAt(0) + (id.charAt(1) != "_" ? id.charAt(1) : "")
        return `Device ${deviceId}: ${y}% (${dateFormatter(x)})`
    }

    useEffect(() => getData(), [])

    return(
    <>
        {data.length > 0 && <ScatterChart
            dataset={ data.filter((el) => el.readingDate.getMonth() == date.getMonth() && el.readingDate.getDate() > date.getDate()-1) }
            xAxis={[{
                scaleType: "time",
                valueFormatter: dateFormatter,
            }]}
            series={[
                {
                    datasetKeys: {id: 'deviceId', x: "readingDate", y: "temperature"},
                    label: "Temperature",
                    valueFormatter: formatTemp
                },
                {
                     label: "Pressure",
                     datasetKeys: {id: 'deviceId', x: "readingDate", y: "pressure"},
                     valueFormatter: formatPrs
                },
                {
                     label: "Humidity",
                     datasetKeys: {id: 'deviceId', x: "readingDate", y: "humidity"},
                     valueFormatter: formatHum
                }
            ]}
            width={1400}
            sx={{
                ".MuiChartsAxis-tickLabel": {fill: "#FFFFFF !important"},
                ".MuiChartsAxis-line": {stroke:"#FFFFFF !important", strokeWidth: "4 !important"},
                ".MuiChartsAxis-tick": {stroke:"#FFFFFF !important", strokeWidth: "2 !important"},
                ".MuiChartsLegend-root": {color: "#FFFFFF !important"},
                ".MuiChartsSurface-root": {color: "#FFFFFF !important"},
                height: "100%"
            }}
        />}
    </>
    )
}

export default AllDevicesScatterChart