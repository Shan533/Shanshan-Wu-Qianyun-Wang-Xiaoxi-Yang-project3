import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Form, Input, Button, Typography } from 'antd';
import Navbar from "../../components/Navbar";

const { Title, Paragraph } = Typography;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/login', { username, password });
            navigate('/main');
        } catch (error) {
            if (error.response) {
                setError(error.response.data);
            } else {
                setError('Invalid username or password');
            }   
        } 
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="bg-gray-100 flex-grow">
                <div className="container mx-auto px-4">
                    <div className="text-center mt-12">
                        <Title level={1} className="uppercase font-bold">Login</Title>
                        {error && <Paragraph type="danger">{error}</Paragraph>}
                        <Form onSubmitCapture={handleLogin} className="mt-8 w-full max-w-lg mx-auto">
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
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Login
                                </Button>
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

export default Login;
