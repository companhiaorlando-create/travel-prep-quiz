import { useEffect, useMemo, useRef, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { OptionCard } from "./OptionCard";
import { computeProfile, PROFILES, type QuizAnswers, type ProfileId } from "@/lib/quiz";
import orlandoLogo from "@/assets/orlando-co-logo.png.asset.json";


type Step =
  | "intro"
  | "q1"
  | "q1b"
  | "respiro"
  | "q2"
  | "q3"
  | "q4"
  | "loading"
  | "result"
  | "offer";

const ORDER: Step[] = ["intro", "q1", "q1b", "respiro", "q2", "q3", "q4", "loading", "result", "offer"];
const QUESTION_STEPS = 6; // q1, q1b, respiro, q2, q3, q4


export function Quiz() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [profile, setProfile] = useState<ProfileId | null>(null);

  const stepIndex = ORDER.indexOf(step);
  const questionProgress = useMemo(() => {
    switch (step) {
      case "intro": return 0;
      case "q1": return 1;
      case "q1b": return 2;
      case "respiro": return 3;
      case "q2": return 4;
      case "q3": return 5;
      case "q4": return 6;
      default: return 6;
    }
  }, [step]);

  function pick(key: keyof QuizAnswers, value: string, next: Step) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => setStep(next), 180);
  }

  function back() {
    const idx = ORDER.indexOf(step);
    if (idx > 0) setStep(ORDER[idx - 1]);
  }

  useEffect(() => {
    if (step === "loading") {
      const t = setTimeout(() => {
        setProfile(computeProfile(answers));
        setStep("result");
      }, 3200);
      return () => clearTimeout(t);
    }
  }, [step, answers]);

  // Scroll to top + dispara PageView do Meta Pixel a cada etapa
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fbq = (window as any).fbq;
      if (typeof fbq === "function") {
        fbq("track", "PageView");
      }
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <img
            src={orlandoLogo.url}
            alt="Orlando Co. logo"
            className="h-10 w-auto sm:h-12"
          />
        </div>

        {stepIndex > 0 && step !== "loading" && step !== "result" && step !== "offer" && (
          <button
            onClick={back}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </button>
        )}
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
        {step !== "intro" && step !== "loading" && step !== "result" && step !== "offer" && (
          <div className="mb-8 animate-quiz-in">
            <ProgressBar current={questionProgress} total={QUESTION_STEPS} />
          </div>
        )}

        {step === "intro" && <Intro onStart={() => setStep("q1")} />}

        {step === "q1" && (
          <Question
            title="Qual é sua maior preocupação com Orlando?"
            subtitle="Não existe resposta certa — escolha a que mais combina com você."
            options={[
              { id: "filas", icon: "⏳", label: "Enfrentar filas enormes" },
              { id: "dinheiro", icon: "💸", label: "Gastar dinheiro à toa" },
              { id: "organizar", icon: "🗓️", label: "Não saber organizar os parques" },
              { id: "aproveitar", icon: "🎯", label: "Não aproveitar tudo que planejei" },
            ]}
            selected={answers.preocupacao}
            onPick={(v) => pick("preocupacao", v, "q1b")}
          />
        )}

        {step === "q1b" && (
          <Question
            title="Imagine ficar 2 horas em uma fila para uma única atração. Como você se sentiria?"
            options={[
              { id: "muito-frustrado", icon: "😤", label: "Muito frustrado" },
              { id: "chateado", icon: "😕", label: "Chateado" },
              { id: "faz-parte", icon: "🤷", label: "Faz parte da viagem" },
              { id: "nunca-pensei", icon: "💭", label: "Nunca tinha pensado nisso" },
            ]}
            selected={answers.sentimento}
            onPick={(v) => pick("sentimento", v, "respiro")}
          />
        )}

        {step === "respiro" && <Respiro onContinue={() => setStep("q2")} />}

        {step === "q2" && (
          <Question
            title="Você já sabe exatamente qual parque fará em cada dia?"
            options={[
              { id: "tudo", icon: "✅", label: "Sim, tudo planejado" },
              { id: "ideia", icon: "💭", label: "Tenho uma ideia" },
              { id: "nao", icon: "❓", label: "Ainda não sei" },
            ]}
            selected={answers.planejamento}
            onPick={(v) => pick("planejamento", v, "q3")}
          />
        )}

        {step === "q3" && (
          <Question
            title="Se você pudesse resolver apenas UM problema da viagem hoje, qual seria?"
            options={[
              { id: "filas", icon: "🏃", label: "Fugir das filas" },
              { id: "economizar", icon: "💰", label: "Economizar dinheiro" },
              { id: "roteiro", icon: "🧩", label: "Montar um roteiro inteligente" },
              { id: "estresse", icon: "😌", label: "Evitar estresse e imprevistos" },
            ]}
            selected={answers.problema}
            onPick={(v) => pick("problema", v, "q4")}
          />
        )}

        {step === "q4" && (
          <Question
            title="Você já entende como funciona o Lightning Lane?"
            subtitle="É o sistema da Disney para reduzir filas — calma, vamos te ajudar com isso."
            options={[
              { id: "sim", icon: "⚡", label: "Sim" },
              { id: "mais-ou-menos", icon: "🤔", label: "Mais ou menos" },
              { id: "nao", icon: "🙈", label: "Não faço ideia" },
            ]}
            selected={answers.lightning}
            onPick={(v) => pick("lightning", v, "loading")}
          />
        )}

        {step === "loading" && <Loading />}

        {step === "result" && profile && (
          <Result
            profileId={profile}
            onNext={() => setStep("offer")}
          />
        )}

        {step === "offer" && <Offer />}
      </main>

      <footer className="px-5 pb-10 pt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Orlando Company · Calma, vai dar tudo certo ✨
      </footer>
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="animate-quiz-in text-center">
      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary">
        ✨ Menos ansiedade, mais magia
      </div>
      <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
        🎢 Descubra se você está prestes a perder horas em filas que poderiam ser evitadas <span className="text-primary">mesmo sem fura-filas</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        Descubra como economizar tempo, ter mais conforto e aproveitar os parques com mais controle, exclusividade e sensação de vantagem sobre a maioria dos visitantes.
      </p>

      <button
        onClick={onStart}
        className="mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-gradient-cta px-8 py-4 text-base font-bold text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 hover:shadow-soft sm:text-lg"
      >
        Quero descobrir →
      </button>

      <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 text-xs text-muted-foreground">
        <Pill>⏱️ 1 minuto</Pill>
        <Pill>🎁 100% gratuito</Pill>
        <Pill>🪄 Resultado na hora</Pill>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-border bg-card px-3 py-2 font-medium">
      {children}
    </div>
  );
}

