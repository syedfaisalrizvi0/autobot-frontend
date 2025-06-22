import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  BulbOutlined,
  VideoCameraOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import MainTable from "./maintable";

const { Header, Content, Sider } = Layout;

// Page Components
const Home = () => (
  <div
    style={{ padding: 24, minHeight: "calc(100vh - 64px)", background: "#fff" }}
  >
    <h2>Home Dashboard</h2>
    <p>Welcome to the content management system</p>
  </div>
);

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {collapsed ? "CMS" : "Content Manager"}
        </div>
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline">
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/didyouknow" icon={<BulbOutlined />}>
            <Link to="/didyouknow">Did You Know</Link>
          </Menu.Item>
          <Menu.Item key="/bluestudio" icon={<VideoCameraOutlined />}>
            <Link to="/bluestudio">Blue Studio</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 64px)",
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:type" element={<MainTable />} />
              {/* {"bluestudio, didyouknow"} */}
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
