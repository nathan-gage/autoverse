import React from 'react';

interface TUIBoxProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  borderColor?: 'cyan' | 'magenta' | 'green';
  noPadding?: boolean;
}

const TUIBox: React.FC<TUIBoxProps> = ({ 
  children, 
  title, 
  className = '', 
  borderColor = 'cyan',
  noPadding = false
}) => {
  const colorClass = {
    cyan: 'border-cyan-500 text-cyan-500 shadow-[0_0_5px_rgba(0,255,255,0.2)]',
    magenta: 'border-fuchsia-500 text-fuchsia-500 shadow-[0_0_5px_rgba(255,0,255,0.2)]',
    green: 'border-[#39ff14] text-[#39ff14] shadow-[0_0_5px_rgba(57,255,20,0.2)]'
  }[borderColor];

  const titleColorClass = {
    cyan: 'bg-cyan-900/30 text-cyan-300',
    magenta: 'bg-fuchsia-900/30 text-fuchsia-300',
    green: 'bg-green-900/30 text-[#39ff14]'
  }[borderColor];

  return (
    <div className={`relative border border-opacity-60 ${colorClass} ${className}`}>
      {/* Corner decorations */}
      <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-current"></div>
      <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-current"></div>
      <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-current"></div>
      <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-current"></div>

      {title && (
        <div className={`absolute -top-3 left-4 px-2 text-xs font-bold tracking-widest uppercase bg-[#050505] border border-current border-opacity-40 ${titleColorClass}`}>
          {title}
        </div>
      )}
      
      <div className={`h-full w-full ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>
    </div>
  );
};

export default TUIBox;