interface Opt { id: string; icon: string; label: string; }

function Question({
  title,
  subtitle,
  options,
  selected,
  onPick,
}: {
  title: string;
  subtitle?: string;
  options: Opt[];
  selected?: string;
  onPick: (id: string) => void;
}) {
  return (
    <section className="animate-quiz-in">
      <h2 className="text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      )}
      <div className="mt-6 grid gap-3">
        {options.map((o) => (
          <OptionCard
            key={o.id}
            icon={o.icon}
            label={o.label}
            selected={selected === o.id}
            onClick={() => onPick(o.id)}
          />
        ))}
      </div>
    </section>
  );
}

function Respiro({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="animate-quiz-in">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="mx-auto mb-5 grid h-16 w-16 animate-float-slow place-items-center rounded-full bg-gradient-brand text-3xl shadow-soft">
          ✨
        </div>
        <h2 className="text-balance text-center text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          Estamos entendendo melhor seu perfil para te ajudar
        </h2>
        <p className="mt-4 text-pretty text-center text-base text-muted-foreground sm:text-lg">
          Estamos analisando suas respostas para entender como você costuma planejar uma viagem e identificar oportunidades para que você aproveite mais os parques com menos filas, menos desgaste e mais tranquilidade.
        </p>
        <button
          onClick={onContinue}
          className="mt-7 w-full rounded-2xl bg-gradient-cta px-6 py-4 text-base font-bold text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 sm:text-lg"
        >
          Continuar →
        </button>
      </div>
    </section>
  );
}


const LOADING_MESSAGES = [
  "Identificando oportunidades de economia...",
  "Verificando riscos de filas...",
  "Calculando seu nível de preparação...",
  "Gerando diagnóstico personalizado...",
];

