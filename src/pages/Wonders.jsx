import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Image, Typography, Input, Spin, Empty, Space } from "antd";
import { fetchDocument } from "../config/firebaseHelpers";
import { useDebounce } from "use-debounce";

const { Title } = Typography;
const { Search } = Input;

const Wonders = () => {
  const [wonders, setWonders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  console.log("Wonders data:", wonders);
  // Fetch wonders from Firestore
  useEffect(() => {
    const loadWonders = async () => {
      try {
        const data = await fetchDocument("wondersList", "allWonders");
        setWonders(data.wonders || []);
        setFiltered(data.wonders || []);
      } catch (err) {
        setError("⚠️ Failed to load wonders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWonders();
  }, []);

  // Filter wonders by search
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setFiltered(
        wonders.filter((wonder) =>
          wonder.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      );
    } else {
      setFiltered(wonders);
    }
  }, [debouncedSearchTerm, wonders]);

  // Table columns
const columns = useMemo(
  () => [
    {
      title: "Image",
      dataIndex: "links",
      key: "image",
      render: (links) => {
        const imageUrl = links?.images?.length > 0 ? links.images[0] : null;
        return imageUrl ? (
          <Image
            src={imageUrl}
            width={60}
            alt="Wonder"
            preview={true}
            className="rounded shadow-sm"
          />
        ) : (
          <span className="text-gray-400 italic">No image</span>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Build Year",
      dataIndex: "build_year",
      key: "build_year",
    },
    {
      title: "Time Period",
      dataIndex: "time_period",
      key: "time_period",
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      render: (summary) =>
        summary ? (
          <span>{summary.slice(0, 50)}...</span>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      title: "Links",
      dataIndex: "links",
      key: "links",
      render: (links) => (
        <Space>
          {links?.wiki && (
            <a
              href={links.wiki}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Wikipedia
            </a>
          )}
          {links?.britannica && (
            <a
              href={links.britannica}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Britannica
            </a>
          )}
          {links?.google_maps && (
            <a
              href={links.google_maps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Maps
            </a>
          )}
          {links?.trip_advisor && (
            <a
              href={links.trip_advisor}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Trip Advisor
            </a>
          )}
        </Space>
      ),
    },
  ],
  []
);


  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spin size="default"/>
      </div>
    );
  }

  if (error)
    return <div className="text-red-500 text-center font-medium">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <Title level={2} className="!mb-0 text-gray-800">
          🏛️ All Wonders
        </Title>
        <Search
          placeholder="Search wonder by name"
          allowClear
          enterButton
          size="large"
          onChange={handleSearchChange}
          className="w-full md:w-80"
        />
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey={(record) => record.name}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="rounded-lg"
          locale={{
            emptyText: <Empty description="No wonders found" />,
          }}
          footer={() => `Total Wonders: ${filtered.length}`}
        />
      </div>
    </div>
  );
};

export default Wonders;
