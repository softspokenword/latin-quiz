'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper, 
    Tabs,
    Tab,
    Alert
} from '@mui/material';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index} className="pt-4">
            {value === index && children}
        </div>
    );
}

export default function Login() {
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate login process (replace with actual authentication)
        setTimeout(() => {
            if (loginData.username && loginData.password) {
                // Simulate successful login
                localStorage.setItem('user', JSON.stringify({ 
                    username: loginData.username,
                    isLoggedIn: true 
                }));
                router.push('/');
            } else {
                setError('Please fill in all fields');
            }
            setLoading(false);
        }, 1000);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (signupData.password !== signupData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Simulate signup process (replace with actual registration)
        setTimeout(() => {
            if (signupData.username && signupData.password) {
                // Simulate successful signup
                localStorage.setItem('user', JSON.stringify({ 
                    username: signupData.username,
                    email: signupData.email,
                    isLoggedIn: true 
                }));
                router.push('/');
            } else {
                setError('Please fill in all fields');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <Box className="min-h-screen flex items-center justify-center p-4">
            <Paper elevation={3} className="p-8 max-w-md w-full bg-white">
                <Typography variant="h4" component="h1" gutterBottom className="text-center text-blue-900 mb-6">
                    Latin Quiz
                </Typography>

                <Tabs value={tab} onChange={handleTabChange} centered className="mb-6">
                    <Tab label="Login" />
                    <Tab label="Sign Up" />
                </Tabs>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <TabPanel value={tab} index={0}>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className="mt-6 py-3 bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={signupData.username}
                            onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className="mt-6 py-3 bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                </TabPanel>

                <div className="mt-6 text-center">
                    <Button
                        variant="text"
                        onClick={() => router.push('/')}
                        className="text-blue-600"
                    >
                        Continue as Guest
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}
