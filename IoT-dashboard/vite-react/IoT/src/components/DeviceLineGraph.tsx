import {useState, useEffect} from 'react'
import {LineChart} from '@mui/x-charts'

interface Series {
    label: string,
    dataKey: string
}

interface Device {
    temperature?: number,
    pressure?: number,
    humidity?: number,
    deviceId: number,
    readingDate?: Date
}

function DeviceLineGraph({data, limit}) {

    const [series, setSeries] = useState<Series[]>([
        {
            label: "Temperature",
            dataKey: "temperature"
        },
        {
            label: "Pressure",
            dataKey: "pressure"
        },
        {
            label: "Humidity",
            dataKey: "humidity"
        }
    ])

    const dateFormatter = (date) => {
        return `${date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0"+date.getMinutes()} ${date.getDate() >= 10 ? date.getDate() : "0"+date.getDate()}-${date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0"+(date.getMonth()+1)}-${date.getFullYear()}`
    }

    const changeSeries = () => {

        const newSeries: Series[] = [];
        if(limit.temperature)
            newSeries.push({
                label: "Temperature",
                dataKey: "temperature"
            });
        if(limit.pressure)
            newSeries.push({
                label: "Pressure",
                dataKey: "pressure"
            });
        if(limit.humidity)
            newSeries.push({
                label: "Humidity",
                dataKey: "humidity"
            });
        setSeries(newSeries);
    }

    useEffect(() => changeSeries, [limit])

    return(
        <LineChart
            dataset={limit.readings != null && data.length > limit.readings ? data.slice(data.length-limit.readings) : data}
            xAxis={[{
                dataKey: "readingDate",
                scaleType: "time",
                valueFormatter: (readingDate) => dateFormatter(readingDate),
            }]}
            series={series}
            height={300}
            sx={{
                ".MuiChartsAxis-tickLabel": {fill: "#FFFFFF !important"},
                ".MuiChartsAxis-line": {stroke:"#FFFFFF !important", strokeWidth: "4 !important"},
                ".MuiChartsAxis-tick": {stroke:"#FFFFFF !important", strokeWidth: "2 !important"},
                ".MuiChartsLegend-root": {color: "#FFFFFF !important"},
                ".MuiChartsSurface-root": {color: "#FFFFFF !important"}
            }}
        />
    )
}

export default DeviceLineGraph