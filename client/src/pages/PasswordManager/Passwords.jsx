import React, { useState } from "react";
import { Input, Button, Modal, Form, Checkbox } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { generate } from "generate-password";
import Messages from "./Messages";
import PasswordForm from "./PasswordForm";

function Passwords({
  passwords,
  sharedPasswords,
  onAddPassword,
  onUpdatePassword,
  onDeletePassword,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddPassword = () => {
    setIsModalVisible(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTogglePasswordVisibility = (passwordId) => {
    // Toggle the visibility of the password
  };

  const filteredPasswords = passwords.filter((password) =>
    password.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSharedPasswords = sharedPasswords.filter((password) =>
    password.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "website",
      render: (text, record) => (
        <>
          {record.showPassword ? text : "********"}
          {record.showPassword ? (
            <EyeOutlined
              onClick={() => handleTogglePasswordVisibility(record.id)}
            />
          ) : (
            <EyeInvisibleOutlined
              onClick={() => handleTogglePasswordVisibility(record.id)}
            />
          )}
        </>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      dataIndex: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          {record.createdBy === currentUser && (
            <>
              <EditOutlined
                onClick={() => onUpdatePassword(record.id, updatedPassword)}
              />
              <DeleteOutlined onClick={() => onDeletePassword(record.id)} />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="section-header">
        <h2>Password</h2>
        <Button type="primary" onClick={handleAddPassword}>
          Add
        </Button>
      </div>
      <div className="search-bar">
        <Input
          placeholder="Search passwords"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
        ></Input>
      </div>
      <div className="passwords">
        <h3>Self Passwords</h3>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPasswords.map((password) => (
              <tr key={password.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(password[column.dataIndex], password)
                      : password[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Shared Passwords</h3>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSharedPasswords.map((password) => (
              <tr key={password.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(password[column.dataIndex], password)
                      : password[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        title="Add Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <PasswordForm
          onSubmit={(newPassword) => {
            onAddPassword(newPassword);
            setIsModalVisible(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default Passwords;
