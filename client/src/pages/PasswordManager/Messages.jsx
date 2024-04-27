import { Button, Table } from "antd";
import React from "react";

function Messages() {
  const columns = [
    {
      title: "Shared By",
      key: "sentUser",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <i
            style={{ marginRight: "16px" }}
            className="ri-check-line cursor-pointer text-xl"
          ></i>
          <i
            style={{ marginRight: "16px" }}
            className="ri-close-line cursor-pointer text-xl"
          ></i>
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Messages</h2>
        <Table
          columns={columns}
          rowKey="_id"
          className="bg-white rounded shadow"
        />
      </div>
    </div>
  );
}

export default Messages;
