'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';

export function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return ( // flex items-center justify-between w-full py-6
             // w-full py-8 flex flex-col items-center justify-center
        <header
            className="flex items-center justify-center w-full py-6"
            style={{
                width: '100vw',
                background: 'linear-gradient(180deg, #232526 0%, #414345 100%)',
                color: 'white',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
            }}
        >
            <Link href="/" className="text-3xl font-bold text-white mb-4 pr-80">
                Latin Quiz
            </Link>
            <nav className="flex flex-col items-center space-y-2">
                {user ? (
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-white">Welcome, {user.username}!</span>
                        <Button 
                            variant="outlined" 
                            onClick={handleLogout}
                            className="text-white border-white hover:bg-white hover:text-blue-900"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/login" className="text-white hover:text-blue-200">
                        <Button 
                            variant="outlined"
                            className="text-white border-white hover:bg-white hover:text-blue-900"
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
}
