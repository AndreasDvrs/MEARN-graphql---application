import './App.css';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import { useState } from 'react';

function App() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = (token, userId, tokenExpiration) => {
        setToken(token);
        setUserId(userId);
    }

    const logout = (token, userId, tokenExpiration) => {
        setToken(null);
        setUserId(null);
    }
    
  return (
    <BrowserRouter>
        <>
            <AuthContext.Provider value={{token, userId, login, logout}}>                
                <MainNavigation/>
                <main className="main-content">
                    <Routes>
                        {!token &&
                            <>
                                <Route path = "/auth" element={<AuthPage />} />
                                <Route path="/*" element={<Navigate to = "/auth"/>} />
                            </>
                        }
                        {token &&
                            <>
                                <Route path = "/events" element={<EventsPage/>} />
                                <Route path = "/auth" element={<Navigate to = "/events"/>} />
                                <Route path="/" element={<Navigate to = "/events"/>} />
                                <Route path = "/bookings" element={<BookingsPage/>} />                                
                            </>
                        }
                    </Routes>
                </main>
            </AuthContext.Provider>
        </>
    </BrowserRouter>
    
  );
}

export default App;
