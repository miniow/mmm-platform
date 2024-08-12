import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.scss'
import logo from '../assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>
            <div>
                <FontAwesomeIcon icon={faDatabase} />
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                {auth?.isAuthenticated ? (
                    <>
                        <li><Link to="/workspace">Workspace</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/dataflow">Dataflow</Link></li>
                        <li><Link to="/models">Models</Link></li>
                        <li><button onClick={auth.logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;