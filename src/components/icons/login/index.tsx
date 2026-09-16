import { forwardRef } from "react";

export type LoginIconProps = React.SVGAttributes<SVGSVGElement> & {
  size?: number | string;
};

export const LoginArrowRight = forwardRef<SVGSVGElement, LoginIconProps>(function LoginArrowRight(
  { size = 24, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h13"/>
  <path d="m13 7 5 5-5 5"/>
    </svg>
  );
});
export const LoginEyeOff = forwardRef<SVGSVGElement, LoginIconProps>(function LoginEyeOff(
  { size = 24, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3l18 18"/>
  <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a16.8 16.8 0 0 1-2.4 3.1"/>
  <path d="M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.2-.2 3.1-.5"/>
  <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
    </svg>
  );
});
export const LoginEye = forwardRef<SVGSVGElement, LoginIconProps>(function LoginEye(
  { size = 24, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/>
  <circle cx="12" cy="12" r="2.5"/>
    </svg>
  );
});
export const LoginFaceId = forwardRef<SVGSVGElement, LoginIconProps>(function LoginFaceId(
  { size = 24, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 17v-4a3 3 0 0 1 3-3h4"/>
  <path d="M31 10h4a3 3 0 0 1 3 3v4"/>
  <path d="M38 31v4a3 3 0 0 1-3 3h-4"/>
  <path d="M17 38h-4a3 3 0 0 1-3-3v-4"/>
  <path d="M18 20v5"/>
  <path d="M30 20v5"/>
  <path d="M19 31c1.4 1.5 3 2.2 5 2.2s3.6-.7 5-2.2"/>
    </svg>
  );
});
export const LoginLock = forwardRef<SVGSVGElement, LoginIconProps>(function LoginLock(
  { size = 24, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="4.5" y="10" width="15" height="11" rx="2.5"/>
  <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3"/>
  <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
});
export const LoginMail = forwardRef<SVGSVGElement, LoginIconProps>(function LoginMail(
  { size = 24, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5"/>
  <path d="m4 7 8 6 8-6"/>
    </svg>
  );
});
