
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import SurveyForm from './components/SurveyForm';
import Dashboard from './components/Dashboard';
import { AppStep, SurveyData, GeneratedSong, ExampleSong } from './types';
import { generateLyrics, generateAlbumArt, generateSongAudio } from './services/geminiService';

const EXAMPLE_SONGS: ExampleSong[] = [
  { title: "Grandma's Golden Heart", recipient: "Grandma Rose", genre: "Gospel", coverUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=400&fit=crop" },
  { title: "Lagos Love Story", recipient: "Tunde & Ayo", genre: "Afrobeats", coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop" },
  { title: "Dreams of London", recipient: "Michael", genre: "UK Drill", coverUrl: "https://images.unsplash.com/photo-1526367790999-0150786486a2?w=400&h=400&fit=crop" },
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Landing);
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Initializing studio...");
  
  const examplesRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const startSurvey = () => setStep(AppStep.Survey);
  const resetApp = () => {
    setStep(AppStep.Landing);
    setCurrentSong(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: string) => {
    if (step !== AppStep.Landing) {
      setStep(AppStep.Landing);
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'how-it-works': howItWorksRef,
      'pricing': pricingRef,
      'examples': examplesRef
    };
    const target = refs[section]?.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSurveySubmit = async (data: SurveyData) => {
    setIsLoading(true);
    setStep(AppStep.Generating);
    
    try {
      setLoadingStatus("Writing your custom lyrics...");
      const lyricsResult = await generateLyrics(data);
      
      setLoadingStatus("Generating musical performance...");
      const [albumArt, audioData] = await Promise.all([
        generateAlbumArt(lyricsResult.title, data.genre, data.mood),
        generateSongAudio(lyricsResult.lyrics, data.genre, data.mood)
      ]);
      
      setLoadingStatus("Mastering your unique track...");
      
      setCurrentSong({
        id: Math.random().toString(36).substr(2, 9),
        title: lyricsResult.title,
        lyrics: lyricsResult.lyrics,
        coverImageUrl: albumArt,
        audioData: audioData,
        status: 'ready',
        surveyData: data
      });
      
      setStep(AppStep.Dashboard);
    } catch (error) {
      console.error("Error generating song:", error);
      alert("Composition failed. Please try again with different details.");
      setStep(AppStep.Survey);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      <Header onReset={resetApp} onNavigate={handleNavigate} />

      <main className="pt-24 pb-12">
        {step === AppStep.Landing && (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-32">
              <div className="inline-flex items-center space-x-2 px-6 py-2 bg-indigo-900 text-white rounded-full mb-10 shadow-xl border border-indigo-400/30">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Recording Studio 5.0</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase italic">
                Your Memories.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500">
                  Produced.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed italic">
                Transform personal stories into high-quality, rhythmic musical performances. Any genre. Any language. Pure emotion.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={startSurvey}
                  className="group relative px-14 py-7 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl hover:bg-indigo-700 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-2 active:translate-y-0"
                >
                  <span className="relative z-10 uppercase tracking-widest">Start Session</span>
                  <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </button>
                <button 
                  onClick={() => scrollToSection('examples')}
                  className="px-14 py-7 bg-white text-slate-900 border-4 border-slate-900 rounded-[2rem] font-black text-2xl hover:bg-slate-900 hover:text-white transition-all shadow-xl"
                >
                  View Archive
                </button>
              </div>
            </div>

            {/* How It Works Section */}
            <div ref={howItWorksRef} className="bg-white py-32 border-y border-slate-100 scroll-mt-24">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">The Studio Process</h2>
                  <div className="h-2 w-32 bg-indigo-600 mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {[
                    { step: "01", title: "Storytelling", text: "Fill out a quick survey about the recipient's life, your favorite memories, and the occasion." },
                    { step: "02", title: "Rhythmic Choice", text: "Select a genre that fits their soul—from melodic Afrobeats to soulful Gospel." },
                    { step: "03", title: "Production", text: "Our AI masters your lyrics and performs them rhythmically with vocal beats and melody." }
                  ].map((item, i) => (
                    <div key={i} className="relative p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                      <div className="text-7xl font-black text-indigo-600/10 absolute top-4 right-8 group-hover:text-indigo-600/20 transition-colors">{item.step}</div>
                      <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-slate-800">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Examples Section */}
            <div ref={examplesRef} className="max-w-7xl mx-auto px-4 py-32 scroll-mt-24">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Studio Favorites</h2>
                <div className="h-2 w-32 bg-rose-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {EXAMPLE_SONGS.map((song, i) => (
                  <div 
                    key={i} 
                    onClick={startSurvey}
                    className="group bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 cursor-pointer hover:-translate-y-4 transition-all duration-700"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img src={song.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={song.title} />
                      <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center text-white p-8 text-center">
                         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-2xl">
                          <svg className="w-10 h-10 fill-current translate-x-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest">Create Yours</span>
                      </div>
                    </div>
                    <div className="p-10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-widest">{song.genre}</span>
                      </div>
                      <h3 className="font-black text-3xl text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic">{song.title}</h3>
                      <p className="text-slate-400 font-bold text-sm tracking-wide">For {song.recipient}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div ref={pricingRef} className="bg-slate-900 py-32 text-white scroll-mt-24">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter italic">Production Pricing</h2>
                <div className="h-2 w-32 bg-amber-400 mx-auto rounded-full mb-16"></div>
                <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32"></div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight italic">Unlimited Studio Access</h3>
                  <div className="text-7xl font-black mb-8 text-amber-400 italic">$0 <span className="text-xl text-white/40 not-italic uppercase tracking-widest">LIMITED FREE ACCESS</span></div>
                  <ul className="text-left space-y-5 mb-12 max-w-sm mx-auto">
                    {["Full Personalization", "Rhythmic Performance", "Studio Artwork", "High-Quality WAV Export", "Ad-Free Generation"].map((feat, i) => (
                      <li key={i} className="flex items-center space-x-4">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                        <span className="font-bold text-xl opacity-80">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={startSurvey}
                    className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.4)]"
                  >
                    START PRODUCTION
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {step === AppStep.Survey && <SurveyForm onSubmit={handleSurveySubmit} />}

        {(step === AppStep.Generating || isLoading) && step !== AppStep.Dashboard && (
          <div className="max-w-2xl mx-auto text-center py-32 px-4">
            <div className="relative w-48 h-48 mx-auto mb-12">
               <div className="absolute inset-0 border-[10px] border-slate-100 rounded-[3rem]"></div>
              <div className="absolute inset-0 border-[10px] border-t-rose-500 border-r-indigo-600 rounded-[3rem] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-7xl animate-bounce">🎙️</div>
            </div>
            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter italic text-slate-900">{loadingStatus}</h2>
            <div className="space-y-6 max-w-sm mx-auto">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-rose-500 animate-[loading_4s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Recording session in progress...</p>
            </div>
          </div>
        )}

        {step === AppStep.Dashboard && currentSong && (
          <Dashboard 
            song={currentSong} 
            onEdit={() => setStep(AppStep.Survey)}
          />
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 2px solid white; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default App;
