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
            <Paragraph className="text-xl mb-6">
              Securely store and manage your passwords with ease
            </Paragraph>
            <div className="flex justify-center mb-6">
              <Button type="primary" size="large" href="/login">
                Get Started
              </Button>
            </div>
            <div className="grid grid-cols-3 space-x-8">
              <div>
                <Title level={3} className="green">
                  Feature 1
                </Title>
                <Paragraph className="text-justify">
                  Our website provides a secure vault for storing all your
                  passwords with top-level encryption. Once saved, your
                  passwords are protected with industry-standard security
                  measures to prevent unauthorized access. You can access your
                  stored passwords anytime, anywhere, with just a few clicks.
                  This feature eliminates the need to remember multiple login
                  details, simplifying your online experience.
                </Paragraph>
              </div>
              <div>
                <Title level={3} className="green">
                  Feature 2
                </Title>
                <Paragraph className="text-justify">
                  Enhance your security with our password generator, which
                  creates strong, hard-to-crack passwords for your accounts.
                  Each password is a unique combination of letters, numbers, and
                  symbols to maximize security. This tool helps you avoid common
                  password pitfalls, such as using easily guessed passwords or
                  repeating the same passwords across different sites. With our
                  generator, you can ensure that each password is robust and
                  secure.
                </Paragraph>
              </div>
              <div>
                <Title level={3} className="green">
                  Feature 3
                </Title>
                <Paragraph className="text-justify">
                  Our platform allows you to share passwords securely with
                  family members, friends, or colleagues without compromising
                  your security. Through encrypted channels, you can grant
                  access to necessary passwords while maintaining control over
                  who sees what information. This feature is ideal for
                  collaborative environments, ensuring that sensitive
                  information remains protected even when shared. Manage shared
                  access easily through our user-friendly dashboard.
                </Paragraph>
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
