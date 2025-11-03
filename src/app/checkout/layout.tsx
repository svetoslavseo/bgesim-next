import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Проверка на поръчката',
  description: 'Проверка и потвърждение на поръчката за eSIM',
  alternates: {
    canonical: 'https://travelesim.bg/checkout/',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

