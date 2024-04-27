import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
} from "antd";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Messages from "./Messages";
import ShareRequestModal from './sharePasswordForm';

const { Title } = Typography;

function PasswordManager() {
  const [passwords, setPasswords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatePasswordId, setUpdatePasswordId] = useState(null);
  const [updatePassword, setUpdatePassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get("/api/users/loggedIn");
          setUser(response.data.user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };

    fetchLoggedInUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPasswords();
    }
  }, [user]);

  const fetchPasswords = async () => {
    try {
      const response = await axios.get("/api/passwords");
      setPasswords(response.data);
    } catch (error) {
      console.error("Failed to fetch passwords:", error);
    }
  };

  const handleAdd = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (values.password) {
        await axios.post("/api/passwords", values);
      } else {
        if (!values.alphabet && !values.numerals && !values.symbols) {
          message.error("At least one character type must be selected");
          return;
        }
        if (values.length < 4 || values.length > 50) {
          message.error("Length must be between 4 and 50");
          return;
        }
        await axios.post("/api/passwords/generate", values);
      }
      setVisible(false);
      form.resetFields();
      fetchPasswords();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error);
      } else {
        message.error("Failed to save password");
      }
    }
  };

  const handleDelete = async (passwordId) => {
    try {
      await axios.delete(`/api/passwords/${passwordId}`);
      fetchPasswords();
    } catch (error) {
      console.error("Failed to delete password:", error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await axios.put(`/api/passwords/${updatePasswordId}`, {
        password: updatePassword,
      });
      setUpdateModalVisible(false);
      fetchPasswords();
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  const showUpdateModal = (record) => {
    setUpdatePasswordId(record._id);
    setUpdatePassword(record.password);
    setUpdateModalVisible(true);
  };

  const showShareModal = (record) => {
    setSelectedPassword(record);
    setShareModalVisible(true);
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    message.success("Password copied to clipboard");
  };

  const columns = [
    {
      title: "Website URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text, record) => {
        const togglePasswordVisibility = () => {
          setPasswordVisible(!passwordVisible);
        };

        return (
          <div>
            {passwordVisible ? (
              <span>{text}</span>
            ) : (
              <span>{"*".repeat(text.length)}</span>
            )}
            {passwordVisible ? (
              <i
                className="ri-eye-off-fill mx-2 text-lg"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <i
                className="ri-eye-fill mx-2 text-lg"
                onClick={togglePasswordVisibility}
              />
            )}

            <i
              className="ri-file-copy-line text-lg"
              onClick={() => handleCopyPassword(text)}
            />
          </div>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "owner",
      key: "owner",
      render: () => {
        return <div>{user.username}</div>;
      },
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <i
            onClick={() => showUpdateModal(record)}
            style={{ marginRight: "16px" }}
            className="ri-edit-2-line cursor-pointer text-xl"
          ></i>
          <i
            onClick={() => handleDelete(record._id)}
            style={{ marginRight: "16px" }}
            className="ri-delete-bin-line cursor-pointer text-xl"
          ></i>
          <i
            onClick={() => showShareModal(record)}
            style={{ marginRight: "16px" }}
            className="ri-user-shared-line cursor-pointer text-xl"
          ></i>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-100 flex-grow">
        <div className="container mx-auto px-4">
          <div className="text-center mt-8 grid">
            <Title level={2}>Password Manager</Title>
          </div>
          <div className="mt-4">
            <div className="max-w-7xl mx-auto">
              <Messages />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-end mb-4">
              <Button type="primary" onClick={handleAdd} className="w-32">
                Add Password
              </Button>
            </div>
            <Table columns={columns} dataSource={passwords} rowKey="_id" />
          </div>
        </div>
      </div>

      <Modal
        visible={visible}
        title="Add Password"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="url"
            label="Website URL"
            rules={[
              { required: true, message: "Please enter the website URL" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input />
          </Form.Item>
          <Form.Item name="alphabet" valuePropName="checked" initialValue={true}>
            <Checkbox>Alphabet</Checkbox>
          </Form.Item>
          <Form.Item name="numerals" valuePropName="checked" initialValue={true}>
            <Checkbox>Numerals</Checkbox>
          </Form.Item>
          <Form.Item name="symbols" valuePropName="checked" initialValue={true}>
            <Checkbox>Symbols</Checkbox>
          </Form.Item>
          <Form.Item name="length" label="Length" initialValue={8}>
            <Input type="number" min={4} max={50} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={updateModalVisible}
        title="Update Password"
        onCancel={() => setUpdateModalVisible(false)}
        onOk={handleUpdatePassword}
      >
        <Input
          value={updatePassword}
          onChange={(e) => setUpdatePassword(e.target.value)}
          placeholder="Enter new password"
        />
      </Modal>
      <ShareRequestModal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        onShare={() => {
          setShareModalVisible(false);
          fetchPasswords();
        }}
        password={selectedPassword}
      />
    </div>
  );
}

export default PasswordManager;
