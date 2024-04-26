import { Button } from "antd";
import React from "react";

function Messages({ messages, onAcceptShare, onDeclineShare }) {
  return (
    <div>
      <div>
        <h2>Messages</h2>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.sentUser} wants to share a password.</p>
            <Button onClick={() => onAcceptShare(message.id)}>Accept</Button>
            <Button onClick={() => onDeclineShare(message.id)}>Decline</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
