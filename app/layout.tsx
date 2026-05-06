import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trivia Bíblica',
  description: 'Juego de preguntas bíblicas para grupos de iglesia',
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