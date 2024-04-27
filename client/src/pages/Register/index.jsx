import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Button, Form, Input, Typography } from "antd";
const { Title, Paragraph } = Typography;

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post("/api/users/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-100 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid text-center mt-12 justify-center">
            <Title level={1} className="uppercase font-bold">
              Register
            </Title>
            <Paragraph>
              If you do not have an account, you can create one below.
            </Paragraph>
            {error && <Paragraph type="danger">{error}</Paragraph>}

            <div className="mt-8">
              <Form
                onSubmitCapture={handleRegister}
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
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
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
                  <Paragraph className="mt-8">
                    Already have an account?{" "}
                    <Link to="/login">Login here.</Link>
                  </Paragraph>
                </Form.Item>
              </Form>
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

export default Register;
