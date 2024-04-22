import React from "react";
import Navbar from "../../components/Navbar";
import { Button, Input } from "antd";
import { generate } from "generate-password";

function Home() {
  return (
    <>
      <Navbar />
      <div className="">
        <div className="flex justify-center h-40 items-center">
          <h1 className="text-7xl uppercase">Password Manager</h1>
        </div>
        <div className="flex justify-center">
          <div className="flex w-1/2 gap-10">
            <Input placeholder="Please enter your password"></Input>
            <Input placeholder="password" type="password"></Input>
            <Button type="primary">Login</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

/**
 * The first page that users will see on the page.
 *  It will include the nav bar, (lightly) stylized website name,
 * product description and the names of the creators (i.e., you and your team).
 *  This page should have no other features.
 */
