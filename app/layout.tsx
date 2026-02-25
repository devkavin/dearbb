import type { Metadata } from 'next';
import ClickSoundLayer from '@/components/ClickSoundLayer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Dear bb',
  description: 'A tiny love quest for Jhanvi'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClickSoundLayer />
        {children}
      </body>
    </html>
  );
}
