const MegaToggle = ({ 
  options = [], 
  activeId, 
  onChange, 
  disabledIds = [],
  variant = 'default' // 'default' (text/icon), 'ai-nodes' (the specific dots/icons from AI lib)
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      background: 'rgba(255,255,255,0.03)', 
      borderRadius: '12px', 
      padding: '2px', 
      border: '1px solid var(--color-border)', 
      width: 'fit-content', 
      marginInline: 'auto', 
      gap: '2px', 
      flexWrap: 'wrap', 
      justifyContent: 'center' 
    }}>
      {options.map((opt, index) => {
        if (opt.isSeparator) {
          return (
            <div key={`sep-${index}`} style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: 'auto 6px' }} />
          );
        }

        const isActive = activeId === opt.id;
        const isDisabled = disabledIds.includes(opt.id);
        const showLabel = !!opt.label && !opt.icon && variant !== 'ai-nodes';
        const buttonWidth = showLabel ? 'auto' : '38px';
        const buttonPadding = showLabel ? '0 14px' : '0';

        return (
          <button 
            key={opt.id}
            onClick={() => !isDisabled && onChange(opt.id)}
            disabled={isDisabled}
            style={{ 
              width: buttonWidth, 
              height: '32px', 
              padding: buttonPadding,
              borderRadius: '10px', 
              border: 'none', 
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.2 : 1,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            title={opt.label}
          >
            {/* Render logic based on variant or option content */}
            {opt.customRender ? opt.customRender(isActive) : (
              opt.icon ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%', 
                  height: '100%', 
                  fontSize: '0.9rem', 
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.2)' 
                }}>
                  {opt.icon}
                </div>
              ) : (
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {opt.label}
                </span>
              )
            )}

            {/* Active Indicator (Dot) if text is used in AI lib */}
            {variant === 'ai-nodes' && opt.type === 'dot' && (
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: opt.id === 'outdoor' ? 'transparent' : (isActive ? '#fff' : 'rgba(255,255,255,0.2)'),
                border: opt.id === 'outdoor' ? (isActive ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)') : 'none',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MegaToggle;
