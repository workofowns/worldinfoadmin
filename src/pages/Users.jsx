import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Typography,
  Input,
  Spin,
  Modal,
  Space,
  Button,
  Descriptions,
  DatePicker,
} from "antd";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useDebounce } from "use-debounce";
import { db } from "../config/firebase";
import dayjs from "dayjs";

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const convertToIST = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Date filter state
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        let userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // sort by createdAt descending (new to old)
        userList = userList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setUsers(userList);
        setFiltered(userList);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Search by UUID
    if (debouncedSearchTerm.trim()) {
      result = result.filter((user) =>
        user.uuid?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      result = result.filter((user) => {
        const created = dayjs(user.createdAt);
        return (
          created.isAfter(start.startOf("day")) &&
          created.isBefore(end.endOf("day"))
        );
      });
    }

    setFiltered(result);
  }, [debouncedSearchTerm, users, dateRange]);

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setFiltered((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };

  const columns = useMemo(
    () => [
      { title: "FB ID", dataIndex: "id", key: "id", ellipsis: true },
      { title: "UUID", dataIndex: "uuid", key: "uuid" },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (val) => convertToIST(val),
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        defaultSortOrder: "descend",
      },
      { title: "Device Name", dataIndex: "deviceName", key: "deviceName" },
      { title: "OS Name", dataIndex: "osName", key: "osName", ellipsis: true },
      { title: "Brand", dataIndex: "brand", key: "brand" },
      { title: "Model Name", dataIndex: "modelName", key: "modelName" },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setSelectedUser(record);
                setIsDetailModalVisible(true);
              }}
            >
              View
            </Button>
            <Button
              danger
              size="small"
              onClick={() => {
                setUserToDelete(record);
                setIsDeleteModalVisible(true);
              }}
            >
              Delete
            </Button>
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
        <Spin size="default" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <Title level={2} className="!m-0">
          👤 All Users
        </Title>
        <div className="flex flex-col sm:flex-row gap-3">
          <Search
            placeholder="Search Users by UUID"
            allowClear
            enterButton
            size="large"
            onChange={handleSearchChange}
            className="max-w-md"
          />
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            size="large"
            allowClear
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          className="rounded-lg min-w-[700px]"

        />
      </div>

     {/* User Detail Modal */}
<Modal
  open={isDetailModalVisible}
  title="User Details"
  onCancel={() => setIsDetailModalVisible(false)}
  footer={null}
  centered
  width="100%"
  style={{ maxWidth: 700 }}
  bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
>
  {selectedUser && (
    <Descriptions
      bordered
      size="middle"
      className="bg-gray-50 p-4 rounded-lg"
      column={window.innerWidth < 640 ? 1 : 2} // 1 col on mobile, 2 on larger
    >
      {Object.entries(selectedUser).map(([key, value]) => (
        <Descriptions.Item key={key} label={key}>
          {key === "createdAt"
            ? convertToIST(value)
            : typeof value === "boolean"
            ? value.toString()
            : value || "—"}
        </Descriptions.Item>
      ))}
    </Descriptions>
  )}
</Modal>


      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalVisible}
        title="Confirm Delete"
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
        centered
      >
        Are you sure you want to delete this user?
      </Modal>
    </div>
  );
};

export default Users;
