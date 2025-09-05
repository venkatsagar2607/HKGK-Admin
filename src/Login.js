import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { RefreshCcw, CheckCircle, XCircle, Search } from 'lucide-react';
import './admin.css';

const App = () => {
    // Login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);

    const nav = useNavigate();

    // Dummy login validation
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError(null);

        // Replace this with real validation or API call
        if (username === 'ntkd' && password === 'Ntkd@#123') {
            setIsLoggedIn(true);
            localStorage.setItem('adminLoggedIn', 'true');
            nav("/Admin")

        } else {
            setLoginError('Invalid username or password');
        }
    };


    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            {loginError && <p className="error-message">{loginError}</p>}
        </div>
    );
};

export default App;
