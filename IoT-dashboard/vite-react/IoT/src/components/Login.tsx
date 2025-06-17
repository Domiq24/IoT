import React, { Component, ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { isExpired } from "react-jwt";

interface Account {
   username: string;
   password: string;
}

interface Errors {
   username?: string;
   password?: string;
}

const LoginForm: React.FC = () => {

   const [account, setAccount] = useState<Account>({
       username: '',
       email: '',
       password: ''
   });
   const [errors, setErrors] = useState<Errors>({});

   const navigate = useNavigate();

   const handleChangeRoute = (token: string) => {
       localStorage.setItem("token", token);
       console.log(localStorage.getItem("token"));
       console.log(isExpired(localStorage.getItem("token")));
       navigate(0);
   };

   const validate = (): Errors | null => {
       const validationErrors: Errors = {};

       if (account.username.trim() === '') {
           validationErrors.username = 'Username is required!';
       }
       if (account.password.trim() === '') {
           validationErrors.password = 'Password is required!';
       }

       return Object.keys(validationErrors).length === 0 ? null : validationErrors;
   };

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault();

       const validationErrors = validate();
       setErrors( validationErrors || {} );
       if (validationErrors) return;

       axios
           .post('http://localhost:3100/api/user/auth', {
               login: account.username,
               password: account.password
           })
           .then((response) => {
               handleChangeRoute(response.data.token);
           })
           .catch((error) => {
               const errorMessages: Errors = {};
               errorMessages.password =
                   "Given username doesn't exist or the password is wrong!";
               setErrors(errorMessages || {});
               console.log(error);
           });
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
       const { name, value } = event.target;
       setAccount((prevAccount) => ({
           ...prevAccount,
           [name]: value
       }));
   };

       return (
           <Container maxWidth="sm" sx={{backgroundColor: "#FFF", padding: 4, borderRadius: 8, marginTop: 4}}>
               <Typography variant="h4" component="h1" color="#000">
                   Login
               </Typography>
               <form onSubmit={handleSubmit}>
                   <div className="form-group">
                       <TextField
                           label="Username"
                           value={account.username}
                           name="username"
                           onChange={handleChange}
                           fullWidth
                           margin="normal"
                           variant="outlined"
                       />
                       {errors.username && (
                           <Alert severity="error">
                               {errors.username}
                           </Alert>
                       )}
                   </div>
                   <div className="form-group">
                       <TextField
                           label="Password"
                           value={account.password}
                           name="password"
                           onChange={handleChange}
                           type="password"
                           fullWidth
                           margin="normal"
                           variant="outlined"
                       />
                       {errors.password && (
                           <Alert severity="error">
                               {errors.password}
                           </Alert>
                       )}
                   </div>
                   <Button type="submit" variant="contained" color="primary" fullWidth>
                       Login
                   </Button>
               </form>
           </Container>
       );
}

export default LoginForm;