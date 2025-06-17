import {useState} from 'react'
import axios from 'axios'
import DeleteAllDialog from './DeleteAllDialog.tsx'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

interface Device {
    temperature: number,
    pressure: number,
    humidity: number,
    deviceId: number,
    readingDate: Date
}

interface Limit {
    readings: number,
    temperature: bool,
    pressure: bool,
    humidity: bool
}

function DeviceManage({data, setData, setLimit, setManage}) {
    const [show, setShow] = useState("");
    const [newLimit, setNewLimit] = useState<Limit>({readings: null, temperature: true, pressure: true, humidity: true});
    const [deleteFrom, setDeleteFrom] = useState<Dayjs | null>(null);
    const [deleteTo, setDeleteTo] = useState<Dayjs | null>(null);
    const [openDeleteDialog, setDeleteDialog] = useState(false);

    const handleReadChange = (value) => setNewLimit({readings: value != 0 ? value : null, temperature: newLimit.temperature, pressure: newLimit.pressure, humidity: newLimit.humidity})
    const handleTempChange = (value) => setNewLimit({readings: newLimit.readings, temperature: value, pressure: newLimit.pressure, humidity: newLimit.humidity})
    const handlePrsChange = (value) => setNewLimit({readings: newLimit.readings, temperature: newLimit.temperature, pressure: value, humidity: newLimit.humidity})
    const handleHumChange = (value) => setNewLimit({readings: newLimit.readings, temperature: newLimit.temperature, pressure: newLimit.pressure, humidity: value})
    const handleLimit = () => {
        console.log(newLimit)
    }

    const handleDelete = () => {
        const from = deleteFrom != null ? deleteFrom.toISOString() : data[0].readingDate.toISOString();
        const to = deleteTo != null ? deleteTo.toISOString() : data[data.length-1].readingDate.toISOString();
        const url = `http://localhost:3100/api/data/${data[0].deviceId}/${from}/${to}`;
        axios
        .delete(url,
            {
                headers: {
                    'x-access-token': "Bearer "+localStorage.getItem('token')
                }
            }
        )
        .then(
            setData(
                data.filter((el) => el.readingDate < deleteFrom || el.readingDate > deleteTo)
            )
        )
        .catch((error) => console.log(error));
    }

    return(
        <>
        <Card style={{padding: 16, backgroundColor: "#202020", color: '#FFF', minHeight: '24vh', position: 'relative'}}>
            <Typography variant="h6" sx={{ borderBottom: "4px solid #FFF", paddingBottom: "10px" }}>Manage device</Typography>
            <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                <Button onClick={() => setManage(false)} sx={{my: 2, color: 'white', display: 'block'}}>Back</Button>
                <Button onClick={() => setShow("limit")} sx={{my: 2, color: 'white', display: 'block'}}>Limit readings</Button>
                <Button onClick={() => setShow("delete")} sx={{my: 2, color: 'white', display: 'block'}}>Delete readings</Button>
            </Box>
            {show === "limit" && <Box>
                <FormGroup>
                    <FormControlLabel control={<input type="number" min={1} style={{padding: 8, margin: 12, fontSize: 16, width: 36}} onChange={(e) => handleReadChange(e.target.value)}/>} label="Last readings shown" />
                    <FormControlLabel control={<Checkbox checked={newLimit.temperature} onChange={(e) => handleTempChange(e.target.checked)} />} label="Temperature" />
                    <FormControlLabel control={<Checkbox checked={newLimit.pressure} onChange={(e) => handlePrsChange(e.target.checked)} />} label="Pressure" />
                    <FormControlLabel control={<Checkbox checked={newLimit.humidity} onChange={(e) => handleHumChange(e.target.checked)} />} label="Humidity" />
                </FormGroup>
                <Button onClick={() => setLimit(newLimit)}>Limit</Button>
            </Box>}
            {show === "delete" && <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                    <DateTimePicker
                        label="From"
                        value={deleteFrom}
                        onChange={(value) => setDeleteFrom(value)}
                        sx={{
                            '.MuiPickersInputBase-root': {color: 'white'},
                            '.MuiInputLabel-root': {color: 'white'},
                            '.MuiButtonBase-root': {color: 'white'}
                        }}
                        minDateTime={dayjs(data[0].readingDate)}
                        maxDateTime={deleteTo != null ? deleteTo : dayjs(data[data.length-1].readingDate)}
                        format="DD/MM/YYYY hh:mm a"
                    />
                    <DateTimePicker
                        label="To"
                        value={deleteTo}
                        onChange={(value) => setDeleteTo(value)}
                        sx={{
                            '.MuiPickersInputBase-root': {color: 'white'},
                            '.MuiInputLabel-root': {color: 'white'},
                            '.MuiButtonBase-root': {color: 'white'}
                        }}
                        minDateTime={deleteFrom != null ? deleteFrom : dayjs(data[0].readingDate)}
                        maxDateTime={dayjs(data[data.length-1].readingDate)}
                        format="DD/MM/YYYY hh:mm a"
                    />
                </Box>
                </LocalizationProvider>
                <Box sx={{position: 'absolute', bottom: 10}}>
                    {deleteFrom != null || deleteTo != null ? <Button onClick={handleDelete} margin={4}>Delete</Button>
                    : <Button disabled>Delete</Button>}
                    <Button margin={4} sx={{color: '#A02020'}} onClick={() => setDeleteDialog(true)}>Delete All</Button>
                </Box>
            </Box>}
        </Card>
        <DeleteAllDialog open={openDeleteDialog} setOpen={setDeleteDialog} data={data} setData={setData}/>
        </>
    )
}

export default DeviceManage