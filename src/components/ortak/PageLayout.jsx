
/**
 * PageLayout - Shared Screen Wrapper Component
 * Standardizes the page container layout, ensuring proper spacing for the Floating Menu
 * and a consistent "Diamond Standard" dark background across the app.
 */
const PageLayout = ({
  children,
  padding = '0',
  withBottomNav = true,
  background = '#000',
  color = '#fff',
  style = {},
  innerStyle = {},
  maxWidth = '600px' // Optimal readable width for content
}) => {
  return (
    <div 
      style={{
        minHeight: '100vh',
        background,
        color,
        // Add bottom padding only if there is a floating navigation menu
        paddingBottom: withBottomNav ? '8rem' : '0',
        ...style
      }}
    >
      <div 
        style={{
          padding,
          maxWidth,
          margin: '0 auto',
          height: '100%',
          ...innerStyle
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