function Loading() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [pct, setPct] = useState(4);

  useEffect(() => {
    const start = Date.now();
    const dur = 3000;
    const tick = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / dur) * 100);
      setPct(p);
    }, 40);
    const msgTimer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 750);
    return () => { clearInterval(tick); clearInterval(msgTimer); };
  }, []);

  return (
    <section className="animate-quiz-in py-8 text-center">
      <div className="mx-auto mb-6 grid h-20 w-20 animate-float-slow place-items-center rounded-full bg-gradient-brand text-3xl shadow-soft">
        ✨
      </div>
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
        Analisando sua preparação...
      </h2>
      <p className="mt-3 min-h-[1.5rem] text-base text-muted-foreground transition-opacity">
        {LOADING_MESSAGES[msgIdx]}
      </p>

      <div className="mx-auto mt-8 h-3 w-full max-w-md overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-cta transition-[width] duration-100 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-xs font-semibold text-muted-foreground">{Math.round(pct)}%</p>
    </section>
  );
}

const RESULT_BENEFITS = [
  "Menos filas",
  "Mais atrações por dia",
  "Economia de dinheiro",
  "Mais tranquilidade para a família",
  "Melhor aproveitamento da viagem",
];

function Result({
  profileId,
  onNext,
}: {
  profileId: ProfileId;
  onNext: () => void;
}) {
  const p = PROFILES[profileId];
  return (
    <section className="animate-quiz-in">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Seu perfil é
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-3xl shadow-card">
            {p.emoji}
          </div>
          <h2 className="min-w-0 text-balance text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
            {p.name}
          </h2>
        </div>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {p.description}
        </p>

        <div className="mt-7 rounded-2xl bg-secondary/60 p-5">
          <p className="text-sm font-bold text-foreground sm:text-base">
            Com seu perfil você pode conquistar:
          </p>
          <ul className="mt-3 space-y-2">
            {RESULT_BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground sm:text-base">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success text-[10px] font-bold text-white">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onNext}
          className="mt-7 w-full rounded-2xl bg-gradient-cta px-6 py-4 text-base font-bold text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 sm:text-lg"
        >
          Ver meu plano personalizado →
        </button>
      </div>
    </section>
  );
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Não consigo encontrar essas informações gratuitamente na internet?",
    a: "Até consegue encontrar partes dessas informações em vídeos, blogs e redes sociais. O problema é que normalmente o conteúdo está espalhado, desatualizado ou até mesmo contraditório. O ebook reúne tudo em um único lugar, organizado de forma simples e prática para você não perder horas pesquisando.",
  },
  {
    q: "Esse conteúdo serve para quem vai para Orlando pela primeira vez?",
    a: "Sim. O material foi pensado principalmente para quem quer viajar com mais segurança, organização e tranquilidade, mesmo sem experiência anterior.",
  },
  {
    q: "O ebook fala apenas sobre filas?",
    a: "Não. Além das estratégias para reduzir filas, você também encontrará orientações sobre organização, planejamento, deslocamento, economia e aproveitamento inteligente dos parques.",
  },
  {
    q: "Vou receber o material imediatamente?",
    a: "Sim. Após a confirmação do pagamento, o acesso é enviado imediatamente para o email informado na compra.",
  },
  {
    q: "E se eu não gostar do conteúdo?",
    a: "Você tem garantia de 7 dias. Se dentro desse período entender que o material não é para você, poderá solicitar o reembolso conforme as condições da oferta.",
  },
  {
    q: "Preciso comprar algum fura-fila para aplicar as estratégias?",
    a: "Não necessariamente. O objetivo do material é justamente mostrar formas mais inteligentes de aproveitar os parques e entender melhor a movimentação das pessoas, ajudando você a tomar decisões melhores durante a viagem.",
  },
];

const FINAL_BENEFITS = [
  "Aproveitar mais atrações",
  "Reduzir tempo em filas",
  "Caminhar menos dentro dos parques",
  "Economizar dinheiro",
  "Tomar decisões com mais confiança",
  "Evitar erros comuns de turistas",
  "Aproveitar a viagem com mais tranquilidade",
];

