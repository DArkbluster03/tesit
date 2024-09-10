import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../../redux/features/auth/authApi';
import { setUser } from '../../redux/features/auth/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = { email, password };

        try {
            const response = await loginUser(data).unwrap();
            const { token, user } = response;
            dispatch(setUser({ user }));
            alert("Login successful");
            navigate('/');
        } catch (error) {
            setMessage("Please provide a valid email and password");
        }
    };

    return (
        <div className='min-h-screen flex flex-col md:flex-row items-center pt-10 md:pt-20'>
            <div className='flex-1 p-6 max-w-4xl mx-auto flex flex-col md:items-start items-center gap-6'>
                <Link to='/' className='font-bold dark:text-white text-5xl'>
                    <span className='px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                        Mern's
                    </span>
                    Blog
                </Link>
                <p className='text-lg mt-4'>
                    This is a demo project. You can sign up with your email and password or with Google.
                </p>
            </div>
            <div className='flex-1 max-w-md bg-white p-10 mx-auto'>
                <h2 className='text-4xl font-semibold pt-5'>Please Login</h2>
                <form onSubmit={handleLogin} className='space-y-6 pt-8'>
                    <input 
                        type="email" 
                        value={email}
                        placeholder='Email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full bg-gray-100 focus:outline-none px-6 py-4 rounded text-lg'
                    />
                    <input 
                        type="password" 
                        value={password}
                        placeholder='Password'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full bg-gray-100 focus:outline-none px-6 py-4 rounded text-lg'
                    />
                    {message && <p className='text-red-500 text-lg'>{message}</p>}
                    <button
                        disabled={loginLoading}
                        className='w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md py-3 text-lg'
                    >
                        {loginLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className='my-6 text-center text-lg'>
                    Don't have an account?
                    <Link to="/register" className='text-red-700 italic'> Register</Link>
                    here.
                </p>
            </div>
        </div>
    );
};

export default Login;
