import { useState } from "react";
import { Menu, Layout, Tooltip } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  GlobalOutlined,
  CrownOutlined,
  TeamOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "1", icon: <DashboardOutlined />, label: "Dashboard", path: "/" },
    {
      key: "2",
      icon: <GlobalOutlined />,
      label: "Countries",
      path: "/countries",
    },
    { key: "3", icon: <CrownOutlined />, label: "Wonders", path: "/wonders" },
    { key: "4", icon: <TeamOutlined />, label: "Users", path: "/users" },
    {
      key: "5",
      icon: <MessageOutlined />,
      label: "Feedback",
      path: "/feedback",
    },
    {
      key: "6",
      icon: <SettingOutlined />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find((menu) => menu.key === key);
    if (item) navigate(item.path);
  };

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={260}
      collapsedWidth={80}
      breakpoint="lg"
      className="!bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 overflow-hidden transition-all duration-500"
    >
      {/* Logo Section */}
      <div
        onClick={() => navigate("/")}
        className="logo flex items-center justify-center p-4 text-gray-900 font-extrabold text-xl uppercase tracking-wider bg-white/60 rounded-xl mx-3 mt-3 mb-6 shadow-md transition-all duration-500 cursor-pointer hover:shadow-lg"
      >
        {collapsed ? "WI" : "World Info"}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[
          menuItems.find((item) => item.path === location.pathname)?.key || "1",
        ]}
        onClick={handleMenuClick}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: (
            <Tooltip title={collapsed ? item.label : ""} placement="right">
              <span className="text-lg">{item.icon}</span>
            </Tooltip>
          ),
          label: <span className="font-medium">{item.label}</span>,
        }))}
        className="px-2 custom-light-menu border-none bg-transparent"
      />

      {/* Footer section inside sidebar */}
      <div className="absolute bottom-5 left-0 w-full px-4">
        <div className="bg-white/70 rounded-xl p-3 text-center text-sm font-semibold text-gray-600 shadow-md">
          {collapsed ? "©WI" : "© World Info 2025"}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
