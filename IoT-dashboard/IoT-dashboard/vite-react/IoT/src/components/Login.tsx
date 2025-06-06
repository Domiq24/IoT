import React, { Component, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Container, Typography, Alert } from '@mui/material';

interface Account {
    username: string;
    password: string;
}

interface Errors {
    username?: string;
    password?: string;
}

interface State {
    account: Account;
    errors: Errors;
}

class LoginForm extends Component<{}, State> {
    state: State = {
        account: {
            username: "",
            password: ""
        },
        errors: {}
    };

    validate = (): Errors | null => {
        const errors: Errors = {};

        const { account } = this.state;
        if (account.username.trim() === '') {
            errors.username = 'Username is required!';
        }
        if (account.password.trim() === '') {
            errors.password = 'Password is required!';
        }

        return Object.keys(errors).length === 0 ? null : errors;
    };

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        console.log("submit - np. zapytanie do serwera");
    };

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const account = { ...this.state.account };
        account[event.currentTarget.name] = event.currentTarget.value;
        this.setState({ account });
    };

    render() {
        return (
            <Container maxWidth="sm">
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <TextField
                            label="Username"
                            value={this.state.account.username}
                            name="username"
                            onChange={this.handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        {this.state.errors.username && (
                            <Alert severity="error">
                                {this.state.errors.username}
                            </Alert>
                        )}
                    </div>
                    <div className="form-group">
                        <TextField
                            label="Password"
                            value={this.state.account.password}
                            name="password"
                            onChange={this.handleChange}
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        {this.state.errors.password && (
                            <Alert severity="error">
                                {this.state.errors.password}
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
}

export default LoginForm;