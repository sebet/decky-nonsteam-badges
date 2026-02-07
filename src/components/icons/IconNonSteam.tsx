import React from "react";

export function PluginIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="34 34 84 60"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      style={{ width: "1em", height: "1em" }}
      {...props}
    >
      <circle
        cx="64"
        cy="64"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      />
      <circle cx="64" cy="64" r="10" fill="currentColor" />

      <path
        d="M80 64 L88 64"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <rect x="88" y="54" width="22" height="20" rx="4" fill="currentColor" />

      <line
        x1="110"
        y1="58"
        x2="118"
        y2="58"
        stroke="currentColor"
        strokeWidth="3"
      />
      <line
        x1="110"
        y1="70"
        x2="118"
        y2="70"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
