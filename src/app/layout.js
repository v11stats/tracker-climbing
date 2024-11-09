"use client";
// Any other imports and configuration here
import 'globals.css'

export const metadata = {
  title: 'Climbing Tracker',
  description: 'Track your climbing sessions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
