import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import EtlFlow from "./pages/EtlFlow";


function AppRouter() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/etlflow">Advanced Data Source</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/etlflow" element={<EtlFlow />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}
export default AppRouter