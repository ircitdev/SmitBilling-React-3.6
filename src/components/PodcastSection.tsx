import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MEDIA_URLS } from '../data/landingData';

export const PodcastSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((e) => console.log('Audio play error', e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section id="podcast" className="py-14 sm:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Hidden HTML5 Audio Element */}
          <audio ref={audioRef} src={MEDIA_URLS.podcastAudio} preload="metadata" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Podcast Cover Artwork */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 border border-slate-700/60 bg-slate-800 flex items-center justify-center group">
              <img
                src="https://storage.googleapis.com/uspeshnyy-projects/smit/license/modules/screens/reports_1.jpg"
                alt="Подкаст СмИТ Биллинг"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold w-fit">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>SPECIAL EPISODE</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Подкаст</div>
                  <div className="text-sm font-extrabold text-white">СмИТ Биллинг</div>
                </div>
              </div>
            </div>

            {/* Controls & Track Info */}
            <div className="flex-1 w-full flex flex-col justify-between">
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Аудиовыпуск для операторов связи</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  СОРМ-3, миграция без простоя и экономика биллинга
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Эксперты по телеком-инфраструктуре обсуждают приказ Минцифры №573, интеграцию с АТОЛ Онлайн и подводные камни смены софта.
                </p>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1 mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Перемотка подкаста"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Button Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                    className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  {/* Dynamic Equalizer Bars */}
                  <div className="flex items-center gap-1 h-6 px-3 rounded-lg bg-slate-800/80 border border-slate-700/50">
                    {[16, 24, 12, 20, 28, 14, 22].map((height, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{ height: isPlaying ? `${height}px` : '6px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
