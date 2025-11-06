import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a "provider" component
// This will wrap our app and "provide" the auth state
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Check localStorage on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // This function will be called from our Login/Signup pages
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // This will be called from our Navbar
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Create a custom "hook" to easily use the context
// This lets us just call `useAuth()` in any component
export const useAuth = () => {
    return useContext(AuthContext);
};