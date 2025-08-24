import React, { useState } from "react";
import { Form, Input, Button, notification, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Get Firebase Auth Token
      const token = await user.getIdToken();

      // ✅ Store token (used for PrivateRoute validation)
      localStorage.setItem("adminToken", token);

      notification.success({
        message: "Login Successful",
        description: "You have been successfully logged in!",
      });

      navigate("/");
    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      <Card
        className="w-full max-w-md shadow-2xl rounded-2xl"
        bodyStyle={{ padding: "2rem" }}
      >
        <div className="text-center mb-6">
          <Title level={2} className="!text-blue-600">
            WorldInfo Admin
          </Title>
          <Text type="secondary">Sign in to access your dashboard</Text>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              className="!bg-blue-600 hover:!bg-blue-700 rounded-lg"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
