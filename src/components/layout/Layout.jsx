import React from 'react';
import Header from './Header';
import HeaderInterno from './HeaderInterno';
import Footer from './Footer';

/**
 * Componente Layout principal que envuelve todas las páginas
 */
const Layout = ({ children, showFooter = true, isInternal = false }) => {
  return (
    <div className="layout">
      {isInternal ? <HeaderInterno /> : <Header />}
      <main style={{ paddingTop: '4rem', minHeight: 'calc(100vh - 4rem)' }}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;