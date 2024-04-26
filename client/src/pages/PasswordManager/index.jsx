import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Messages from "./Messages";
import Passwords from "./Passwords";

function PasswordManager() {
  const [passwords, setPasswords] = useState([]);
  const [sharedPasswords, setSharedPasswords] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchPasswords = async () => {
    try {
      const response = await fetch("/api/passwords");
      const data = await response.json();
      setPasswords(data);
    } catch (error) {
      console.error("Error fetching passwords:", error);
    }
  };

  const fetchSharedPasswords = async () => {
    try {
      const response = await fetch("/api/passwords/shared");
      const data = await response.json();
      setSharedPasswords(data);
    } catch (error) {
      console.error("Error fetching shared passwords:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleAddPassword = async (newPassword) => {
    try {
      const response = await fetch("/api/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPassword),
      });
      const data = await response.json();
      setPasswords([...passwords, data]);
    } catch (error) {
      console.error("Error adding password:", error);
    }
  };

  const handleAcceptShare = async (messageId) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "accept" }),
      });
      setMessages(messages.filter((message) => message._id !== messageId));
      fetchSharedPasswords();
    } catch (error) {
      console.error("Error accepting share:", error);
    }
  };

  const handleDeclineShare = async (messageId) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reject" }),
      });
      setMessages(messages.filter((message) => message._id !== messageId));
    } catch (error) {
      console.error("Error declining share:", error);
    }
  };

  const handleUpdatePassword = async (passwordId, updatedPassword) => {
    try {
      const response = await fetch(`/api/passwords/${passwordId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPassword),
      });
      const data = await response.json();
      setPasswords(
        passwords.map((password) =>
          password._id === passwordId ? data : password
        )
      );
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleDeletePassword = async (passwordId) => {
    try {
      await fetch(`/api/passwords/${passwordId}`, {
        method: "DELETE",
      });
      setPasswords(passwords.filter((password) => password._id !== passwordId));
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  };

  useEffect(() => {
    fetchPasswords();
    fetchSharedPasswords();
    fetchMessages();
  }, []);
  return (
    <>
      <Navbar />
      <Messages
        messages={messages}
        onAcceptShare={handleAcceptShare}
        onDeclineShare={handleDeclineShare}
      />
      <Passwords
        passwords={passwords}
        sharedPasswords={sharedPasswords}
        onAddPassword={handleAddPassword}
        onUpdatePassword={handleUpdatePassword}
        onDeletePassword={handleDeletePassword}
      />
    </>
  );
}

export default PasswordManager;

/**
 * At the top of the page, an input field URL/name and Password
 * Additionally, 3 checkboxes with the following values:
 * alphabet, numerals, symbols;
 * finally there should be another input field called “length”.
 * Finally, there should be a submit button.
 *
 *
 * Share
 * Somewhere on the password manager page,
 * there should be a way to input another user’s username as well as an “Submit” button. (handle no exist error)
 * When submitted, the other user see a message on their password manager page
 * that a user wants to share passwords. show the username.
 * If accepts, they should be able to see the other user’s passwords below their own,
 * but should not be able to modify or delete them.
 * If the user rejects, the user will not see the request again and no passwords will be shared.
 */
