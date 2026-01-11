import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p';
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '', as: Tag = 'div' }) => {
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
    </Tag>
  );
};

export default GlitchText;
