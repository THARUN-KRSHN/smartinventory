import { useMemo } from "react";
import { NavLink } from "react-router-dom";

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : "";
};

const Sidebar = () => {
  const role = getRole();

  const links = useMemo(() => {
    if (role === "admin") {
      return [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Inventory", to: "/inventory" },
        { label: "Staff Management", to: "/staff-management" },
        { label: "Settings", to: "/settings" },
      ];
    }

    if (role === "staff") {
      return [
        { label: "Billing", to: "/billing" },
        { label: "Inventory (Read Only)", to: "/inventory" },
      ];
    }

    return [];
  }, [role]);

  if (links.length === 0) return null;

  return (
    <aside className="border-end bg-light" style={{ minHeight: "100vh" }}>
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h2 className="h6 mb-0">Menu</h2>
        <button
          className="btn btn-outline-secondary btn-sm d-md-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appSidebarNav"
          aria-controls="appSidebarNav"
          aria-expanded="false"
          aria-label="Toggle sidebar navigation"
        >
          Toggle
        </button>
      </div>

      <div className="collapse d-md-block" id="appSidebarNav">
        <nav className="nav flex-column p-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link rounded px-3 py-2 mb-1 ${isActive ? "active bg-primary text-white" : "text-dark"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
