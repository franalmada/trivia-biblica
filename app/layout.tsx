import type { Metadata } from 'next'

const titulo = 'Trivia para H29'
const descripcion = 'Pon a prueba tu conocimiento'

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  icons: {
    icon: '/foto.jpg',
  },
  openGraph: {
    title: titulo,
    description: descripcion,
    images: [{ url: '/compartir.jpg', width: 1200, height: 630, alt: 'Trivia H29' }],
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