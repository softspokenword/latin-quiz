import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import ThemeProvider from '../components/ThemeProvider';

export const metadata = {
    title: {
        template: '%s | Latin Quiz',
        default: 'Latin Quiz - Practice Your Declensions'
    },
    description: 'Practice Latin declensions with interactive quizzes'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-white bg-blue-900">
                <ThemeProvider>
                    <div className="flex flex-col min-h-screen px-6 bg-noise sm:px-12">
                        <div className="flex flex-col w-full max-w-5xl mx-auto grow">
                            <Header />
                            <main className="grow">{children}</main>
                            <Footer />
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
