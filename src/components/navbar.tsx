import React, { useState } from "react";
import "./components.css";

import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

const Navbar: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState<number | null>(null);

  const handleNavItemClick = (index: number) => {
    setActiveNavItem(index);
  };

  const isSublinkActive = (path: string) => {
    return window.location.pathname.startsWith(path);
  };

  const getNavLinkClass = (path: string) => {
    return isSublinkActive(path) ? "active" : "";
  };

  return (
    <div className="menu">
      <div className="navbar">
        <div className="logo">
          <img src="/img/insight-05.png" alt="Logo" />
        </div>
        <ul className="navigation">
          <li
            className={getNavLinkClass("/*")}
            onClick={() => handleNavItemClick(0)}
          >
            <NavLink to="/*" onClick={() => handleNavItemClick(0)}>
              <Icon icon="bx:home-alt" /> Trang chủ
            </NavLink>
          </li>

          <li
            className={getNavLinkClass("/manage-tickets")}
            onClick={() => handleNavItemClick(1)}
          >
            <NavLink to="/manage-tickets" onClick={() => handleNavItemClick(1)}>
              <Icon icon="uil:ticket" /> Quản lý vé
            </NavLink>
          </li>
          <li
            className={getNavLinkClass("/ticket-reconciliation")}
            onClick={() => handleNavItemClick(2)}
          >
            <NavLink
              to="/ticket-reconciliation"
              onClick={() => handleNavItemClick(2)}
            >
              <Icon icon="basil:invoice-outline" /> Đối soát vé
            </NavLink>
          </li>
          <li
            className={getNavLinkClass("/settings")}
            onClick={() => handleNavItemClick(3)}
          >
            <NavLink to="/settings" onClick={() => handleNavItemClick(3)}>
              <Icon icon="uil:setting" /> Cài đặt
            </NavLink>
            <ul className="submenu">
              <li>
                <NavLink
                  to="/settings/service-package"
                  className={getNavLinkClass("/settings/service-package")}
                >
                  Gói dịch vụ
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="copyright">
        &copy; {new Date().getFullYear()} Alta Software
      </div>
    </div>
  );
};

export default Navbar;