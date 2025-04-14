import React from "react";

export const UserNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3 fixed-top" style={{ height: "60px", zIndex: 200 , left: "850px", width: "calc(32% - 250px)" }}>
      <div className="container-fluid d-flex justify-content-end align-items-center">
        <a href="/login" target="_blank" rel="noopener noreferrer" className="btn btn-primary mx-2">
          Login
        </a>
        <a href="/signup" target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2">
          Signup
        </a>
      </div>
    </nav>
  );
};