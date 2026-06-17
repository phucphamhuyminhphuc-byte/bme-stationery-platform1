import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BME Stationery Platform',
  description: 'Nền tảng mạng xã hội và thương mại điện tử cho ngành Y sinh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}