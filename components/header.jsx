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

    return (
        <header className="flex items-center justify-between w-full py-6">
            <Link href="/" className="text-2xl font-bold text-white">
                Latin Quiz
            </Link>
            <nav className="flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center space-x-4">
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
