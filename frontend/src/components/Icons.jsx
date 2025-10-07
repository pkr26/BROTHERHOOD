// Brotherhood Icon - Shield with interlocked hands representing protection and support
export const BrotherhoodIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L3 7V11.09C3 16.14 6.41 20.85 11.5 21.95C11.66 21.99 11.83 22 12 22C12.17 22 12.34 21.99 12.5 21.95C17.59 20.85 21 16.14 21 11.09V7L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12L11 15L16 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Support Circle - Hands forming a circle
export const SupportIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path
      d="M12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8Z"
      fill={color}
    />
    <path
      d="M7 14C7 16.21 9.24 18 12 18C14.76 18 17 16.21 17 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Mountain Peak - Representing challenges overcome
export const ChallengeIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 18L12 9L16 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 18L6.5 11.5L10 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 18L17.5 11.5L21 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="5" r="2" stroke={color} strokeWidth="2" />
  </svg>
);

// Lighthouse - Guidance and hope
export const GuidanceIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L12 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 8L9 20H15L12 8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 13L7 11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 13L17 11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M5 7L7 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 7L17 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Tree with Strong Roots - Growth and stability
export const GrowthIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C9 2 7 4 7 7C7 8.5 7.5 9.8 8.3 10.8C6.9 11.5 6 13 6 14.7C6 17.1 8 19 10.5 19H11V22H13V19H13.5C16 19 18 17.1 18 14.7C18 13 17.1 11.5 15.7 10.8C16.5 9.8 17 8.5 17 7C17 4 15 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Campfire - Warmth and community gathering
export const CommunityIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C10 2 8.5 4 8.5 6.5C8.5 7.3 8.7 8 9 8.6C7.8 9.3 7 10.6 7 12C7 14.2 8.8 16 11 16V19H13V16C15.2 16 17 14.2 17 12C17 10.6 16.2 9.3 15 8.6C15.3 8 15.5 7.3 15.5 6.5C15.5 4 14 2 12 2Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M6 20L8 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 20L16 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 20L12 17L14 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Anchor - Stability and grounding
export const StabilityIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="5" r="3" stroke={color} strokeWidth="2" />
    <path d="M12 8V22" stroke={color} strokeWidth="2" />
    <path
      d="M5 12H7C7 16.4 9.2 20 12 20C14.8 20 17 16.4 17 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Bridge - Connection and transition
export const ConnectionIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 17H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 17V13C3 11 5 9 7 9H17C19 9 21 11 21 13V17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 9V5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M17 9V5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 9V13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Compass - Direction and purpose
export const PurposeIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <polygon
      points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// Phoenix - Resilience and rebirth
export const ResilienceIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C9 2 7 4.5 7 7.5C7 9 7.5 10.3 8.3 11.3C6.5 12 5 13.8 5 16C5 18.8 7.2 21 10 21H11V20H13V21H14C16.8 21 19 18.8 19 16C19 13.8 17.5 12 15.7 11.3C16.5 10.3 17 9 17 7.5C17 4.5 15 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 14C9 14 10 13 12 13C14 13 15 14 15 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="9.5" cy="10.5" r="0.5" fill={color} />
    <circle cx="14.5" cy="10.5" r="0.5" fill={color} />
  </svg>
);

// Heart with hands - Care and empathy
export const EmpathyIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20.84 4.61C20.33 4.1 19.72 3.7 19.06 3.42C18.39 3.15 17.68 3 16.97 3C15.5 3 14.12 3.53 13.08 4.47L12 5.53L10.92 4.47C9.88 3.53 8.5 3 7.03 3C5.56 3 4.17 3.53 3.13 4.47C2.1 5.42 1.5 6.75 1.5 8.14C1.5 9.55 2.1 10.89 3.14 11.84L12 20.5L20.86 11.84C21.9 10.89 22.5 9.55 22.5 8.14C22.5 6.75 21.9 5.42 20.84 4.61Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Rising sun - New beginnings and hope
export const HopeIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4.22 4.22L6.34 6.34" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M17.66 17.66L19.78 19.78" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12H6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 12H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4.22 19.78L6.34 17.66" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M17.66 6.34L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
  </svg>
);

// Fist bump - Solidarity and strength
export const StrengthIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 10C7 8 8 7 10 7H14C16 7 17 8 17 10V14C17 16 16 17 14 17H10C8 17 7 16 7 14V10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 7V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 7V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 7V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M7 12H17" stroke={color} strokeWidth="1.5" />
    <path d="M12 17V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Icons = {
  BrotherhoodIcon,
  SupportIcon,
  ChallengeIcon,
  GuidanceIcon,
  GrowthIcon,
  CommunityIcon,
  StabilityIcon,
  ConnectionIcon,
  PurposeIcon,
  ResilienceIcon,
  EmpathyIcon,
  HopeIcon,
  StrengthIcon
};

export default Icons;