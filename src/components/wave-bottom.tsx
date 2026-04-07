import * as React from 'react'

export function WaveBottom(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1200 150"
      preserveAspectRatio="none"
      className="w-full h-auto"
      style={{ minHeight: '100px', maxHeight: '150px' }}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0,70 C100,30 200,110 300,75 C400,40 500,120 600,85 C700,50 800,130 900,95 C1000,60 1100,115 1200,80 L1200,150 L0,150 Z"
        fill="#072644"
        strokeLinecap="round"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export default WaveBottom