function Offer() {
  const CHECKOUT_URL = "https://pay.hotmart.com/X106205275B?off=lbqxl0o7&bid=1781109260386";
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function scrollToDetails() {
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="animate-quiz-in space-y-6">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary">
          🎉 Seu plano está pronto
        </div>
        <h2 className="text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
          Seu Plano <span className="text-primary">Orlando Sem Complicação</span> Está Pronto
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Tudo o que você precisa para aproveitar Orlando de forma inteligente.
        </p>

        <button
          onClick={scrollToDetails}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 sm:text-base"
        >
          Quero ver todos os detalhes ↓
        </button>
      </div>

      {/* Product card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="bg-gradient-brand p-6 text-primary-foreground sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Ebook + Bônus</p>
          <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Orlando Sem Fura-Fila
          </h3>
          <p className="mt-2 text-sm opacity-90 sm:text-base">
            + Checklist Completo de Viagem 🎁
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-sm font-bold text-foreground">✅ Ebook Orlando Sem Fura-Fila</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>• Como reduzir filas</li>
              <li>• Como usar Lightning Lane</li>
              <li>• Melhor ordem das atrações</li>
              <li>• Estratégias de economia</li>
              <li>• Planejamento inteligente</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">🎁 Bônus: Checklist Completo</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>• Documentos</li>
              <li>• Mala</li>
              <li>• Aplicativos essenciais</li>
              <li>• Itens essenciais</li>
              <li>• Preparação pré-embarque</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Antes / Depois */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-destructive/20 bg-card p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-destructive">Antes</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li>❌ Filas enormes</li>
            <li>❌ Planejamento confuso</li>
            <li>❌ Gastos desnecessários</li>
            <li>❌ Estresse</li>
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-success/30 bg-card p-5">
          <p className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--success)" }}>Depois</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li>✅ Mais atrações</li>
            <li>✅ Menos filas</li>
            <li>✅ Economia</li>
            <li>✅ Tranquilidade</li>
          </ul>
        </div>
      </div>

      {/* Price + CTA */}
      <div ref={detailsRef} className="rounded-3xl border border-border bg-card p-6 text-center shadow-card sm:p-8">
        <p className="text-sm text-muted-foreground">
          De <span className="line-through">R$ 97,00</span> por apenas
        </p>
        <p className="mt-1 text-5xl font-extrabold text-primary sm:text-6xl">
          R$ 37,90
        </p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          Pagamento único · acesso imediato
        </p>

        <a
          href={CHECKOUT_URL}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-cta px-6 py-5 text-base font-extrabold uppercase tracking-wide text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 sm:text-lg"
        >
          Quero viajar sem complicação →
        </a>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-base">🛡️</span>
          Garantia incondicional de 7 dias. Se não amar, devolvemos seu dinheiro.
        </div>
      </div>

      {/* Nova seção: viagem melhor */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h3 className="text-balance text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
          Sua viagem pode ser muito melhor do que você imagina
        </h3>
        <div className="mt-4 space-y-3 text-pretty text-sm text-muted-foreground sm:text-base">
          <p>A maioria das pessoas acredita que Orlando é sinônimo de filas enormes, cansaço e correria.</p>
          <p>Mas a verdade é que quem entende a lógica correta dos parques consegue aproveitar mais atrações, caminhar menos, reduzir tempo perdido e tomar decisões muito mais inteligentes durante a viagem.</p>
          <p>Você não precisa gastar centenas de dólares com soluções extras para ter uma experiência incrível.</p>
          <p>Com a estratégia certa, é possível ter mais conforto, mais controle, mais economia e muito mais tranquilidade para aproveitar os parques com sua família.</p>
        </div>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {FINAL_BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground sm:text-base">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success text-[10px] font-bold text-white">✓</span>
              {b}
            </li>
          ))}
        </ul>

        <a
          href={CHECKOUT_URL}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-cta px-6 py-5 text-base font-extrabold uppercase tracking-wide text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 sm:text-lg"
        >
          Quero aproveitar Orlando de forma inteligente →
        </a>
      </div>

      {/* FAQ */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h3 className="text-center text-2xl font-extrabold text-foreground sm:text-3xl">
          Perguntas Frequentes
        </h3>
        <div className="mt-6 divide-y divide-border">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-2 text-left text-sm font-semibold text-foreground sm:text-base"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className={`shrink-0 text-primary transition-transform ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Calma, vai dar tudo certo. ✨ Menos ansiedade, mais magia.
      </p>
    </section>
  );
}
