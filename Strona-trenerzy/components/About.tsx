import React from 'react';
import { Award, Target, Zap } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 scroll-mt-32 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-800 relative z-10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1887&auto=format&fit=crop" 
                alt="Trener Personalny" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Stats Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-brand-500 p-6 rounded-2xl z-20 shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="text-zinc-950">
                  <p className="text-4xl font-black">10+</p>
                  <p className="text-xs font-bold uppercase">Lat doświadczenia</p>
                </div>
                <Award size={32} className="text-zinc-950 opacity-20" />
              </div>
            </div>
          </div>

          <div>
            <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">Poznaj mnie lepiej</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-8">
              {currentTrainer.aboutHeading}
            </h2>

            {currentTrainer.nicheLabel && (
              <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-brand-400">
                Segment: {currentTrainer.nicheLabel}
              </p>
            )}
            
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                Nazywam sie {currentTrainer.fullName}. Pracuje z osobami, ktore chca poprawic sylwetke, kondycje i zdrowie bez przypadkowych metod.
              </p>
              <p>
                {currentTrainer.aboutText}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-900 rounded-lg text-brand-500">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Precyzyjny Cel</h4>
                  <p className="text-xs text-zinc-500">Skupiamy się na tym, co dla Ciebie najważniejsze.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-900 rounded-lg text-brand-500">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Maksimum Energii</h4>
                  <p className="text-xs text-zinc-500">Treningi dobrane tak, by napędzać Twój dzień.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
