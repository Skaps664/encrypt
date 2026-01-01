import './globals.css'
import { ReactNode } from 'react'
import Providers from './providers'

export const metadata = {
  title: 'Encrypted Diary',
  description: 'Zero-knowledge, client-side encrypted diary',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <div className="min-h-screen px-4 py-8 lg:px-20">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
