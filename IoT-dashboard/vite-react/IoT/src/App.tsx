import { useState } from 'react'
import Navbar from './assets/Navbar.tsx'
import DeviceTile from './assets/DeviceTile.tsx'
import DeviceDetailTile from './assets/DeviceDetailTile.tsx'
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import { LineChart } from "@mui/x-charts"
import Typography from "@mui/material/Typography"
import './App.css'

function App() {
  const [data, setData] = useState([
        null,
        null,
        null,
        {
          "temperature": 24,
          "pressure": 1013,
          "humidity": 40
        },
        null
  ]);

  return (
    <>
        <Navbar />
        <Container maxWidth='false' sx={{padding: 4, backgroundColor: '#101010', height: '55vh', justifyContent: 'center', alignItems: 'center'}}>
            <Grid container spacing={6} justifyContent='center' height="100%">
                <Grid size={2} alignContent="center">
                    <DeviceDetailTile idx={3} data={data[3]} />
                </Grid>
                <Grid size={7} alignContent="center">
                    <LineChart
                      xAxis={[{ data: [1, 2, 3, 5, 8, 10], color: '#FFF' }]}
                      series={[
                        {
                          data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                      ]}
                      height={300}
                      sx={{
                        ".MuiChartsAxis-tickLabel": {fill: "#FFFFFF !important"},
                        ".MuiChartsAxis-line": {stroke:"#FFFFFF !important", strokeWidth: "4 !important"},
                        ".MuiChartsAxis-tick": {stroke:"#FFFFFF !important", strokeWidth: "2 !important"}
                      }}
                    />
                </Grid>
            </Grid>
        </Container>
        <Grid container spacing={3} justifyContent='center' sx={{borderTop: 8, padding: 4}}>
            {data.map((item, idx) =>
                <Grid size={10/data.length}>
                    <DeviceTile idx={idx} data={item} />
                </Grid>
            )}
        </Grid>

    </>
  )

  /* */
}

export default App
