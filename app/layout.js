import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Portfolio | Khristian Angelo',
  description: 'Project Manager and Frontend Developer Portfolio website.',
};