interface IconProps {
  className?: string;
  size?: number;
}

// Vite dynamic glob to import all asset images with any extension (png, jpg, jpeg, svg, webp)
const assetLogos = import.meta.glob<{ default: string }>('../../assets/*.{png,jpg,jpeg,svg,webp}', { eager: true });

function resolveLogo(name: string): string | undefined {
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
  for (const ext of extensions) {
    const path = `../../assets/${name}.${ext}`;
    if (assetLogos[path]?.default) {
      return assetLogos[path].default;
    }
  }
  return undefined;
}

/**
 * CRED Logo
 * Resolves cred.png, cred.jpg, cred.jpeg, cred.svg, cred.webp with SVG fallback
 */
export function CredIcon({ className = "w-5 h-5", size }: IconProps) {
  const imgSrc = resolveLogo('cred');
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt="CRED"
        className={`${className} object-contain`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#000000" />
      <path
        d="M13 14h22v20H13V14z"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 20h10v8H19v-8z"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 28v5"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Google Pay (GPay) Logo
 * Resolves gpay.png, gpay.jpg, gpay.jpeg, gpay.svg, etc. with SVG fallback
 */
export function GooglePayIcon({ className = "w-5 h-5", size }: IconProps) {
  const imgSrc = resolveLogo('gpay') || resolveLogo('googlepay') || resolveLogo('google_pay');
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt="Google Pay"
        className={`${className} object-contain`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#FFFFFF" />
      <path
        d="M20.5 13.5C16.36 13.5 13 16.86 13 21v6c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5v-6"
        stroke="#4285F4"
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 27c0 4.14-3.36 7.5-7.5 7.5S13 31.14 13 27"
        stroke="#34A853"
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M27.5 34.5C31.64 34.5 35 31.14 35 27v-6c0-4.14-3.36-7.5-7.5-7.5S20 16.86 20 21v6"
        stroke="#EA4335"
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 21c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5"
        stroke="#FBBC04"
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * PhonePe Logo
 * Resolves phonepe.png, phonepe.jpg, phonepe.jpeg, phonepe.svg, etc. with SVG fallback
 */
export function PhonePeIcon({ className = "w-5 h-5", size }: IconProps) {
  const imgSrc = resolveLogo('phonepe') || resolveLogo('phone_pe');
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt="PhonePe"
        className={`${className} object-contain`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#5F259F" />
      <g fill="#FFFFFF">
        <path d="M29.5 9.5c-.8 0-1.5.4-1.8 1.1l-4.2 8.4h3.8l2.9-6.2c.3-.6.1-1.3-.4-1.8-.1-.9-.7-1.5-1.3-1.5z" />
        <path d="M16 19v10.5c0 3.6 2.9 6.5 6.5 6.5h2V31h-2c-1.4 0-2.5-1.1-2.5-2.5V19H16z" />
        <rect x="25.5" y="15" width="4.5" height="23" rx="1.5" />
      </g>
    </svg>
  );
}

/**
 * Paytm Logo
 * Resolves paytm.png, paytm.jpg, paytm.jpeg, paytm.svg, etc. with SVG fallback
 */
export function PaytmIcon({ className = "w-5 h-5", size }: IconProps) {
  const imgSrc = resolveLogo('paytm');
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt="Paytm"
        className={`${className} object-contain`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="48" rx="12" fill="#FFFFFF" />
      <path
        d="M10 16h6.2c3 0 5 1.8 5 4.5s-2 4.5-5 4.5H13.6v7H10V16zm3.6 6.3h2.3c1.2 0 1.9-.7 1.9-1.8s-.7-1.8-1.9-1.8h-2.3v3.6z"
        fill="#002970"
      />
      <path
        d="M22.8 24.2c0-2.4 1.8-4.2 4.2-4.2s4.2 1.8 4.2 4.2v7.8h-3.2v-1.6c-.6 1.1-1.7 1.8-3 1.8-2.2 0-3.8-1.6-3.8-3.6 0-2.2 1.8-3.6 4.6-3.6h2.2v-.8c0-1-.7-1.6-1.8-1.6-1 0-1.7.5-1.9 1.4l-3-.6c.5-1.8 2.2-2.8 4.9-2.8zm5.2 3.8h-1.8c-1.2 0-2 .6-2 1.6 0 .9.7 1.5 1.7 1.5 1.2 0 2.1-.9 2.1-2.1v-1z"
        fill="#002970"
      />
      <path
        d="M34.5 18.5V20.8h-2v2.6h2v5.2c0 2.3 1.2 3.4 3.4 3.4.8 0 1.6-.2 2.1-.5l-.6-2.4c-.3.2-.8.3-1.2.3-.9 0-1.3-.5-1.3-1.5v-4.5h2.8v-2.6h-2.8v-2.3h-2.4z"
        fill="#00BAF2"
      />
      <path
        d="M42 20.8v1.6c.7-1.2 2-1.8 3.4-1.8 1.4 0 2.6.7 3.2 1.8.8-1.2 2.1-1.8 3.6-1.8 2.2 0 3.8 1.5 3.8 4.2v7.2h-3.4v-6.6c0-1.2-.6-1.9-1.6-1.9s-1.8.7-1.8 1.9v6.6h-3.4v-6.6c0-1.2-.6-1.9-1.6-1.9s-1.8.7-1.8 1.9v6.6H38.6V20.8H42z"
        fill="#00BAF2"
      />
    </svg>
  );
}
