import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import MyMemes from './pages/MyMemes';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <div className={`App ${darkMode ? 'dark' : ''}`}>
                    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/search" element={<Search />} />
                        <Route
                            path="/my-memes"
                            element={
                                <ProtectedRoute>
                                    <MyMemes />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
