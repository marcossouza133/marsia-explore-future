import { useEffect, useRef, useState } from "react";
import { AudioLines, ChevronRight, Hexagon, Play } from "lucide-react";

const INTRO_SEEN_KEY = "marsia-intro-seen";
const INTRO_AUDIO = "https://uhnzzzlgjyslletmwyws.supabase.co/storage/v1/object/public/audio%20inicio%20projeto%20marte/audio_marte_entrada.mpeg";
const signals = ["SINAL DETECTADO", "COORDENADAS LOCALIZADAS", "TERRITÓRIO IDENTIFICADO"];

export function MarsiaIntro({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const timersRef = useRef<number[]>([]);
  const [visible, setVisible] = useState(active);
  const [leaving, setLeaving] = useState(false);
  const [started, setStarted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
      document.body.style.overflow = "";
    };
  }, [active]);

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      onComplete();
    }, 850);
  };

  const begin = async () => {
    if (started) return;
    setStarted(true);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.62;
      try {
        await audio.play();
        setAudioMuted(false);
      } catch {
        setAudioMuted(true);
      }
    }

    signals.forEach((_, index) => {
      timersRef.current.push(window.setTimeout(() => setRevealed(index + 1), 1500 + index * 1500));
    });
    timersRef.current.push(window.setTimeout(() => finish(), 7000));
  };

  const retryAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setAudioMuted(false);
    } catch {
      setAudioMuted(true);
    }
  };

  if (!active || !visible) return null;

  return (
    <div className={`marsia-intro ${leaving ? "marsia-intro-leaving" : ""}`} role="dialog" aria-label="Inicialização da MARSIA">
      <audio ref={audioRef} src={INTRO_AUDIO} preload="auto" />
      <div className="marsia-intro-grid" aria-hidden="true" />
      <div className="marsia-intro-scan" aria-hidden="true" />

      <button type="button" className="marsia-intro-skip" onClick={finish}>
        Pular experiência <ChevronRight size={14} />
      </button>

      <div className="marsia-intro-core">
        <div className="marsia-intro-mark" aria-hidden="true"><Hexagon size={38} strokeWidth={1.25} /></div>
        <div className="marsia-intro-kicker">Protocolo de exploração // 01</div>
        <div className="marsia-intro-logo">MARSIA</div>

        <div className="marsia-intro-loader" aria-label="Carregando experiência"><span /></div>

        {!started ? (
          <button type="button" className="marsia-intro-start" onClick={begin}>
            <Play size={16} /> INICIAR EXPLORAÇÃO
          </button>
        ) : (
          <>


            <div className="marsia-intro-signals" aria-live="polite">
              {signals.map((signal, index) => (
                <div key={signal} className={index < revealed ? "is-revealed" : ""}>
                  <span aria-hidden="true" /> {signal}
                </div>
              ))}
            </div>

            {audioMuted && (
              <button type="button" className="marsia-intro-start" onClick={retryAudio}>
                <AudioLines size={16} /> TOQUE PARA ATIVAR O ÁUDIO
              </button>
            )}
          </>
        )}
      </div>

      <div className="marsia-intro-coordinates" aria-hidden="true">04°30′S / 135°54′E<br />ELYSIUM PLANITIA</div>
    </div>
  );
}

export function hasSeenMarsiaIntro() {
  return localStorage.getItem(INTRO_SEEN_KEY) === "true";
}
