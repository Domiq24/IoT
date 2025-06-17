import * as React from 'react';
import { isExpired } from 'react-jwt';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';

function Navbar() {
   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

   const navigate = useNavigate();

   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
       setAnchorElNav(event.currentTarget);
   };

   const handleCloseNavMenu = () => {
       setAnchorElNav(null);
   };

   const handleDevices = () => { navigate('/devices'); };
   const handleSignUp = () => { navigate('/sign-up'); };
   const handleLogIn = () => { navigate('/login'); };
   const handleLogOut = () => {
       const token = localStorage.getItem("token");
       const user = jwtDecode(token);
       const url = "http://localhost:3100/api/user/logout/"+user.userId;

       axios
        .delete(url,
        {
            headers: {
               'x-access-token': "Bearer "+token
            }
        })
        .then(
            localStorage.setItem('token', null),
            navigate(0)
        );
   };

   return (
       <AppBar position="static">
           <Container maxWidth={false} sx={{backgroundColor: 'black'}}>
               <Toolbar disableGutters>

                   <Typography
                       variant="h6"
                       noWrap
                       sx={{
                           mr: 2,
                           display: {xs: 'none', md: 'flex'},
                           alignItems: 'center',
                           fontFamily: 'monospace',
                           fontWeight: 700,
                           letterSpacing: '.3rem',
                           color: 'inherit',
                           textDecoration: 'none',
                       }}
                   >
                       <LanguageIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                       IoT Dashboard
                   </Typography>

                   {!isExpired(localStorage.getItem('token')) &&
                   <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                       <Button
                           key="Devices state"
                           onClick={handleDevices}
                           sx={{my: 2, color: 'white', display: 'block'}}
                       >
                           Devices state
                       </Button>
                       <Button
                           key="Log out"
                           onClick={handleLogOut}
                           sx={{my: 2, color: 'white', display: 'block'}}
                       >
                           Log out
                       </Button>
                   </Box>}
                   {isExpired(localStorage.getItem('token')) &&
                   <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                       <Button
                           key="Log in"
                           onClick={handleLogIn}
                           sx={{my: 2, color: 'white', display: 'block'}}
                       >
                           Log in
                       </Button>
                       <Button
                           key="Sign up"
                           onClick={handleSignUp}
                           sx={{my: 2, color: 'white', display: 'block'}}
                       >
                           Sign up
                       </Button>
                   </Box>}

                   <div className="logo"></div>

               </Toolbar>
           </Container>
       </AppBar>
   );
}

export default Navbar;