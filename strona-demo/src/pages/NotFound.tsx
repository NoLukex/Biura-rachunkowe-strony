import { Link } from 'react-router-dom';
import { biuroPath } from '../data/biura/biuroRouting';

export function NotFound() {
  return (
    <section className="pt-28 pb-20 bg-slate-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Nie znaleziono strony</h1>
        <p className="text-slate-600 mb-8">Ten adres nie istnieje albo został przeniesiony.</p>
        <Link
          to={biuroPath('/')}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </section>
  );
}
