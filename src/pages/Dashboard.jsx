import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchDocument, fetchCollection } from "../config/firebaseHelpers";
import { useNavigate } from "react-router-dom";
import {
  GlobalOutlined,
  BankOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Table, Button, Dropdown, Avatar, Space } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const Dashboard = () => {
  const [countriesCount, setCountriesCount] = useState(0);
  const [wondersCount, setWondersCount] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const countries = await fetchDocument("countriesList", "allCountries");
        setCountriesCount(countries?.countries?.length || 0);

        const wonders = await fetchDocument("wondersList", "allWonders");
        setWondersCount(wonders?.wonders?.length || 0);

        const users = await fetchCollection("users");
        setUsersCount(users.length);

        const feedback = await fetchDocument("feedback", "userFeedback");
        setFeedbackList(feedback?.feedBacks || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    loadData();
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("adminToken");
      console.log("Admin logged out");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const cards = [
    {
      title: "Total Countries",
      count: countriesCount,
      icon: <GlobalOutlined className="text-3xl text-indigo-600" />,
      path: "/countries",
      color: "from-indigo-100 to-indigo-200",
    },
    {
      title: "Total Wonders",
      count: wondersCount,
      icon: <BankOutlined className="text-3xl text-pink-600" />,
      path: "/wonders",
      color: "from-pink-100 to-pink-200",
    },
    {
      title: "Total Feedbacks",
      count: feedbackList.length,
      icon: <MessageOutlined className="text-3xl text-green-600" />,
      path: "/feedback",
      color: "from-green-100 to-green-200",
    },
    {
      title: "Total Users",
      count: usersCount,
      icon: <UserOutlined className="text-3xl text-purple-600" />,
      path: "/users",
      color: "from-purple-100 to-purple-200",
    },
  ];

  const columns = useMemo(
    () => [
      {
        title: "Device",
        dataIndex: "deviceInfo",
        key: "deviceName",
        render: (device) => device?.deviceName || "Unknown",
      },
      {
        title: "Brand",
        dataIndex: "deviceInfo",
        key: "brand",
        render: (device) => device?.brand || "Unknown",
      },
      {
        title: "OS",
        dataIndex: "deviceInfo",
        key: "osName",
        render: (device) =>
          `${device?.osName || ""} ${device?.osVersion || ""}`,
      },
      {
        title: "Feedback",
        dataIndex: "feedbackContent",
        key: "feedbackContent",
        render: (content) => (
          <span className="text-gray-700">{content?.slice(0, 60)}...</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header row with title + admin avatar */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          🌎 WorldInfo Admin Dashboard
        </h2>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <Space className="cursor-pointer">
            <Avatar
              size="default"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                fontWeight: "bold",
              }}
            >
              WI
            </Avatar>
          </Space>
        </Dropdown>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleNavigate(card.path)}
            className={`cursor-pointer rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow">{card.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">{card.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">
            📝 Recent Feedback
          </h4>
          <Button
            type="primary"
            onClick={() => handleNavigate("/feedback")}
            size="middle"
            className="!bg-indigo-600 hover:!bg-indigo-700 rounded-lg shadow-md"
          >
            See All
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={feedbackList.slice(0, 10)}
          pagination={false}
          bordered
          rowKey={(record, index) => index}
          className="rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
};

export default Dashboard;
