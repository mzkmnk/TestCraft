import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/reset.css';

const { Header, Content, Sider } = Layout;

const siderStyle = {
    position: 'fixed',
    top: '64px',
    height: 'calc(100vh - 64px)',
    overflowY: 'auto'
};

const Sidebar = () => (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={siderStyle} width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">option1</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ flex: 1 }}>
        <Content style={{ marginTop: '64px', marginLeft: '200px', overflow: 'auto' }}>
            <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
                Content
            </div>
        </Content>
      </Layout>
    </Layout>
  );
  
  export default Sidebar;