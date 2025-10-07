import { motion } from 'framer-motion';
import BrotherhoodLogo from '../BrotherhoodLogo';

/**
 * Reusable auth page layout with split design
 * Left side: Brotherhood symbol and branding
 * Right side: Form content
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 * @param {string} props.logoGradient - Tailwind gradient classes for logo background
 * @param {React.ReactNode} props.footer - Optional footer content
 */
const AuthLayout = ({
  children,
  title,
  subtitle,
  logoGradient = 'from-primary to-primary-dark',
  footer,
}) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Brotherhood Symbol & Branding */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className={`fixed top-0 left-0 lg:w-[50vw] h-screen bg-gradient-to-br ${logoGradient} overflow-hidden`}>
          {/* Animated background elements */}
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 10,
            }}
          />

          {/* Logo and Branding Content - Always Centered */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              {/* Large Brotherhood Logo */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl">
                  <BrotherhoodLogo size={80} className="text-white" />
                </div>
              </div>

              {/* Branding Text */}
              <h1 className="text-5xl font-bold text-white mb-4">
                Brotherhood
              </h1>
              <p className="text-xl text-white/90 max-w-md">
                Where brothers unite, support, and grow together on their journey
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center p-8 lg:p-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo - Only visible on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg mb-4">
              <BrotherhoodLogo size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Brotherhood</h2>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              {title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>

            {/* Main Content */}
            {children}

            {/* Footer */}
            {footer && <div className="mt-8">{footer}</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
