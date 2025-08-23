import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Componente Layout principal que envuelve todas las páginas
 */
const Layout = ({ children, showFooter = true }) => {
  return (
    <>
      <Header />
      <div className="main-content">
        {children}
      </div>
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;