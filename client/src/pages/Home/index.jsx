import React from "react";
import Navbar from "../../components/Navbar";
import { Button, Typography } from "antd";

function Home() {
  const { Title, Paragraph } = Typography;
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <div className="home bg-gray-100 flex-grow ">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <img src="/logo.png" className="w-32 mt-14" />
            <Title level={1} className="text-6xl font-bold uppercase mb-8 mt-2">
              Password Manager
            </Title>
            <Paragraph className="text-xl mb-8">
              Securely store and manage your passwords with ease
            </Paragraph>
            <div className="flex justify-center mb-12">
              <Button type="primary" size="large" href="/register">
                Get Started
              </Button>
            </div>
            <div className="flex justify-center space-x-8">
              <div>
                <Title level={3} className="green">
                  Feature 1
                </Title>
                <Paragraph>Secure password storage</Paragraph>
              </div>
              <div>
                <Title level={3} className="green">
                  Feature 2
                </Title>
                <Paragraph>Generate strong passwords</Paragraph>
              </div>
              <div>
                <Title level={3} className="green">
                  Feature 3
                </Title>
                <Paragraph>Share passwords securely</Paragraph>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-gray-200 pt-6 pb-2">
          <div className="container mx-auto px-4 text-center">
            <Paragraph className="text-gray-600">
              &copy; {new Date().getFullYear()} Password Manager. All rights
              reserved.
            </Paragraph>
            <Paragraph className="text-gray-600">
              Created by Shanshan & Xiaoxi & Amber
            </Paragraph>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;

/**
 * The first page that users will see on the page.
 *  It will include the nav bar, (lightly) stylized website name,
 * product description and the names of the creators (i.e., you and your team).
 *  This page should have no other features.
 */
