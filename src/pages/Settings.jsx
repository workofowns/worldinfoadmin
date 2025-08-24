import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  notification,
  Space,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  fetchDocument,
  updateDocument,
  addToDocument,
  deleteFromDocument,
} from "../config/firebaseHelpers";

const AppConfig = () => {
  const [configs, setConfigs] = useState({});
  const [modalData, setModalData] = useState({
    visible: false,
    type: "",
    key: "",
    value: "",
  });

  // Fetch configurations once on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchDocument("appConfig", "configurations");
        setConfigs(data || {});
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to load app config",
        });
        console.error(error);
      }
    };
    loadConfig();
  }, []);

  // Close the modal
  const handleModalClose = () => setModalData({ ...modalData, visible: false });

  // Add or Update configuration
  const handleAddOrUpdateConfig = useCallback(async () => {
    const { type, key, value } = modalData;

    if (!value.trim()) {
      return notification.warning({
        message: "Warning",
        description: "Value cannot be empty.",
      });
    }

    try {
      const action = type === "add" ? addToDocument : updateDocument;
      await action("appConfig", "configurations", { [key]: value });

      setConfigs((prev) => ({
        ...prev,
        [key]: value,
      }));

      notification.success({
        message: "Success",
        description: `${type === "add" ? "Added" : "Updated"} configuration successfully!`,
      });

      handleModalClose();
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Failed to ${type} configuration.`,
      });
      console.error(error);
    }
  }, [modalData]);

  // Edit Click handler
  const handleEditClick = useCallback((key, value) => {
    setModalData({ visible: true, type: "edit", key, value });
  }, []);

  // Add Click handler
  const handleAddClick = useCallback(() => {
    setModalData({ visible: true, type: "add", key: "", value: "" });
  }, []);

  // Delete Click handler with confirmation
  const handleDeleteClick = useCallback((key) => {
    Modal.confirm({
      title: "Are you sure you want to delete this configuration?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteFromDocument("appConfig", "configurations", key);
          setConfigs((prev) => {
            const updatedConfigs = { ...prev };
            delete updatedConfigs[key];
            return updatedConfigs;
          });
          notification.success({
            message: "Success",
            description: "Configuration deleted successfully!",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete configuration.",
          });
          console.error(error);
        }
      },
      onCancel() {
        console.log("Delete action canceled");
      },
    });
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Key", dataIndex: "key", key: "key" },
    { title: "Value", dataIndex: "value", key: "value" },
    {
      title: "Action",
      key: "action",
      render: (_, { key, value }) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditClick(key, value)}
            type="primary"
            size="large"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(key)}
            danger
            size="large"
          />
        </Space>
      ),
    },
  ];

  // Memoizing the dataSource
  const dataSource = React.useMemo(
    () =>
      Object.entries(configs).map(([key, value]) => ({
        key,
        value,
      })),
    [configs]
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center text-2xl font-semibold text-gray-800">
          <AppstoreAddOutlined className="mr-2" />
          App Configuration
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClick}
          className="bg-blue-600"
        >
          Add Config
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey="key"
        bordered
        footer={() => `Total Configurations: ${dataSource.length}`}
      />

      {/* Config Modal */}
      <Modal
        title={modalData.type === "add" ? "Add New Configuration" : "Edit Configuration"}
        open={modalData.visible}
        onCancel={handleModalClose}
        onOk={handleAddOrUpdateConfig}
        okText={modalData.type === "add" ? "Add" : "Update"}
        centered
      >
        <Input
          placeholder="Enter Key"
          value={modalData.key}
          onChange={(e) => setModalData({ ...modalData, key: e.target.value })}
          className="mb-4"
          disabled={modalData.type === "edit"}
          size="large"
        />
        <Input
          placeholder="Enter Value"
          value={modalData.value}
          onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
          size="large"
        />
      </Modal>
    </div>
  );
};

export default AppConfig;
