const BrotherhoodLogo = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brotherhood logo - Two interlocked B letters forming a unity symbol */}
      <g>
        {/* First B */}
        <path d="M5 3h5c1.3 0 2.4.4 3.1 1.2.7.8 1.1 1.8 1.1 2.9 0 .9-.2 1.6-.7 2.2-.3.4-.6.6-1 .9.6.2 1.1.5 1.5 1 .4.6.7 1.3.7 2.1 0 1.2-.4 2.1-1.1 2.9-.8.8-1.9 1.2-3.3 1.2H5V3zm4.1 5.6c.5 0 1-.2 1.3-.4.3-.3.5-.7.5-1.1 0-.5-.2-.9-.5-1.2-.3-.3-.8-.4-1.3-.4H7v3.1h2.1zm.3 5.3c.6 0 1.1-.2 1.4-.5.3-.3.5-.8.5-1.3s-.2-1-.5-1.3c-.3-.3-.8-.5-1.4-.5H7v3.6h2.4z"/>
        {/* Second B interlocked */}
        <path d="M10 6.5h5c1.3 0 2.4.4 3.1 1.2.7.8 1.1 1.8 1.1 2.9 0 .9-.2 1.6-.7 2.2-.3.4-.6.6-1 .9.6.2 1.1.5 1.5 1 .4.6.7 1.3.7 2.1 0 1.2-.4 2.1-1.1 2.9-.8.8-1.9 1.2-3.3 1.2H10V6.5zm4.1 5.6c.5 0 1-.2 1.3-.4.3-.3.5-.7.5-1.1 0-.5-.2-.9-.5-1.2-.3-.3-.8-.4-1.3-.4H12v3.1h2.1zm.3 5.3c.6 0 1.1-.2 1.4-.5.3-.3.5-.8.5-1.3s-.2-1-.5-1.3c-.3-.3-.8-.5-1.4-.5H12v3.6h2.4z" opacity="0.8"/>
      </g>
    </svg>
  );
};

export default BrotherhoodLogo;
