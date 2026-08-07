import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'AI-Store - فروشگاه هوشمند',
	description: 'جستجوی هوشمند لباس با هوش مصنوعی',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="fa" dir="rtl">
			<body>{children}</body>
		</html>
	);
}
