import Link from 'next/link';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';

export const metadata = {
  title: '404 - Страницата не е намерена',
  description: 'Търсената от вас страница не съществува',
};

export default function NotFound() {
  return (
    <Section padding="lg">
      <Container>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: 'bold',
            color: '#0066cc',
            marginBottom: '1rem',
          }}>
            404
          </h1>
          
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
          }}>
            Страницата не е намерена
          </h2>
          
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            fontSize: '1.125rem',
          }}>
            За съжаление търсената от вас страница не съществува или е била преместена.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Button href="/" variant="primary">
              Към начална страница
            </Button>
            <Button href="/blog/" variant="outline">
              Разгледай блога
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}



