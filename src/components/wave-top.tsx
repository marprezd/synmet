import * as React from 'react'

export function WaveTop(props: React.SVGProps<SVGSVGElement>) {
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
        d="M0,80 C100,120 200,40 300,75 C400,110 500,30 600,65 C700,100 800,20 900,55 C1000,90 1100,35 1200,70 L1200,0 L0,0 Z"
        fill="#001122"
        strokeLinecap="round"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export default WaveTop
