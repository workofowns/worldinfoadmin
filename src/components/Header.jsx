import { Layout } from 'antd';

const { Header } = Layout;

const AppHeader = () => (
  <Header className="bg-white p-4 shadow-md flex items-center">
    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
  </Header>
);

export default AppHeader;