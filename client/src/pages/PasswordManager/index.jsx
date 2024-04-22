import React from "react";

function PasswordManager() {
  return <div>PasswordManager</div>;
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
