// D:\adfinder\frontend\adfinder\app\layout.tsx
import "./globals.css";

import Header from '../components/header/Header';
import Footer from '../components/Footer';

import PopupAd from "./ads/PopupAd";
import BottomAd from "./ads/BottomAd";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}