import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom'
import Navbar from "../../components/Navbar";
import { Button, Form, Input, Typography } from 'antd';
const { Title, Paragraph } = Typography;

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/users/register', { username, password });
            navigate('/main');
        } catch (error) {
            if (error.response) {
                setError(error.response.data);
            } else {
                setError('Registration failed. Please try again.');
            }   
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="bg-gray-100 flex-grow">
                <div className="container mx-auto px-4">
                    <div className="text-center mt-12">
                        <Title level={1} className="uppercase font-bold">Register</Title>
                        <Paragraph>If you do not have an account, you can create one below.</Paragraph>
                        {error && <Paragraph type="danger">{error}</Paragraph>}
                        <Form className="mt-8 w-full max-w-lg mx-auto" onSubmitCapture={handleRegister}>
                            <Form.Item label="Username" className="text-center">
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                />
                            </Form.Item>
                            <Form.Item label="Password" className="text-center">
                                <Input.Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </Form.Item>
                            <Form.Item label="Confirm Password" className="text-center">
                                <Input.Password
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Register
                                </Button>
                                <Link to="/login">Already have an account? Login here.</Link>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <footer className="bg-gray-200 pt-6 pb-2">
                <div className="container mx-auto px-4 text-center">
                    <Paragraph className="text-gray-600">
                        &copy; {new Date().getFullYear()} Password Manager. All rights reserved.
                    </Paragraph>
                </div>
            </footer>
        </div>
    );
}

export default Register;

/**
 * For existing users, you should provide a way for users to log in.  
 * If the password does not match the username, the password is empty,
 *  the username is empty or the username does not exist,
 *  then you should provide an error message letting the user know what has happened.

 * Once a user has logged in, either by creating an account or logging in to an existing account, 
 * they should be redirected to their password manager page.

 * We will be using cookies to track user sessions and delete those cookies when a user logs out. 
 * This will all happen in the backend.

 */
