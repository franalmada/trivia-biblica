import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trivia para H29',
  description: 'Pon a prueba tu conocimiento',
  icons: {
    icon: '/foto.jpg',
  },
  openGraph: {
    title: 'Trivia para H29',
    description: 'Pon a prueba tu conocimiento',
    images: [
      {
        url: '/compartir.png',
        width: 1200,
        height: 630,
        alt: 'Trivia H29',
      },
    ],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  )
}