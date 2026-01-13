import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // If using router later

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        try {
            // dynamic import to avoid circular dependency if api depends on something else, 
            // but here it's fine. 
            // Better to pass api client or just fetch
            // usage: api.post... 
            // Since api.ts is simple, we can import it.
            const response = await fetch('http://localhost:3000/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("admin_token", data.access_token);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("admin_token");
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center text-white bg-slate-900">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
