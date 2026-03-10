import { motion } from 'motion/react';
import { ShieldCheck, RotateCcw, AlertCircle, Ban } from 'lucide-react';

const guarantees = [
  {
    icon: RotateCcw,
    title: 'Satysfakcja w pierwszym miesiącu',
    description: 'Wdrożenie prowadzimy etapami, aby już w pierwszym miesiącu uporządkować obieg dokumentów i komunikację.',
  },
  {
    icon: ShieldCheck,
    title: 'Polisa OC biura',
    description: 'Zakres i suma gwarancyjna polisy powinny być podane zgodnie z realnymi danymi klienta.',
  },
  {
    icon: AlertCircle,
    title: 'Odpowiedzialność umowna',
    description: 'Zakres odpowiedzialności określamy przejrzyście w umowie i procedurach współpracy.',
  },
  {
    icon: Ban,
    title: 'Minimalizacja ryzyka podatkowego',
    description: 'Pracujemy na aktualnych przepisach i procedurach kontrolnych, aby ograniczać ryzyko błędów i korekt.',
  },
];

export function Guarantees() {
  return (
    <section className="py-24 bg-slate-900 text-white" id="gwarancje">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Bezpieczeństwo przede wszystkim
          </h2>
          <p className="text-lg text-slate-400">
            Współpraca z nami to spokój i przewidywalność. Chronimy Twoją firmę na każdym etapie rozliczeń.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((item, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50 hover:bg-slate-800 transition-colors hover:border-blue-500/30 group"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
