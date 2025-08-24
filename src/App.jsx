import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AppRoutes from "./routes";
import "./App.css";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

const App = () => {
  const location = useLocation();

  // Hide sidebar on login page
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <Content className="bg-red shadow-lg overflow-y-auto">
          <AppRoutes />
        </Content>
      </div>
    </div>
  );
};

export default App;
