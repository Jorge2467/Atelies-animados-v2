import React from 'react';
import { InstrumentGrid } from './components/InstrumentGrid';
import { CharacterLab } from './components/CharacterLab';

function App() {
  return (
    <div className="min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-neon-fuchsia/30 selection:text-white">
      {/* Pixar-style magical ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-neon-blue/10 blur-[120px]"></div>
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-neon-fuchsia/10 blur-[120px]"></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col min-h-screen items-center py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Magic Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Percussão Animada
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium">
            Toca, escuta e aprende ritmos mágicos.
          </p>
        </header>

        {/* Dynamic Grid */}
        <section className="w-full">
          <InstrumentGrid />
        </section>

        <section className="w-full">
          <CharacterLab />
        </section>

      </main>

    </div>
  );
}

export default App;
