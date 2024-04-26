import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import Navbar from "../../components/Navbar";
import { setAuthToken } from "../../../../server/utils/auth";

const { Title, Paragraph } = Typography;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        values
      );
      const { token } = response.data;
      setAuthToken(token);
      navigate("/main");
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Invalid username or password");
      }
    }
  };

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(
            "http://localhost:5000/api/users/loggedIn"
          );
          setUsername(response.data.username);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLoggedInUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-100 flex-grow">
        <div className="container mx-auto px-4">
          <div className="text-center mt-12">
            <Title level={1} className="uppercase font-bold">
              Login
            </Title>
            {error && <Paragraph type="danger">{error}</Paragraph>}
            <div className="mt-8">
              <Form
                onFinish={handleLogin}
                layout="vertical"
                className="mx-auto w-full max-w-md"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your username",
                    },
                  ]}
                >
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                >
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
              <Paragraph className="mt-8">
                Do not have an account?{" "}
                <Link to="/register" className="text-blue-500">
                  Register here.
                </Link>
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <Paragraph className="text-gray-600">
            &copy; {new Date().getFullYear()} Password Manager. All rights
            reserved.
          </Paragraph>
        </div>
      </footer>
    </div>
  );
}

export default Login;
