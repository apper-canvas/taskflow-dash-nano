import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import { AuthContext } from "@/App";
const Sidebar = ({ currentUser }) => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard", roles: ["admin", "project_manager", "member"] },
    { name: "Projects", path: "/projects", icon: "Folder", roles: ["admin", "project_manager", "member"] },
    { name: "Tasks", path: "/tasks", icon: "CheckSquare", roles: ["admin", "project_manager", "member"] },
    { name: "Users", path: "/users", icon: "Users", roles: ["admin"] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    currentUser?.role ? item.roles.includes(currentUser.role) : false
  );

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.path}
      onClick={() => mobile && setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? "bg-primary text-white font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <ApperIcon name={item.icon} size={20} />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-xs text-gray-500">Pro</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavItem key={item.path} item={item} mobile={true} />
            ))}
          </nav>
{currentUser && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <ApperIcon name="LogOut" size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-xs text-gray-500">Pro</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

{currentUser && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <ApperIcon name="LogOut" size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;