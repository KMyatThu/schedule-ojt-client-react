import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

const NavBar = ({
  isLoggedIn,
  user,
  handleLogout,
  history,
  location
}) => {
  // const pathName = location.pathname;

  // const isActiveLink = url => url === pathName;

  const handleBrand = () => history.push("/");

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand onClick={handleBrand}>Schedules</Navbar.Brand>
      <Navbar.Collapse>
        <Nav className="mr-auto">
          {/* <Nav.Item className={isActiveLink("/post") && "active"}>
            <Link to="/post" className="nav-link">
              Posts
            </Link>
          </Nav.Item> */}
        </Nav>
        {isLoggedIn && <div className="mr-3">{user.name}</div>}
        {isLoggedIn ? (
          <a href="#foo" onClick={e => handleLogout(e)}>
            Logout
          </a>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
});

export default connect(mapStateToProps)(NavBar);
