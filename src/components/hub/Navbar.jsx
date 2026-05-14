const Navbar = () => {
  return (
    <nav style={{ position: 'relative', width: '100%', zIndex: 9000 }}>
      {/* Navbar Line: White */}
      <div style={{ 
        width: '100%', 
        height: '3px', 
        background: '#FFFFFF', 
        opacity: 0.9 
      }} />
    </nav>
  );
};

export default Navbar;
