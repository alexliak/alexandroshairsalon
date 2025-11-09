import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, AppstoreOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('home');
  const [collapsed, setCollapsed] = useState(true);

  const handleClick = e => {
    setCurrent(e.key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Alexandro's Hair Salon</div>
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          theme="dark"
          className="hidden md:flex"
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="services" icon={<AppstoreOutlined />}>
            <Link to="/services">Services</Link>
          </Menu.Item>
          <Menu.Item key="contact" icon={<MailOutlined />}>
            <Link to="/contact">Contact</Link>
          </Menu.Item>
        </Menu>
        <div className="md:hidden">
          <button onClick={toggleCollapsed}>
            <MenuOutlined style={{ fontSize: '24px', color: 'white' }} />
          </button>
        </div>
      </div>
      {!collapsed && (
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="vertical"
          theme="dark"
          className="md:hidden"
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="services" icon={<AppstoreOutlined />}>
            <Link to="/services">Services</Link>
          </Menu.Item>
          <Menu.Item key="contact" icon={<MailOutlined />}>
            <Link to="/contact">Contact</Link>
          </Menu.Item>
        </Menu>
      )}
    </header>
  );
};

export default Header;
