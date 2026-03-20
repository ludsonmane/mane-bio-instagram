import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, CalendarDays, Store, MapPin, Instagram, Phone } from "lucide-react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Mané – Bio de Instagram (Mobile-first)
 *
 * Como usar:
 * - Este componente é auto-contido. Cole em um projeto React/Next/Vite.
 * - Tailwind CSS recomendado (classes já inclusas). Se não usar Tailwind, adapte as classes.
 * - Edite os links no objeto LINKS abaixo.
 */

// Config carregada via JSON por rota (/ac, /sp, /bsb). Ao salvar o arquivo JSON, o site reflete a mudança.
// Exemplo de arquivo: /config/ac.json
// {
//   "logoUrl": "https://mane.com.vc/wp-content/uploads/2023/03/Camada-1.svg",
//   "instagram": "https://www.instagram.com/maneaguasclaras/",
//   "phone": "tel:+5561991264768",
//   "links": {
//     "cardapio": "https://menu.mane.com.vc/#/home",
//     "reservas": "https://reservas.mane.com.vc",
//     "restaurantes": "https://menu.mane.com.vc/#/restaurantes/home",
//     "localizacao": "https://maps.google.com/?q=Mané%20Águas%20Claras"
//   },
//   "pixel": {
//     "metaId": "1160688802149033",
//     "noscriptImg": "https://www.facebook.com/tr?id=1160688802149033&ev=PageView&noscript=1"
//     // OU use "code": "<script JS do pixel por cidade>"
//   }
// }

type BioConfig = {
  logoUrl: string;
  instagram: string;
  phone: string;
  links: {
    cardapio: string;
    reservas: string;
    restaurantes: string;
    localizacao: string;
  };
  pixel?: {
    metaId?: string;      // carrega fbevents.js e dispara PageView
    code?: string;        // injeta JS bruto (se preferir por cidade)
    noscriptImg?: string; // URL do <noscript><img /></noscript>
  };
};

const DEFAULTS: Record<string, BioConfig> = {
  ac: {
    logoUrl: "https://mane.com.vc/wp-content/uploads/2023/03/Camada-1.svg",
    instagram: "https://www.instagram.com/maneaguasclaras/",
    phone: "tel:+5561991264768",
    links: {
      cardapio: "https://menu.mane.com.vc/#/home",
      reservas: "https://reservas.mane.com.vc",
      restaurantes: "https://menu.mane.com.vc/#/restaurantes/home",
      localizacao: "https://maps.google.com/?q=Mané%20Águas%20Claras",
    },
    pixel: {
      metaId: "1160688802149033",
      noscriptImg: "https://www.facebook.com/tr?id=1160688802149033&ev=PageView&noscript=1",
    },
  },
  sp: {
    logoUrl: "https://mane.com.vc/wp-content/uploads/2023/03/Camada-1.svg",
    instagram: "",
    phone: "",
    links: {
      cardapio: "#",
      reservas: "#",
      restaurantes: "#",
      localizacao: "https://maps.google.com/?q=Mané%20São%20Paulo",
    },
    pixel: {},
  },
  bsb: {
    logoUrl: "https://mane.com.vc/wp-content/uploads/2023/03/Camada-1.svg",
    instagram: "",
    phone: "",
    links: {
      cardapio: "#",
      reservas: "#",
      restaurantes: "#",
      localizacao: "https://maps.google.com/?q=Mané%20Brasília",
    },
    pixel: {},
  },
};

