
import React, { useState, useRef, useEffect } from 'react';
import { GeneratedSong } from '../types';
import { decodeBase64, decodeAudioData, pcmToWav } from '../services/audioService';

interface DashboardProps {
  song: GeneratedSong;
  onEdit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ song, onEdit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      stopAudio();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch(e) {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const updateProgress = () => {
    if (!audioContextRef.current || !audioBufferRef.current || !isPlaying) return;
    
    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    setCurrentTime(elapsed);
    const currentProgress = (elapsed / audioBufferRef.current.duration) * 100;
    
    if (currentProgress >= 100) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    } else {
      setProgress(currentProgress);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const initAudio = async () => {
    if (!song.audioData) return false;
    if (audioBufferRef.current) return true;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = ctx;

    const bytes = decodeBase64(song.audioData);
    const buffer = await decodeAudioData(bytes, ctx);
    audioBufferRef.current = buffer;
    setDuration(buffer.duration);
    return true;
  };

  const handleTogglePlay = async () => {
    if (!song.audioData) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    const ready = await initAudio();
    if (!ready || !audioContextRef.current || !audioBufferRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    
    startTimeRef.current = audioContextRef.current.currentTime;
    source.start(0);
    sourceNodeRef.current = source;
    setIsPlaying(true);
    animationFrameRef.current = requestAnimationFrame(updateProgress);

    source.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
  };

  const handleDownload = () => {
    if (!song.audioData) return;
    const bytes = decodeBase64(song.audioData);
    const blob = pcmToWav(bytes);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title.replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {/* Left: Professional Player */}
        <div className="md:col-span-1 space-y-6">
          <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl bg-black aspect-square border-4 border-white">
            <img 
              src={song.coverImageUrl} 
              className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-110 blur-[2px] opacity-70' : 'scale-100'}`}
              alt="Album Art"
            />
            
            {/* Studio Equalizer Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
              <div className="flex items-end justify-center gap-1.5 w-full h-full pb-12">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-white/60 rounded-full transition-all duration-150" 
                    style={{ 
                      height: isPlaying ? `${Math.random() * 90 + 10}%` : '4%',
                      opacity: isPlaying ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={handleTogglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all group/play"
            >
              <div className={`w-28 h-28 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white ring-8 ring-white/20 transform transition-all duration-300 ${isPlaying ? 'scale-90 opacity-40 group-hover/play:opacity-100' : 'scale-100 group-hover/play:scale-110'}`}>
                {isPlaying ? (
                  <svg className="w-14 h-14 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-14 h-14 fill-current translate-x-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Studio Playback</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 space-y-6 relative overflow-hidden">
             {/* Background glow when playing */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className="text-center relative">
              <h1 className="text-3xl font-black text-slate-800 leading-tight mb-2 uppercase tracking-tighter italic">{song.title}</h1>
              <div className="flex items-center justify-center space-x-3">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{song.surveyData.genre}</span>
                <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{song.surveyData.mood}</span>
              </div>
            </div>

            {/* Studio Seek Bar */}
            <div className="space-y-3 pt-4">
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden cursor-pointer group/seek">
                <div 
                  className="absolute h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-100 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                <span>{currentTime.toFixed(1)}s</span>
                <span className="text-slate-800">Master Track</span>
                <span>{duration.toFixed(1)}s</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={handleDownload}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all group"
              >
                <svg className="w-7 h-7 mb-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">HQ Download</span>
              </button>
              <button 
                onClick={() => {
                   const text = `I just produced a new ${song.surveyData.genre} hit called "${song.title}"! 🎤✨`;
                   navigator.clipboard.writeText(text);
                   alert("Share link copied to clipboard!");
                }}
                className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all group"
              >
                <svg className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Share Clip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Detailed Script */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-full min-h-[600px]">
            <div className="bg-slate-900 px-10 py-8 border-b border-white/10 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Production Script</h2>
                <p className="text-xl font-bold italic">Dedicated to {song.surveyData.recipientName}</p>
              </div>
              <button 
                onClick={onEdit}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-white/20"
              >
                REMIX / NEW
              </button>
            </div>
            <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <div className="space-y-6">
                {song.lyrics.split('\n').map((line, i) => {
                  if (!line.trim()) return null;
                  const isMarker = line.startsWith('[') || line.startsWith('(');
                  return (
                    <div key={i} className={`transition-all duration-500 ${isMarker ? "pt-4" : ""}`}>
                      <div className={isMarker ? "text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-3" : "text-slate-800 text-xl md:text-2xl font-medium leading-tight font-serif italic"}>
                        {line}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
