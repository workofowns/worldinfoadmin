import React, { useEffect, useState, useCallback } from "react";
import { Table, Input, Spin, Typography, Empty } from "antd";
import { fetchDocument } from "../config/firebaseHelpers";

const { Title } = Typography;
const { Search } = Input;

const AppFeedBack = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Convert ISO date to IST
  const convertToIST = useCallback((isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, []);

  // Load feedbacks from Firestore
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchDocument("feedback", "userFeedback");
        setFeedbacks(data.feedBacks || []);
        setFiltered(data.feedBacks || []);
      } catch (err) {
        console.error("Failed to load feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  // Filter feedbacks
  useEffect(() => {
    if (searchTerm.trim()) {
      setFiltered(
        feedbacks.filter((item) =>
          item.feedbackContent?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFiltered(feedbacks);
    }
  }, [searchTerm, feedbacks]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Keep only important columns
  const columns = [
    {
      title: "UUID",
      dataIndex: "uuid",
      key: "uuid",
      render: (text) => <span>{text ? text.slice(0, 8) + "..." : "-"}</span>,
    },
    {
      title: "Feedback",
      dataIndex: "feedbackContent",
      key: "feedbackContent",
      ellipsis: true,
    },
     {
      title: "Created At",
      dataIndex: ["deviceInfo", "createdAt"],
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.deviceInfo?.createdAt) - new Date(b.deviceInfo?.createdAt),
      defaultSortOrder: "descend",
      render: (_, val) => convertToIST(val?.deviceInfo?.createdAt),
    },
    {
      title: "OS",
      dataIndex: ["deviceInfo", "osName"],
      key: "osName",
    },
    {
      title: "Device",
      dataIndex: ["deviceInfo", "deviceName"],
      key: "deviceName",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <Title level={2} className="!mb-0 text-gray-800">
          💬 User Feedback
        </Title>
        <Search
          placeholder="Search by feedback content"
          allowClear
          enterButton
          size="large"
          onChange={handleSearch}
          className="w-full md:w-80"
        />
      </div>

      {/* Responsive Table */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey={(record) => record.uuid}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="rounded-lg min-w-[700px]"
          locale={{
            emptyText: <Empty description="No feedback found" />,
          }}
          footer={() => `Total Feedbacks: ${filtered.length}`}
        />
      </div>
    </div>
  );
};

export default AppFeedBack;