function useConfig(city: string) {
  const [cfg, setCfg] = React.useState<BioConfig | null>(DEFAULTS[city] ?? null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/config/${city}.json`, { cache: 'no-store' });
        if (!res.ok) return; // mantém defaults
        const json = (await res.json()) as BioConfig;
        if (active) setCfg(json);
      } catch (_) {
        // mantém defaults em caso de erro
      }
    })();
    return () => { active = false; };
  }, [city]);
  return cfg;
}

// Paleta inspirada no mock
const COLORS = {
  teal: "#0A4B49",
  terracotta: "#D26C61",
  aqua: "#88C9D6",
  pink: "#D47BB1",
  yellow: "#F2C764",
};

// Faixa decorativa multicolor (repeating linear-gradient)
const Stripe = () => (
  <div
    aria-hidden
    className="h-2 w-full"
    style={{
      backgroundImage:
        "repeating-linear-gradient(90deg, #2C6B63 0 16px, #F2C764 16px 32px, #F4C2C2 32px 48px, #355C7D 48px 64px, #88C9D6 64px 80px, #D47BB1 80px 96px)",
    }}
  />
);

const Card = ({
  color,
  title,
  Icon,
  href,
  accent,
  textColor,
  commaColor,
}: {
  color: string;
  title: string;
  Icon: React.ElementType;
  href: string;
  accent?: string;
  textColor?: string;
  commaColor?: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block focus:outline-none"
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <div
      className="rounded-t-2xl p-5 sm:p-6 text-white shadow-lg"
      style={{ backgroundColor: color }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="grid place-items-center h-14 w-14 rounded-full shadow-md"
          style={{ backgroundColor: accent ?? COLORS.yellow }}
        >
          <Icon aria-hidden className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-black tracking-tight" style={{ color: textColor }}>
          {title}
          <span className="-ml-1 text-[1.25em] leading-none align-baseline" style={{ color: commaColor ?? '#E23B3B' }}>,</span>
        </h2>
      </div>
    </div>
    <Stripe />
  </motion.a>
);

function ManeBio({ city }: { city: string }) {
  const cfg = useConfig(city);
  if (!cfg) return null;

  // Pixel dinâmico por JSON
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const p = cfg.pixel;
    if (!p) return;

    // 1) Injetar código bruto, se existir
    if (p.code) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.defer = true;
      s.text = p.code;
      document.head.appendChild(s);
      return () => { document.head.removeChild(s); };
    }

    // 2) Fallback: Meta Pixel por ID
    if (p.metaId) {
      const w = window as any;
      if (typeof w.fbq !== 'function') {
        w.fbq = function (...args: any[]) { (w.fbq.q = w.fbq.q || []).push(args); };
        w._fbq = w.fbq; w.fbq.push = w.fbq; w.fbq.loaded = true; w.fbq.version = '2.0'; w.fbq.queue = [];
        const s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(s);
      }
      w.fbq('init', p.metaId);
      w.fbq('track', 'PageView');
    }
  }, [cfg.pixel]);

  return (
    <div className="min-h-[100dvh] bg-[#FBF5E9] text-slate-900 flex flex-col" style={{ fontFamily: "'Merriweather', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap');`}</style>
      {/* Header */}
      <header className="sticky top-0 z-10">
        <div
          className="w-full py-4 sm:py-5 shadow-md"
          style={{ backgroundColor: COLORS.teal }}
        >
          <div className="max-w-md mx-auto px-4">
            <div className="flex items-center justify-between text-white">
              <img src={cfg.logoUrl} alt="mané" className="h-8 sm:h-9 select-none" />
              <div className="flex items-center gap-3 opacity-90">
                <a aria-label="Instagram" href={cfg.instagram} target="_blank" rel="noreferrer" className="hover:opacity-100">
                  <Instagram className="h-6 w-6" />
                </a>
                <a aria-label="Ligar" href={cfg.phone} className="hover:opacity-100">
                  <Phone className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 pt-6 pb-12 space-y-5">
          <Card
            color={COLORS.terracotta}
            title="cardápio"
            textColor="#034A46"
            commaColor="#FFFFFF"
            Icon={UtensilsCrossed}
            href={cfg.links.cardapio}
          />

          <Card
            color={COLORS.aqua}
            title="reservas"
            textColor="#034A46"
            Icon={CalendarDays}
            href={cfg.links.reservas}
          />

          <Card
            color={COLORS.teal}
            title="restaurantes"
            Icon={Store}
            href={cfg.links.restaurantes}
            accent="#B8E4DA"
          />

          <Card
            color={COLORS.pink}
            title="localização"
            textColor="#034A46"
            commaColor="#E23B3B"
            Icon={MapPin}
            href={cfg.links.localizacao}
          />

          {/* Rodapé pequeno */}
          <div className="text-center text-xs text-slate-500 pt-2">
            © {new Date().getFullYear()} Mané Mercado Vírgula,– Todos os direitos reservados.
          </div>
        </div>
      </main>

      {cfg.pixel?.noscriptImg ? (
        <div
          dangerouslySetInnerHTML={{
            __html: `<noscript><img height="1" width="1" style="display:none" src="${cfg.pixel.noscriptImg}" /></noscript>`,
          }}
        />
      ) : null}
    </div>
  );
}

// Placeholder para outras praças
function ComingSoon({ city }: { city: string }) {
  return (
    <div className="min-h-[100dvh] bg-[#FBF5E9] text-slate-900 flex items-center justify-center" style={{ fontFamily: "'Merriweather', serif" }}>
      <div className="text-center px-6">
        <h1 className="text-3xl font-black mb-2">{city}</h1>
        <p className="text-sm text-slate-600">Estamos preparando a bio desta unidade.</p>
      </div>
    </div>
  );
}

function RedirectToAC() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const target = '/ac';
      if (window.location.pathname.toLowerCase() !== target) {
        window.history.replaceState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  }, []);
  return <ManeBio city="ac" />;
}

// Roteamento simples por pathname: /ac, /sp, /bsb
export default function App() {
  const path = (typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/ac').replace(/\/$/, '');
  if (path === '/ac') return <ManeBio city="ac" />;
  if (path === '/sp') return <ManeBio city="sp" />;
  if (path === '/bsb') return <ManeBio city="bsb" />;
  return <RedirectToAC />;
}
