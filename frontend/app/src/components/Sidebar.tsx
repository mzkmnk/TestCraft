import React from 'react';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';

const { Content, Sider } = Layout;

interface MenuItem {
  label: string;
  key: string;
}

const siderStyle: React.CSSProperties = {
  position: 'fixed',
  top: '64px',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto'
};
const menuItems: MenuItem[] = [
  { label: 'option1', key: '1' },
  { label: 'option2', key: '2' },
  { label: 'option3', key: '3' },
  { label: 'option4', key: '4' },
];

const Sidebar: React.FC = () => (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={siderStyle} width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
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
