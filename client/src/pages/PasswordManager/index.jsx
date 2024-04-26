import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

function PasswordManager() {
  const [passwords, setPasswords] = useState([]);
  const [sharedPasswords, setSharedPasswords] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchPasswords = async () => {
    // Fetch passwords from the server
    // Update the passwords state with the fetched data
  };

  const fetchSharedPasswords = async () => {
    // Fetch shared passwords from the server
    // Update the sharedPasswords state with the fetched data
  };

  const fetchMessages = async () => {
    // Fetch messages from the server
    // Update the messages state with the fetched data
  };

  const handleAddPassword = async (newPassword) => {
    // Send a POST request to the server to add the new password
    // Update the passwords state with the new password
  };

  const handleAcceptShare = async (messageId) => {
    // Send a request to the server to accept the password share
    // Update the messages state by removing the accepted message
    // Update the sharedPasswords state with the newly shared password
  };

  const handleDeclineShare = async (messageId) => {
    // Send a request to the server to decline the password share
    // Update the messages state by removing the declined message
  };

  const handleUpdatePassword = async (passwordId, updatedPassword) => {
    // Send a request to the server to update the password
    // Update the passwords state with the updated password
  };

  const handleDeletePassword = async (passwordId) => {
    // Send a request to the server to delete the password
    // Update the passwords state by removing the deleted password
  };

  useEffect(() => {
    fetchPasswords();
    fetchSharedPasswords();
    fetchMessages();
  }, []);
  return (
    <>
      <Navbar />
      <div>PasswordManager</div>
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
