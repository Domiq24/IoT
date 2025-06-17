import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DeleteAllDialog({open, setOpen, data, setData}) {

    const navigate = useNavigate();

    const handleConfirm = () => {
        const url = "http://localhost:3100/api/data/"+data[0].deviceId;
        axios
        .delete(url,{
            headers: {
                'x-access-token': "Bearer "+localStorage.getItem('token')
            }
        })
        .then(
            setData([]),
            navigate(0)
        )
        .catch((error) => console.log(error));
    }

    return(
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
        >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>Delete all readings from device no. {data[0].deviceId}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={handleConfirm}>Delete</Button>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteAllDialog