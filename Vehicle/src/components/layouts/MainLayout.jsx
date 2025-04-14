import React from "react";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar />
      
      <main className="flex-grow px-4 py-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
