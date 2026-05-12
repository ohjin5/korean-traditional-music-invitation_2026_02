/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Static files:
// public/img/janggu.png
// public/img/background2.png
// public/media/bgm.mp3

import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Music, ChevronRight, Flower, Phone, Share2, VolumeX, Navigation, Bus, Train, Car } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Static Asset Paths
const BGM_URL = '/media/bgm.mp3';
const JANGGU_IMAGE_URL = '/img/janggu.png';
const HERO_BACKGROUND_URL = '/img/background2.png';
const BGM_ICON_URL = '/img/bgmicon.png';
const MAIN_LOGO_URL = '/img/logo.png';

const PROGRAM = [
  "Prince of Jeju",
  "민요의 향연",
  "시르렁실근",
  "문어의 꿈",
  "웃다리 사물놀이",
  "K-POP Medley",
  "축제"
];

const STAFF = [
  { role: "예술감독 겸 지휘자", name: "박상진", highlight: true },
  { role: "가야금", name: "공채린" },
  { role: "거문고", name: "김채운" },
  { role: "해금", name: "조소연" },
  { role: "아쟁", name: "김명신" },
  { role: "대금", name: "오혁" },
  { role: "피리", name: "송송이" },
  { role: "타악", name: "정예빈" },
  { role: "사물놀이", name: "김서진" },
  { role: "협연", name: "야금야금" },
];

const MEMBERS = [
  {
    instrument: "가야금",
    names: "김나루 김야엘 박서윤 박서현 배지원 원혜인 이예안 이예지 이지수 이채민 임윤서 양서하 홍은솔"
  },
  {
    instrument: "해금",
    names: "김무찬 김예준 김하율 문서연 윤채린 이경하 이유신 이채윤 장재이 장재영 정유안 진나연 최하은 한가은 현채이 김하은"
  },
  {
    instrument: "거문고",
    names: "곽서율 고현 김다솜 김은서 박서윤 윤이나 이인준 이지원 정승안 정은아"
  },
  {
    instrument: "타악",
    names: "강수아 김다윗 김도운 김지율 문은서 박소율 박연우 배성윤 송은석 오하린 이상훈 이유정 정한비 황서희"
  },
  {
    instrument: "피리",
    names: "김예탁 김채율 김하진 윤수인 윤수현 장이현 최윤 한유은 고찬희"
  },
  {
    instrument: "대금",
    names: "강석연 김윤서 박준서 박지언 배서우 염동윤 이정훈 최원 홍장혁"
  },
  {
    instrument: "아쟁",
    names: "곽서효 김하윤 김현성"
  },
  {
    instrument: "특별단원",
    names: "김지율"
  }
];

const MEMBER_ICON_MAP: Record<string, string> = {
  가야금: "/img/가야금.png",
  해금: "/img/해금.png",
  거문고: "/img/거문고.png",
  타악: "/img/타악.png",
  피리: "/img/피리.png",
  대금: "/img/대금.png",
  아쟁: "/img/아쟁.png",
  특별단원: "/img/특별.png",
};

const GALLERY_IMAGES = Array.from(
  { length: 14 },
  (_, i) => `/img/gallery/photo${i + 1}.jpg`
);

const IMAGES_INIT = GALLERY_IMAGES.slice(0, 4);
const IMAGES_POOL_INIT = GALLERY_IMAGES.slice(4);

