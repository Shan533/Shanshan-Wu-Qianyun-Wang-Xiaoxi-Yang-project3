import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, Button, Modal, Form, Input, Checkbox, message } from 'antd';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function PasswordManager() {
  const [passwords, setPasswords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatePasswordId, setUpdatePasswordId] = useState(null);
  const [updatePassword, setUpdatePassword] = useState('');

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:5000/api/users/loggedIn');
          setUser(response.data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        navigate('/login');
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
      const response = await axios.get('http://localhost:5000/api/passwords');
      setPasswords(response.data);
    } catch (error) {
      console.error('Failed to fetch passwords:', error);
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
        await axios.post('http://localhost:5000/api/passwords', values);
      } else {
        await axios.post('http://localhost:5000/api/passwords/generate', values);
      }
      setVisible(false);
      form.resetFields();
      fetchPasswords();
    } catch (error) {
      console.error('Failed to save password:', error);
    }
  };

  const handleDelete = async (passwordId) => {
    try {
      await axios.delete(`http://localhost:5000/api/passwords/${passwordId}`);
      fetchPasswords();
    } catch (error) {
      console.error('Failed to delete password:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await axios.put(`http://localhost:5000/api/passwords/${updatePasswordId}`, {
        password: updatePassword,
      });
      setUpdateModalVisible(false);
      fetchPasswords();
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  const showUpdateModal = (record) => {
    setUpdatePasswordId(record._id);
    setUpdatePassword(record.password);
    setUpdateModalVisible(true);
  };

  const columns = [
    {
      title: 'Website URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Created By',
      dataIndex: 'owner',
      key: 'owner',
      render: () => {
        return <div>{user.username}</div>;
      }
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            icon={<img src="../../../public/edit-2-line.png" alt="Edit" />}
            onClick={() => showUpdateModal(record)}
            style={{ marginRight: '16px' }}
          />
          <Button
            icon={<img src="../../../public/delete-bin-line.png" alt="Delete" />}
            onClick={() => handleDelete(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-100 flex-grow">
        <div className="container mx-auto px-4">
          <div className="text-center mt-12">
            <Title level={2}>Password Manager</Title>
            <Button type="primary" onClick={handleAdd}>
              Add Password
            </Button>
          </div>
          <div className="mt-8">
            <Table columns={columns} dataSource={passwords} rowKey="_id" />
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 pt-6 pb-2">
        <div className="container mx-auto px-4 text-center">
          <Typography.Paragraph className="text-gray-600">
            &copy; {new Date().getFullYear()} Password Manager. All rights reserved.
          </Typography.Paragraph>
        </div>
      </footer>
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
            rules={[{ required: true, message: 'Please enter the website URL' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input />
          </Form.Item>
          <Form.Item name="alphabet" valuePropName="checked">
            <Checkbox>Alphabet</Checkbox>
          </Form.Item>
          <Form.Item name="numerals" valuePropName="checked">
            <Checkbox>Numerals</Checkbox>
          </Form.Item>
          <Form.Item name="symbols" valuePropName="checked">
            <Checkbox>Symbols</Checkbox>
          </Form.Item>
          <Form.Item name="length" label="Length">
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
    </div>
  );
}

export default PasswordManager;