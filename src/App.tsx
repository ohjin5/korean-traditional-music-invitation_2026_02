/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Music, ChevronRight, Flower, Phone, Info, Share2, VolumeX, Navigation, Bus, Train, Car } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// BGM Path: /media/bgm.mp3 (Ensure this file exists in public/media/bgm.mp3)
const BGM_URL = '/media/bgm.mp3';

const PROGRAM = {
  part1: [
    { title: '거문고', songs: '홀로아리랑, 출강' },
    { title: '해금', songs: '에델바이스, 학교가는길' },
    { title: '가야금', songs: '언제나 몇 번이라도, Summer' },
    { title: '타악', songs: '웃다리 사물놀이' },
  ],
  part2: [
    { title: 'Fly to the Sky', songs: 'Full Orchestra' },
    { title: '민요의 향연', songs: 'Full Orchestra' },
    { title: 'Carol Medley', songs: 'Full Orchestra' },
  ]
};

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true, margin: "-50px" }
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize and handle BGM
  useEffect(() => {
    audioRef.current = new Audio(BGM_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log("Autoplay blocked:", err));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  const toggleBGM = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div ref={containerRef} className="invitation-container hanji-texture relative min-h-screen flex flex-col items-center">
      
      {/* 0. Background Aesthetics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full traditional-grid" />
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-apricot/5 to-transparent" />
        <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-gold-soft/15 rounded-full watercolor-blur" />
        <div className="absolute bottom-[20%] left-[-15%] w-80 h-80 bg-apricot-soft/20 rounded-full watercolor-blur" />
      </div>

      {/* 1. BGM Toggle (Fixed Top-Right) */}
      <button
        onClick={toggleBGM}
        className="fixed top-6 right-6 z-[130] w-10 h-10 bg-white/70 backdrop-blur-md rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center border border-gold-antique/20 active:scale-90 transition-all"
        aria-label="Toggle Background Music"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Music size={16} className="text-apricot" />
            </motion.div>
          ) : (
            <motion.div key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VolumeX size={16} className="text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* 2. Hero Section */}
      <header className="relative z-10 w-full pt-32 pb-24 px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mb-10 opacity-60"
        >
          <Flower className="text-gold-antique w-8 h-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold-antique uppercase opacity-70">Cheonan Youth Traditional Orchestra</span>
            <div className="w-8 h-[1px] bg-gold-antique/20 mx-auto mt-4" />
            <p className="text-[13px] font-bold text-hanji-brown/60 tracking-widest mt-4">제2회 정기연주회</p>
          </div>

          <h1 className="flex flex-col items-center gap-1 group py-4">
            <span className="text-8xl font-serif font-black text-ink tracking-tight">靑 溫</span>
            <span className="text-lg font-sans tracking-[0.5em] text-hanji-brown/80 ml-[0.5em] font-medium">청 : 온</span>
          </h1>

          <div className="py-6 space-y-3 text-[16px] font-serif text-ink leading-[1.8] break-keep font-medium">
            <p>깊어가는 계절,</p>
            <p>우리 소리의 따뜻한 숨결을 담아</p>
            <p>여러분을 초대합니다.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 w-full max-w-[320px] space-y-6"
        >
          <div className="bg-white/40 backdrop-blur-sm border border-gold-antique/10 py-5 px-8 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-center gap-3 text-ink font-bold text-[15px]">
              <Calendar size={15} className="text-gold-antique" />
              <span>2026. 6. 5.(금) 오후 7:00</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 text-ink/60 text-[13px] font-medium break-keep leading-relaxed">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-gold-antique" />
              <span>천안시청소년복합커뮤니티센터</span>
            </div>
            <span className="font-bold text-ink">대공연장</span>
          </div>
        </motion.div>
      </header>

      {/* 3. Invitation Body Section */}
      <main className="relative z-10 w-full px-8 pb-40">
        
        <motion.section {...fadeInUp} className="py-20 flex flex-col items-center">
          <div className="text-center space-y-12 w-full">
            <div className="space-y-4">
              <h2 className="text-[9px] font-bold text-gold-antique uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                <span className="w-6 h-[0.5px] bg-gold-antique/30" />
                Invitation
                <span className="w-6 h-[0.5px] bg-gold-antique/30" />
              </h2>
              <p className="text-2xl font-serif text-ink leading-snug font-black break-keep">
                전통의 선율 위에<br />청춘의 꿈을 수놓습니다
              </p>
            </div>
            
            <div className="leading-[1.9] text-[15px] text-ink/80 space-y-10 break-keep px-2">
              <p className="font-medium">
                2025년 창단된 <span className="font-bold text-ink underline decoration-apricot/30 underline-offset-4 decoration-2">천안청소년국악관현악단</span>은 국악을 통해 예술적 감수성을 함양하고 실력을 키워가는 전문 청소년 예술단입니다.
              </p>
              <p className="font-medium">
                단원들이 열정으로 준비한 이 무대가 시민 여러분께는 국악의 멋과 감동을, 청소년들에게는 성취의 기쁨을 선사하는 자리가 되길 소망합니다.
              </p>
              <p className="font-medium">
                따뜻한 격려로 함께해 주시기 바랍니다.
              </p>
              
              <div className="pt-12 flex flex-col items-center opacity-90">
                <div className="w-6 h-[1px] bg-gold-antique/30 mb-6" />
                <p className="text-lg font-serif font-black text-ink tracking-normal">천안시청소년복합커뮤니티센터</p>
                <p className="text-base font-serif font-bold text-ink mt-2">관장 윤여숭 드림</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 4. Program Section */}
        <motion.section {...fadeInUp} className="py-8 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gold-antique/10 pb-4">
              <h3 className="text-[11px] font-bold text-gold-antique uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-antique" /> Part I. 실내악 국악
              </h3>
            </div>
            
            <div className="grid gap-3">
              {PROGRAM.part1.map((item, idx) => (
                <div key={idx} className="program-card p-6 flex flex-col gap-2 group transition-colors hover:bg-white/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[17px] font-serif font-black text-ink">{item.title}</h4>
                    <span className="text-[9px] font-bold text-apricot tracking-widest uppercase opacity-60">Solo/Ensemble</span>
                  </div>
                  <div className="h-[1px] bg-gold-antique/5 w-full" />
                  <p className="text-[14px] text-ink/70 font-medium break-keep leading-relaxed italic">{item.songs}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gold-antique/10 pb-4">
              <h3 className="text-[11px] font-bold text-ink/40 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-ink/20" /> Part II. 국악 관현악
              </h3>
            </div>
            
            <div className="grid gap-3">
              {PROGRAM.part2.map((item, idx) => (
                <div key={idx} className="program-card p-6 flex items-center justify-between group hover:bg-white/60 transition-all">
                  <h4 className="text-[17px] font-serif font-black text-ink">{item.title}</h4>
                  <span className="text-[10px] font-bold text-ink/30 italic uppercase tracking-wider">Full Orchestra</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 5. Special Guest Section */}
        <motion.section {...fadeInUp} className="py-8">
          <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[40px] border border-gold-antique/10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] transition-opacity duration-700">
              <Music size={120} />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-apricot uppercase tracking-widest">Special Guest</span>
                <div className="flex-1 h-[1px] bg-apricot/15" />
              </div>
              <div className="space-y-2">
                <p className="text-[15px] font-bold text-apricot/80 italic decoration-apricot/20 underline-offset-4">가야금 유튜버 <span className="text-ink font-serif font-black">야금야금</span></p>
                <h3 className="text-3xl font-serif font-black text-ink tracking-tight">가야금 협연</h3>
              </div>
              <p className="text-[14px] text-ink/70 leading-relaxed break-keep font-medium">
                전통 가야금의 선율에 현대적 감각을 더해 대중과 화발히 소통하는 아티스트 '야금야금'이 단원들과 함께 특별한 조화를 선보입니다.
              </p>
            </div>
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 6. Venue Section */}
        <motion.section {...fadeInUp} className="py-12 space-y-12">
          <div className="space-y-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gold-antique/10 mb-2">
              <MapPin size={20} className="text-gold-antique" />
            </div>
            
            <div className="space-y-5">
              <h2 className="text-2xl font-serif font-black text-ink leading-relaxed tracking-tight break-keep text-center whitespace-normal px-4">
                <span className="block">천안시청소년복합커뮤니티센터</span>
                <span className="text-apricot">대공연장</span>
              </h2>
            </div>

            <div className="w-full pt-10 space-y-4">
              <motion.a 
                href="https://map.naver.com/p/search/천안시청소년복합커뮤니티센터"
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.98 }}
                className="btn-nav bg-[#03C75A] text-white shadow-lg shadow-green-600/5 text-base"
              >
                <span className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-[#03C75A] text-[10px] font-black">N</span>
                네이버 지도 보기
              </motion.a>
              
              <motion.a 
                href="https://map.kakao.com/link/search/천안시청소년복합커뮤니티센터"
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.98 }}
                className="btn-nav bg-[#FEE500] text-[#3E2723] shadow-lg shadow-yellow-600/5 text-base"
              >
                <Navigation size={18} fill="currentColor" />
                카카오내비 안내
              </motion.a>

              <div className="w-full pt-12 pb-4">
                <h3 className="text-[10px] font-bold text-gold-antique uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                  <div className="w-4 h-[1px] bg-gold-antique/20" />
                  Transportation
                  <div className="w-4 h-[1px] bg-gold-antique/20" />
                </h3>
              </div>
              
              <div className="w-full grid gap-4 pt-4">
                <div className="bg-white/30 backdrop-blur-sm border border-gold-antique/10 p-6 rounded-2xl flex flex-col items-center gap-4 group transition-all hover:bg-white/40">
                  <div className="w-10 h-10 rounded-full bg-apricot/10 flex items-center justify-center text-apricot group-hover:bg-apricot/20 transition-colors">
                    <Bus size={18} />
                  </div>
                  <div className="text-center space-y-1.5">
                    <h4 className="text-[14px] font-bold text-ink">버스 이용 시</h4>
                    <p className="text-[13px] text-ink/70 leading-relaxed break-keep">
                      천안버스터미널 하차 후<br />
                      <span className="text-apricot font-bold">90번 버스</span> 이용
                    </p>
                  </div>
                </div>

                <div className="bg-white/30 backdrop-blur-sm border border-gold-antique/10 p-6 rounded-2xl flex flex-col items-center gap-4 group transition-all hover:bg-white/40">
                  <div className="w-10 h-10 rounded-full bg-gold-antique/10 flex items-center justify-center text-gold-antique group-hover:bg-gold-antique/20 transition-colors">
                    <Train size={18} />
                  </div>
                  <div className="text-center space-y-1.5">
                    <h4 className="text-[14px] font-bold text-ink">지하철 이용 시</h4>
                    <p className="text-[13px] text-ink/70 leading-relaxed break-keep">
                      1호선 <span className="text-ink font-bold">천안역</span> 하차 후<br />
                      천안역 서부광장 <span className="text-apricot font-bold">6번 버스</span> 이용
                    </p>
                  </div>
                </div>

                <div className="bg-white/30 backdrop-blur-sm border border-gold-antique/10 p-6 rounded-2xl flex flex-col items-center gap-4 group transition-all hover:bg-white/40">
                  <div className="w-10 h-10 rounded-full bg-hanji-brown/10 flex items-center justify-center text-hanji-brown group-hover:bg-hanji-brown/20 transition-colors">
                    <Car size={18} />
                  </div>
                  <div className="text-center space-y-1.5">
                    <h4 className="text-[14px] font-bold text-ink">자가 이용 시</h4>
                    <p className="text-[13px] text-ink/70 leading-relaxed break-keep">
                      천안IC → 삼성대로 →<br />
                      번영로 → 음봉로
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gold-soft/10 p-6 rounded-2xl border border-gold-antique/5">
                <p className="text-[13px] text-ink/60 font-medium leading-[1.8] break-keep">
                  ※ 주차 공간이 협소하오니 가급적<br />
                  <span className="text-apricot font-extrabold text-sm">대중교통</span>을 이용해 주시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 7. Footer Section */}
        <footer className="mt-24 pt-24 pb-20 space-y-16 text-center border-t border-gold-antique/10">
          <div className="flex justify-center gap-12">
            <motion.a href="tel:041-557-0924" whileTap={{ scale: 0.9 }} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gold-antique/5 text-gold-antique"><Phone size={22} /></motion.a>
            <motion.button whileTap={{ scale: 0.9 }} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gold-antique/5 text-gold-antique"><Share2 size={22} /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gold-antique/5 text-gold-antique"><Info size={22} /></motion.button>
          </div>
          
          <div className="space-y-12 px-2">
            <div className="space-y-8 text-[14px] text-ink/60 font-medium leading-loose bg-white/20 py-12 rounded-[40px] border border-white/40">
              <div className="space-y-3">
                <p><span className="opacity-40 font-bold">주관 —</span> <span className="text-ink/80 font-black">천안시청소년복합커뮤니티센터</span></p>
                <div className="flex flex-col items-center mt-6">
                  <span className="text-[10px] opacity-30 font-bold uppercase tracking-widest mb-2">Inquiry</span>
                  <a href="tel:041-557-0924" className="text-2xl font-black text-apricot underline decoration-apricot/15 underline-offset-8">041-557-0924</a>
                </div>
              </div>
              <p className="pt-6 text-[12px] opacity-30 font-bold">©천안시청소년복합커뮤니티센터 교육사업팀</p>
            </div>

            <div className="pt-4 space-y-2 text-[10px] text-ink/20 font-bold italic tracking-tight">
              <p>BGM: 유민규 - bed (CC BY)</p>
              <p>바이올린 아이콘 제작자: Freepik - Flaticon</p>
            </div>

            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold-antique/20 italic pt-6">
              Cheonan Youth Korean Traditional Music Orchestra
            </p>
          </div>
        </footer>
      </main>

      {/* 8. Persistent RSVP Bar (Always Visible at Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[120] flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 80 }}
          className="w-full max-w-[400px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_12px_45px_rgba(0,0,0,0.08)] rounded-[30px] p-4 pr-5 flex items-center justify-between pointer-events-auto"
        >
          <div className="flex flex-col gap-0.5 px-3">
            <span className="text-[9px] font-bold text-gold-antique uppercase tracking-[0.2em] opacity-60">Admission Free</span>
            <span className="text-[16px] font-black text-ink tracking-tight">사전 관람권 신청</span>
          </div>
          <button className="bg-apricot text-white font-black h-12 px-8 rounded-2xl shadow-xl shadow-apricot/20 active:scale-95 transition-all text-sm tracking-tight">
            신청하기
          </button>
        </motion.div>
      </div>
    </div>
  );
}
