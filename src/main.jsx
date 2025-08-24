import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#a78bfa",
          },
          components: {
            Button: {
              colorPrimary: "linear-gradient(135deg, #a78bfa, #f472b6)",
              colorPrimaryHover: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
