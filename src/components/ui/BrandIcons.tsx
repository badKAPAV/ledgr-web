interface IconProps {
  className?: string;
  size?: number;
}

export function CredIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 3v12h12V6H6zm3.5 3h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 9 14.5v-5a.5.5 0 0 1 .5-.5zm2 2v2h1v-2h-1z" />
    </svg>
  );
}

export function GooglePayIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function PhonePeIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="10" fill="#5f259f" />
      <path
        d="M28.4 12h-8.8c-1 0-1.8.8-1.8 1.8v20.4c0 .8.6 1.4 1.4 1.4h3.6c.8 0 1.4-.6 1.4-1.4v-6.8h4.2c5.6 0 9.6-3.7 9.6-7.7 0-4.3-4.3-7.7-9.6-7.7zm-.3 9.4h-3.9v-3.8h3.9c2.3 0 4.1 1 4.1 1.9 0 1-1.8 1.9-4.1 1.9z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function PaytmIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="10" fill="#002E6E" />
      <path
        d="M10 16h6.5c3.2 0 5.5 2.1 5.5 5.2s-2.3 5.2-5.5 5.2H14v6H10V16zm4 6.8h2.2c1.2 0 2-.8 2-1.8s-.8-1.8-2-1.8H14v3.6z"
        fill="#00BAF2"
      />
      <path
        d="M25 21h3.8v11.4H25V21zm0-4.6h3.8V19H25v-2.6zM32 21h3.4l2.4 6.2 2.4-6.2h3.4l-4.4 10.2c-.8 1.8-2.2 2.6-3.8 2.6h-1.4v-3h1c.6 0 1.1-.3 1.4-.9l.4-.9-4.4-8z"
        fill="#ffffff"
      />
    </svg>
  );
}
