// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";

// function Header() {
//   const [user, setUser] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");

//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.log("User data error:", error);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, [location]);

//   const handleLogout = () => {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("user");

//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
//       <div className="container-fluid px-4">
//         {/* Logo */}
//         <Link className="navbar-brand fw-bold fs-4" to="/">
//           💰 SpendWise
//         </Link>

//         {/* Mobile Menu */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarMenu"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Links */}
//         <div className="collapse navbar-collapse" id="navbarMenu">
//           <ul className="navbar-nav me-auto">
//             {/* Home */}
//             <li className="nav-item">
//               <NavLink
//                 to="/"
//                 end
//                 className={({ isActive }) =>
//                   isActive ? "nav-link active" : "nav-link"
//                 }
//               >
//                 Home
//               </NavLink>
//             </li>

//             {/* Features - only on logged out pages */}
//             {!user && (
//               <li className="nav-item">
//                 <a className="nav-link" href="/#features">
//                   Features
//                 </a>
//               </li>
//             )}

//             {/* About */}
//             {!user && (
//               <li className="nav-item">
//                 <a className="nav-link" href="/#about">
//                   About
//                 </a>
//               </li>
//             )}

//             {/* Dashboard */}
//             {user && (
//               <li className="nav-item">
//                 <NavLink
//                   to="/dashboard"
//                   className={({ isActive }) =>
//                     isActive ? "nav-link active" : "nav-link"
//                   }
//                 >
//                   Dashboard
//                 </NavLink>
//               </li>
//             )}

//             {/* Login */}
//             {!user && (
//               <li className="nav-item">
//                 <NavLink
//                   to="/login"
//                   className={({ isActive }) =>
//                     isActive ? "nav-link active" : "nav-link"
//                   }
//                 >
//                   Login
//                 </NavLink>
//               </li>
//             )}

//             {/* Signup */}
//             {/* {!user && (
//               <li className="nav-item">
//                 <NavLink
//                   to="/signup"
//                   className={({ isActive }) =>
//                     isActive ? "nav-link active" : "nav-link"
//                   }
//                 >
//                   Signup
//                 </NavLink>
//               </li>
//             )} */}
//           </ul>

//           <div className="d-flex align-items-center gap-3">
//             {user ? (
//               <>
//                 <span className="text-white">Welcome, {user.name}</span>

//                 <button
//                   className="btn btn-light btn-sm logout-btn"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link to="/signup" className="btn btn-primary">
//                 Get Started
//               </Link>
//             )}
//           </div>
//           {/* Login / Signup / Logout */}
//           {/* <div className="d-flex align-items-center gap-2">

//             {user ? (
//               <>
//                 <span className="text-white me-2">
//                   Welcome, {user.name || user.username}
//                 </span>

//                 <button
//                   className="btn btn-light btn-sm"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="btn btn-outline-light">
//                   Login
//                 </Link>

//                 <Link to="/signup" className="btn btn-light text-primary">
//                   Signup
//                 </Link>
//               </>
//             )}

//           </div> */}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import { Offcanvas } from "react-bootstrap";

function Header() {
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load user information
  useEffect(() => {
    const updateUser = () => {
      const userInfo = sessionStorage.getItem("user");

      try {
        setUser(userInfo ? JSON.parse(userInfo) : null);
      } catch (error) {
        console.error("User data error:", error);
        setUser(null);
      }
    };

    updateUser();
  }, [location]);

  // Close sidebar
  const closeSidebar = () => {
    setShowSidebar(false);
  };
const handleSectionClick = (sectionId) => {
  setShowSidebar(false);

  if (location.pathname === "/") {
    // Wait until the sidebar completely closes
    setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        window.scrollTo({
          top: section.offsetTop - 90,
          behavior: "smooth",
        });
      }
    }, 600);
  } else {
    navigate(`/home#${sectionId}`);
  }
};
  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setShowSidebar(false);

    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark spendwise-navbar shadow">
        <div className="container-fluid d-flex align-items-center">
          {/* Logo */}
          <Link className="navbar-brand fw-bold fs-4" to="/home">
            💰 SpendWise
          </Link>

          {/* Hamburger Toggle */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={closeSidebar}
        placement="end"
        className="spendwise-sidebar"
      >
        {/* Sidebar Header */}
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">💰 SpendWise</Offcanvas.Title>
        </Offcanvas.Header>

        {/* Sidebar Body */}
        <Offcanvas.Body>
          {/* User Welcome */}
          {user && (
            <div className="sidebar-welcome mb-4">
              <div className="sidebar-user-icon">👤</div>

              <div>
                <small className="text-muted">Welcome back,</small>

                <h6 className="fw-bold mb-0">
                  {user.name || user.username || "User"}
                </h6>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="sidebar-links">
            {/* Home */}
            <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              onClick={closeSidebar}
            >
              🏠 Home
            </NavLink>

            {/* Features */}
            {/* {!user && (
              <Link
                to="/#features"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                ✨ Features
              </Link>
            )} */}

            {!user && (
              <button
                type="button"
                className="sidebar-link"
                onClick={() => handleSectionClick("features")}
              >
                ✨ Features
              </button>
            )}

            {/* About */}
            {/* {!user && (
              <Link
                to="/#about"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                ℹ️ About
              </Link>
            )} */}
            {!user && (
              <button
                type="button"
                className="sidebar-link"
                onClick={() => handleSectionClick("about")}
              >
                ℹ️ About
              </button>
            )}

            {/* Dashboard */}
            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
                onClick={closeSidebar}
              >
                📊 Dashboard
              </NavLink>
            )}

            {/* Login */}
            {!user && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
                onClick={closeSidebar}
              >
                🔐 Login
              </NavLink>
            )}

            {/* Signup */}
            {!user && (
              <Link
                to="/signup"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                🚀 Get Started
              </Link>
            )}
          </div>

          {/* Logout Section */}
          {user && (
            <>
              <hr className="my-4" />

              <button
                className="sidebar-link logout-link"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
