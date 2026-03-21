import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar as BsNavbar } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role?.toLowerCase?.() || "";
  const isLoggedIn = Boolean(token && user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/">
          Smart Inventory
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {isLoggedIn && role === "admin" && (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/inventory">
                  Inventory
                </Nav.Link>
                <Nav.Link as={Link} to="/staff-management">
                  Staff
                </Nav.Link>
              </>
            )}

            {isLoggedIn && role === "staff" && (
              <>
                <Nav.Link as={Link} to="/billing">
                  Billing
                </Nav.Link>
                <Nav.Link as={Link} to="/inventory">
                  Inventory (Read-only)
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto align-items-lg-center gap-2">
            {!isLoggedIn ? (
              <>
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="light" size="sm">
                  Register
                </Button>
              </>
            ) : (
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
