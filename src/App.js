import React, { useEffect, useState } from "react";
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
import GalleryPage from "./Gallary";

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
  const [channals, setChannals] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:5000/channals")
      .then((res) => res.json())
      .then((data) => {
        setChannals(data);
      });
  }, []);
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
          {channals.map((channal) => (
            <Menu.Item key={`/${channal}`} icon={<HomeOutlined />}>
              <Link to={`/channel/${channal}`}>{channal}</Link>
            </Menu.Item>
          ))}
          <Menu.Item key={`/gallery`} icon={<HomeOutlined />}>
            <Link to={`/gallery`}>Gallery</Link>
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
              <Route path="/channel/:type" element={<MainTable />} />
              <Route
                path="/gallery"
                element={<GalleryPage channals={channals} />}
              />
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
