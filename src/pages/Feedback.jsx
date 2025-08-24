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
      dataIndex: "createdAt",
      key: "createdAt",
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
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">
          💬 User Feedback
        </Title>
        <Search
          placeholder="Search by feedback content"
          allowClear
          enterButton
          size="large"
          onChange={handleSearch}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey={(record) => record.uuid}
        pagination={{ pageSize: 10, showSizeChanger: false }}
         locale={{
            emptyText: <Empty description="No countries found" />,
          }}
          footer={() => `Total Countries: ${filtered.length}`}
      />
    </div>
  );
};

export default AppFeedBack;