const RSVP_LINK = "https://naver.me/58q3vwX1";

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
  const [displayImages, setDisplayImages] = useState<string[]>(IMAGES_INIT);
  const poolRef = useRef<string[]>(IMAGES_POOL_INIT);
  const failedImagesRef = useRef<Set<string>>(new Set());
  const [failedImagesState, setFailedImagesState] = useState<Set<string>>(new Set());
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Preload images
  useEffect(() => {
    GALLERY_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onerror = () => {
        failedImagesRef.current.add(src);
        setFailedImagesState(prev => new Set(prev).add(src));
      };
    });
  }, []);

  // Gallery Rotation Logic: Swap one slot every 5.5s
  useEffect(() => {
    const interval = window.setInterval(() => {
      // Pick a random slot (0-3)
      const slotIndex = Math.floor(Math.random() * 4);
      setFadingIndex(slotIndex);

      const swapTimer = window.setTimeout(() => {
        setDisplayImages((prev) => {
          const newImages = [...prev];
          const oldImage = newImages[slotIndex];

          // Duplication & Failure Check
          const visibleExceptCurrent = newImages.filter((_, idx) => idx !== slotIndex);
          const availablePool = poolRef.current.filter(
            (candidate) => 
              !visibleExceptCurrent.includes(candidate) && 
              !failedImagesRef.current.has(candidate)
          );

          if (availablePool.length === 0) return newImages;

          const selectedPoolIndex = Math.floor(Math.random() * availablePool.length);
          const newImage = availablePool[selectedPoolIndex];
          
          // Find the actual index in the real poolRef to perform the swap
          const realPoolIndex = poolRef.current.indexOf(newImage);

          newImages[slotIndex] = newImage;
          poolRef.current[realPoolIndex] = oldImage;

          return newImages;
        });
      }, 800);

      const fadeTimer = window.setTimeout(() => {
        setFadingIndex(null);
      }, 950);

      return () => {
        window.clearTimeout(swapTimer);
        window.clearTimeout(fadeTimer);
      };
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  // Scroll handler for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize and handle BGM
  useEffect(() => {
    audioRef.current = new Audio(BGM_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    const tryAutoPlay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        // Autoplay blocked is expected in many browsers. Silence to avoid clutter.
        setIsPlaying(false);
      }
    };

    tryAutoPlay();

    const handleFirstInteraction = async () => {
      if (!audioRef.current || isPlaying) return;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
      } catch (error) {
        console.log("Playback failed:", error);
      }
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

  const handleShare = () => {
    const shareData = {
      title: '제2회 천안청소년국악관현악단 정기연주회 초대장',
      text: '우리 소리의 따뜻한 숨결을 담아 여러분을 초대합니다.',
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setShowShareToast(true);
          setTimeout(() => setShowShareToast(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
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
        className={`fixed top-4 right-4 z-[130] w-[46px] h-[46px] rounded-full flex items-center justify-center border border-[#C9A46A]/30 transition-all duration-500 active:scale-95 shadow-lg
          ${isPlaying 
            ? 'bg-[#FDF9F3]/90 opacity-100 ring-2 ring-[#C9A46A]/40' 
            : 'bg-[#FDF9F3]/70 opacity-60 grayscale-[0.5]'
          }`}
        aria-label={isPlaying ? "배경음악 끄기" : "배경음악 켜기"}
      >
        <img 
          src={BGM_ICON_URL} 
          alt="배경음악" 
          className={`w-[38px] h-[38px] object-contain pointer-events-none ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : 'animate-none'}`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Subtle glow for playing state */}
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-[#C9A46A] rounded-full blur-md -z-10"
          />
        )}
      </button>

      {/* 2. Hero Section (Poster Style) */}
      <header className="relative z-10 w-full min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-start pt-14 md:pt-20 pb-12 md:pb-16 overflow-hidden bg-[#FDF9F3] transition-all">
        
        {/* Base Poster Background Layer: Transitions from poster-orange to paper-ivory */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FA9A54] via-[#FA9A54] to-[#FDF9F3] overflow-hidden">
          {/* Subtle noise or texture for paper feel */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
          {/* Main Background Image - Carefully Scaled and Positioned */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute inset-0 z-[1] flex items-center justify-center pt-0"
          >
            <div className="absolute inset-0 bg-black/5 z-[2] pointer-events-none" />
            <img 
              src={HERO_BACKGROUND_URL} 
              alt="천안청소년국악관현악단 정기연주회" 
              className="w-full h-full object-cover scale-[1.08] sm:scale-100 object-[center_-5%] sm:object-[center_5%] md:object-top opacity-90 transition-all duration-1000"
              onError={() => {
                console.warn("Hero background failed to load:", HERO_BACKGROUND_URL);
              }}
            />
          </motion.div>

          {/* Decorative Corner Ornaments (Traditional feel) */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-20 rotate-0 mix-blend-multiply pointer-events-none">
            <Flower size={120} className="text-white/40" strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-40 right-[-20px] w-48 h-48 opacity-15 rotate-12 mix-blend-overlay pointer-events-none">
            <Flower size={180} className="text-white/40" strokeWidth={0.5} />
          </div>

          {/* Specialized Overlays for Poster Vibe & Legibility */}
          <div className="absolute inset-x-0 top-0 h-40 z-[5] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
          
          {/* Enhanced Bottom Blending: Multi-step gradient for smoother transition to the main background */}
          <div className="absolute inset-x-0 bottom-0 h-[65%] z-[6] bg-gradient-to-t from-[#FDF9F3] via-[#FDF9F3]/90 via-[#FA9A54]/60 to-transparent pointer-events-none" />
          
          {/* Soft Radial Glow: Specifically placed to illuminate the area behind the info card */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[150%] h-[50%] z-[6] bg-[radial-gradient(circle_at_center,rgba(250,154,84,0.3)_0%,rgba(253,249,243,0)_70%)] blur-3xl pointer-events-none opacity-80" />

          {/* NEW: Subtle Decorative Motifs at the bottom gap area */}
          <div className="absolute bottom-0 left-0 w-full h-[45%] z-[7] pointer-events-none overflow-hidden opacity-[0.08]">
            <div className="absolute bottom-10 left-[15%] rotate-[-15deg]">
              <Flower size={150} className="text-white" strokeWidth={0.3} />
            </div>
            <div className="absolute bottom-32 right-[10%] rotate-[25deg]">
              <Flower size={120} className="text-white" strokeWidth={0.3} />
            </div>
            {/* Traditional Geometric Circles Pattern */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-white/20" />
            <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full border border-white/10" />
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[240px] h-[240px] rounded-full border border-white/5" />
          </div>
          
          {/* Seamless bridge to the body background - eliminats any abrupt color changes */}
          <div className="absolute inset-x-0 bottom-0 h-48 z-[8] bg-gradient-to-t from-[#FDF9F3] via-[#FDF9F3]/80 to-transparent pointer-events-none" />
        </div>
        
        {/* Janggu (Ancient Instrument) Silhouette - Refined placement */}
        <div className="absolute inset-0 z-[2] overflow-hidden opacity-[0.05] select-none pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 2.5 }}
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center"
          >
            <img 
              src={JANGGU_IMAGE_URL} 
              alt="" 
              className="w-[85%] h-auto object-contain brightness-0"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </motion.div>
        </div>
 
        {/* Content Layer */}
        <div className="relative z-10 w-full px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-4 md:mb-8 flex flex-col items-center"
          >
            <p className="text-[11px] md:text-[13px] font-bold tracking-[0.25em] text-[#FFF8EF] drop-shadow-md mb-2">
              천안청소년국악관현악단
            </p>
            <p className="text-[11px] md:text-[14px] font-bold tracking-[0.3em] text-white drop-shadow-lg opacity-90">
              제2회 정기연주회
            </p>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center mb-8 md:mb-12 relative"
          >
            {/* Subtle radial glow behind title */}
            <div className="absolute inset-0 blur-3xl bg-navy/30 -z-10 scale-150" />
            
            <h1 
              className="text-7xl md:text-9xl font-serif font-black text-[#FFF8EF] leading-none tracking-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
            >
              靑 溫
            </h1>
            <span className="text-lg md:text-xl font-sans tracking-[0.6em] md:tracking-[0.8em] text-[#FFF8EF] mt-3 md:mt-4 font-bold drop-shadow-lg">청 : 온</span>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mb-10 md:mb-16 relative flex items-center justify-center text-[#FFF7EA] font-serif w-full max-w-[320px] md:max-w-none"
          >
            <div className="relative z-10 flex flex-col items-center justify-center text-[16px] md:text-[18px] leading-[1.8] md:leading-[1.9] break-keep font-bold px-4 md:px-10 py-5 md:py-6 -translate-y-0.5 whitespace-nowrap md:whitespace-normal" style={{ textShadow: '0 2px 12px rgba(10,20,60,0.6)' }}>
              <p className="m-0">깊어가는 계절,</p>
              <p className="m-0">우리 소리의 따뜻한 숨결을 담아</p>
              <p className="m-0">여러분을 초대합니다.</p>
            </div>
          </motion.div>
 
          {/* Unified Info Card (Date, Location, Logo) */}
          <div className="relative w-full flex justify-center mt-8 md:mt-12 group">
            {/* Ambient Radial Glow centered behind the card info area */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(253,249,243,0.95)_0%,rgba(250,154,84,0.15)_60%,transparent_100%)] blur-2xl opacity-60 pointer-events-none z-0" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="relative z-10 w-[82%] max-w-[330px] rounded-[28px] bg-[#FFF9F0]/95 border border-[#E8A46B]/20 shadow-[0_12px_32px_rgba(70,45,20,0.12)] px-6 py-7 flex flex-col items-center text-center"
            >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 md:gap-3 text-navy font-black text-[15px] md:text-[17px]">
                <Calendar size={16} className="text-[#C58A52]" />
                <span>2026. 6. 5.(금) 오후 7:00</span>
              </div>
            </div>
            
            <div className="w-10 h-px bg-[#D8C7B5] my-4" />
 
            <div className="flex flex-col items-center gap-3 text-navy font-bold leading-relaxed mb-6">
              <div className="flex items-start justify-center gap-2 text-[14px] md:text-[15px] px-2 text-center">
                <MapPin size={14} className="text-[#C58A52] mt-0.5 shrink-0" />
                <span className="break-keep leading-tight">천안시청소년복합커뮤니티센터</span>
              </div>
              <span className="text-base md:text-lg font-black text-apricot tracking-tight">대공연장</span>
            </div>

            <div className="w-full pt-6 border-t border-[#E8A46B]/15">
              <img 
                src={MAIN_LOGO_URL} 
                alt="천안시청소년복합커뮤니티센터" 
                className="w-[210px] max-w-[85%] mx-auto h-auto object-contain brightness-100 contrast-100"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          </motion.div>
        </div>
      </div>
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
              <p className="text-2xl font-serif text-navy leading-snug font-black break-keep">
                전통의 선율 위에<br />청춘의 꿈을 수놓습니다
              </p>
            </div>
            
            <div className="leading-[1.9] text-[15px] text-navy/80 space-y-10 break-keep px-2">
              <p className="font-medium">
                2025년 창단된 <span className="font-bold text-navy underline decoration-apricot/30 underline-offset-4 decoration-2">천안청소년국악관현악단</span>은 국악을 통해 예술적 감수성을 함양하고 실력을 키워가는 전문 청소년 예술단입니다.
              </p>
              <p className="font-medium">
                단원들이 열정으로 준비한 이 무대가 시민 여러분께는 국악의 멋과 감동을, 청소년들에게는 성취의 기쁨을 선사하는 자리가 되길 소망합니다.
              </p>
              <p className="font-medium">
                따뜻한 격려로 함께해 주시기 바랍니다.
              </p>
              
              <div className="pt-12 flex flex-col items-center opacity-90">
                <div className="w-6 h-[1px] bg-gold-antique/30 mb-6" />
                <p className="text-lg font-serif font-black text-navy tracking-normal">천안시청소년복합커뮤니티센터</p>
                <p className="text-base font-serif font-bold text-navy mt-2">관장 윤여숭 드림</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 4. Staff Introduction */}
        <motion.section {...fadeInUp} className="py-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-bold text-gold-antique uppercase tracking-[0.4em]">Staff</h2>
            <h3 className="text-2xl font-serif font-black text-navy">지휘자 및 강사진 소개</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Conductor Highlight */}
            {STAFF.filter(s => s.highlight).map((member, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm border border-gold-antique/20 rounded-[32px] p-8 text-center shadow-sm">
                <span className="text-[11px] font-bold text-apricot uppercase tracking-wider mb-2 block">{member.role}</span>
                <p className="text-2xl font-serif font-black text-navy">{member.name}</p>
              </div>
            ))}

            {/* Other Staff Members */}
            <div className="grid grid-cols-2 gap-3">
              {STAFF.filter(s => !s.highlight).map((member, idx) => (
                <div key={idx} className="bg-white/40 backdrop-blur-sm border border-gold-antique/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] font-bold text-navy/40 uppercase tracking-tight">{member.role}</span>
                  <p className="text-[15px] font-serif font-black text-navy">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 5. Members Introduction */}
        <motion.section {...fadeInUp} className="py-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-bold text-gold-antique uppercase tracking-[0.4em]">Members</h2>
            <h3 className="text-2xl font-serif font-black text-navy">단원 소개</h3>
          </div>

          <div className="grid gap-6">
            {MEMBERS.map((group, idx) => {
              const memberCount = group.names.trim().split(/\s+/).length;
              const formattedNames = group.names.trim().split(/\s+/).join(' · ');
              
              return (
                <div key={idx} className="rounded-[28px] bg-[#FFF9F0]/85 border border-[#E8A46B]/20 shadow-[0_8px_24px_rgba(70,45,20,0.06)] p-7 group hover:bg-[#FFF9F0] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xl font-extrabold text-[#14265A] font-serif">{group.instrument}</h4>
                      <p className="text-[11px] font-bold text-[#C58A52] tracking-wider">
                        {`단원 ${memberCount}명`}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[#FFF1DF] border border-[#E8A46B]/30 flex items-center justify-center shrink-0 shadow-inner">
                      <img 
                        src={MEMBER_ICON_MAP[group.instrument]} 
                        alt={`${group.instrument} 아이콘`}
                        className="w-12 h-12 object-contain drop-shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="my-5 h-px bg-[#E8A46B]/20 w-full" />
                  
                  <div className="space-y-1">
                    <p className="text-[14.5px] leading-[2.1] text-[#4A3A30] font-medium break-keep text-justify">
                      {formattedNames}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 6. Gallery Section */}
        <motion.section 
          {...fadeInUp} 
          id="gallery" 
          className="relative py-16 px-6"
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#C58A52] font-bold">
                Gallery
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#14265A] font-serif">
                갤러리
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5A4638] break-keep font-medium">
                연주회를 위해 흘린 땀방울, 그 빛나는 순간들
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {displayImages.map((src, index) => (
                <div 
                  key={`${src}-${index}`} 
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#FFF7EA] border border-[#E8A46B]/15 shadow-[0_6px_18px_rgba(70,45,20,0.08)]"
                >
                  {failedImagesState.has(src) && (
                    <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                      <span className="text-[9px] text-[#C58A52]/40 break-all leading-tight font-medium">
                        이미지를 불러올 수 없습니다
                        <br />
                        {src}
                      </span>
                    </div>
                  )}
                  <img 
                    src={src} 
                    alt={`갤러리 이미지 ${index + 1}`}
                    loading="eager"
                    className={`
                      w-full h-full object-cover
                      transition-opacity duration-700 ease-in-out
                      ${fadingIndex === index || failedImagesState.has(src) ? "opacity-0" : "opacity-100"}
                    `}
                    onError={() => {
                      console.warn("Gallery image failed to load:", src);
                      failedImagesRef.current.add(src);
                      setFailedImagesState(prev => new Set(prev).add(src));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 7. Program Section */}
        <motion.section {...fadeInUp} className="py-8 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-bold text-gold-antique uppercase tracking-[0.4em]">Program</h2>
            <h3 className="text-2xl font-serif font-black text-navy">프로그램</h3>
          </div>

          <div className="grid gap-4">
            {PROGRAM.map((song, idx) => (
              <div key={idx} className="program-card p-6 flex items-center justify-between group transition-colors hover:bg-white/60">
                <div className="flex items-center gap-4">
                  <span className="text-[15px] font-serif font-black text-gold-antique/60">{idx + 1}.</span>
                  <h4 className="text-[17px] font-serif font-black text-navy">{song}</h4>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="section-divider" />

        {/* 8. Venue Section */}
        <motion.section {...fadeInUp} className="py-12 space-y-12">
          <div className="space-y-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gold-antique/10 mb-2">
              <MapPin size={20} className="text-gold-antique" />
            </div>
            
            <div className="space-y-5">
              <h2 className="text-2xl font-serif font-black text-navy leading-relaxed tracking-tight break-keep text-center whitespace-normal px-4">
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
            <motion.button onClick={handleShare} whileTap={{ scale: 0.9 }} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gold-antique/5 text-gold-antique"><Share2 size={22} /></motion.button>
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
          </div>
        </footer>
      </main>

      {/* 8. Persistent RSVP Bar (Visible after Scroll) */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 z-[120] flex justify-center transition-all duration-500 ${showStickyCTA ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={showStickyCTA ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_12px_45px_rgba(0,0,0,0.08)] rounded-[30px] p-4 pr-5 flex items-center justify-between"
        >
          <div className="flex flex-col gap-0.5 px-3">
            <span className="text-[9px] font-bold text-gold-antique uppercase tracking-[0.2em] opacity-60">Admission Free</span>
            <span className="text-[16px] font-black text-ink tracking-tight">사전 관람권 신청</span>
          </div>
          <a 
            href={RSVP_LINK}
            target="_blank"
            rel="noreferrer"
            className="bg-apricot text-white font-black h-12 px-8 rounded-2xl shadow-xl shadow-apricot/20 active:scale-95 transition-all text-sm tracking-tight flex items-center justify-center cursor-pointer"
          >
            신청하기
          </a>
        </motion.div>
      </div>

      {/* 9. Share Link Toast Message */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="fixed left-1/2 bottom-[110px] z-[200] px-6 py-3 bg-[#1F2A5A]/90 backdrop-blur-md border border-white/10 text-[#FFF7EA] text-sm font-medium rounded-full shadow-2xl pointer-events-none whitespace-nowrap"
          >
            초대장 링크가 복사되었습니다.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
