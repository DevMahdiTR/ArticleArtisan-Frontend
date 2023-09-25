import React, { useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import CategoryIcon from '@mui/icons-material/Category';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import { Layout, Menu, theme } from 'antd';
import {Users, Categorie,Poster,Article } from '../../Components/index';
const { Content, Sider } = Layout;

const items = [
  
  {
    key : '1',
    icon : React.createElement(GroupsIcon),
    label : 'Users'
  },
  {
    key : '2',
    icon : React.createElement(CategoryIcon),
    label : 'Categories'
  },
  {
    key : '3',
    icon : React.createElement(ArticleOutlinedIcon),
    label : 'Articles'
  },
  {
    key : '4',
    icon : React.createElement(NewspaperOutlinedIcon),
    label : 'Poster'
  }
]

const DashBoard = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [selectedNavItem, setSelectedNavItem] = useState(0);

  return (
    <div className="dashboard">
     <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          width: 400,
          position: 'flex',
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[String(selectedNavItem + 1)]}
          onSelect={({ key }) => setSelectedNavItem(parseInt(key, 10) - 1)}
          items={items}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 10}}>
        <Content style={{ overflow: 'initial' , height: '100vh'}}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer, height: '100vh' }}>
            {selectedNavItem === 0 && <div><Users/></div>}
            {selectedNavItem === 1 && <div><Categorie/></div>}
            {selectedNavItem === 2 && <div><Article/></div>}
            {selectedNavItem === 3 && <div><Poster/></div>}
          </div>
        </Content>
      </Layout>
    </Layout>
    </div>
   
  );
};

export default DashBoard;
