import './globals.css'

export const metadata = {
  title: 'face_cropper by usgmathe',
  description: 'UsgMathe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="select-none">{children}</body>
    </html>
  )
}
