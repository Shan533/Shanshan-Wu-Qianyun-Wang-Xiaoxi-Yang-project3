/* eslint-disable react/prop-types */
import { message, Table } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

function Messages({ onAccept, onReject }) {
  const [shareRequests, setShareRequests] = useState([]);

  useEffect(() => {
    fetchShareRequests();
  }, []);

  const fetchShareRequests = async () => {
    try {
      const response = await axios.get("/api/share/requests");
      setShareRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch share requests:", error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`/api/share/accept/${requestId}`);
      message.success("Share request accepted");
      onAccept();
      fetchShareRequests();
    } catch (error) {
      console.error("Failed to accept share request:", error);
      message.error("Failed to accept share request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`/api/share/reject/${requestId}`);
      message.success("Share request rejected");
      onReject();
      fetchShareRequests();
    } catch (error) {
      console.error("Failed to reject share request:", error);
      message.error("Failed to reject share request");
    }
  };

  const columns = [
    {
      title: "Shared By",
      dataIndex: "sender",
      key: "sender",
      render: (sender) => sender.username,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <i
            onClick={() => handleAccept(record._id)}
            style={{ marginRight: "16px" }}
            className="ri-check-line cursor-pointer text-xl"
          ></i>
          <i
            onClick={() => handleReject(record._id)}
            style={{ marginRight: "16px" }}
            className="ri-close-line cursor-pointer text-xl"
          ></i>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Share Requests</h2>
        <Table
          columns={columns}
          dataSource={shareRequests}
          rowKey="_id"
          className="bg-white rounded shadow"
        />
      </div>
    </div>
  );
}

export default Messages;
