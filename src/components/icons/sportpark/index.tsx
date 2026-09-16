import { forwardRef } from "react";

export type SportparkIconProps = React.SVGAttributes<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export const SpActivity = forwardRef<SVGSVGElement, SportparkIconProps>(function SpActivity(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12h4l2-7 4 14 2-7h6"/>
    </svg>
  );
});
export const SpArrowRight = forwardRef<SVGSVGElement, SportparkIconProps>(function SpArrowRight(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  );
});
export const SpBarChart = forwardRef<SVGSVGElement, SportparkIconProps>(function SpBarChart(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/>
    </svg>
  );
});
export const SpBell = forwardRef<SVGSVGElement, SportparkIconProps>(function SpBell(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>
    </svg>
  );
});
export const SpBodyAnalysis = forwardRef<SVGSVGElement, SportparkIconProps>(function SpBodyAnalysis(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="4.5" r="2.5"/><path d="M8.5 10c.8-1.7 2-2.5 3.5-2.5s2.7.8 3.5 2.5M9.5 10.5 8 15l2 6M14.5 10.5 16 15l-2 6M10 14h4"/>
    </svg>
  );
});
export const SpCalendar = forwardRef<SVGSVGElement, SportparkIconProps>(function SpCalendar(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
    </svg>
  );
});
export const SpCheckCircle = forwardRef<SVGSVGElement, SportparkIconProps>(function SpCheckCircle(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>
    </svg>
  );
});
export const SpChevronRight = forwardRef<SVGSVGElement, SportparkIconProps>(function SpChevronRight(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
});
export const SpClipboardList = forwardRef<SVGSVGElement, SportparkIconProps>(function SpClipboardList(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h4"/>
    </svg>
  );
});
export const SpClock = forwardRef<SVGSVGElement, SportparkIconProps>(function SpClock(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  );
});
export const SpDumbbell = forwardRef<SVGSVGElement, SportparkIconProps>(function SpDumbbell(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6.5 6.5 11 11M4.3 8.7l4.4-4.4M15.3 19.7l4.4-4.4M2.8 5.7l3.5-3.5M17.7 21.8l3.5-3.5M8.7 4.3 4.3 8.7M19.7 15.3l-4.4 4.4"/>
    </svg>
  );
});
export const SpFlame = forwardRef<SVGSVGElement, SportparkIconProps>(function SpFlame(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c4.4 0 7-3.1 7-7.2 0-3.3-1.7-6.2-5.1-8.8.1 2.4-1 4.1-2.6 5.2.1-3.7-1.6-6.8-4-9.2.2 4.1-2.3 6.3-2.3 10.6C5 18 7.9 22 12 22Z"/><path d="M9.5 17.5c0-1.8 1-3 2.5-4.5 1.4 1.3 2.5 2.8 2.5 4.5a2.5 2.5 0 0 1-5 0Z"/>
    </svg>
  );
});
export const SpHome = forwardRef<SVGSVGElement, SportparkIconProps>(function SpHome(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>
    </svg>
  );
});
export const SpImage = forwardRef<SVGSVGElement, SportparkIconProps>(function SpImage(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
    </svg>
  );
});
export const SpLogout = forwardRef<SVGSVGElement, SportparkIconProps>(function SpLogout(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>
    </svg>
  );
});
export const SpMessageCircle = forwardRef<SVGSVGElement, SportparkIconProps>(function SpMessageCircle(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4-.9L3 21l1.8-4.6A8.5 8.5 0 1 1 21 11.5Z"/>
    </svg>
  );
});
export const SpMessageSquare = forwardRef<SVGSVGElement, SportparkIconProps>(function SpMessageSquare(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/>
    </svg>
  );
});
export const SpMonitor = forwardRef<SVGSVGElement, SportparkIconProps>(function SpMonitor(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  );
});
export const SpPlus = forwardRef<SVGSVGElement, SportparkIconProps>(function SpPlus(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
});
export const SpSearch = forwardRef<SVGSVGElement, SportparkIconProps>(function SpSearch(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>
    </svg>
  );
});
export const SpSettings = forwardRef<SVGSVGElement, SportparkIconProps>(function SpSettings(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>
    </svg>
  );
});
export const SpTag = forwardRef<SVGSVGElement, SportparkIconProps>(function SpTag(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.6 13.6 13.5 20.7a2 2 0 0 1-2.8 0L3.3 13.3a2 2 0 0 1 0-2.8V4h6.5a2 2 0 0 1 1.4.6l9.4 9a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="8" r="1.2"/>
    </svg>
  );
});
export const SpTarget = forwardRef<SVGSVGElement, SportparkIconProps>(function SpTarget(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>
    </svg>
  );
});
export const SpTrendingUp = forwardRef<SVGSVGElement, SportparkIconProps>(function SpTrendingUp(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>
    </svg>
  );
});
export const SpUser = forwardRef<SVGSVGElement, SportparkIconProps>(function SpUser(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="7" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>
    </svg>
  );
});
export const SpUsers = forwardRef<SVGSVGElement, SportparkIconProps>(function SpUsers(
  { size = 24, strokeWidth = 1.8, ...props },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
});

export const SPORTPARK_ICONS = {
  "activity": SpActivity,
  "arrow-right": SpArrowRight,
  "bar-chart": SpBarChart,
  "bell": SpBell,
  "body-analysis": SpBodyAnalysis,
  "calendar": SpCalendar,
  "check-circle": SpCheckCircle,
  "chevron-right": SpChevronRight,
  "clipboard-list": SpClipboardList,
  "clock": SpClock,
  "dumbbell": SpDumbbell,
  "flame": SpFlame,
  "home": SpHome,
  "image": SpImage,
  "logout": SpLogout,
  "message-circle": SpMessageCircle,
  "message-square": SpMessageSquare,
  "monitor": SpMonitor,
  "plus": SpPlus,
  "search": SpSearch,
  "settings": SpSettings,
  "tag": SpTag,
  "target": SpTarget,
  "trending-up": SpTrendingUp,
  "user": SpUser,
  "users": SpUsers,
} as const;

export type SportparkIconKey = keyof typeof SPORTPARK_ICONS;
