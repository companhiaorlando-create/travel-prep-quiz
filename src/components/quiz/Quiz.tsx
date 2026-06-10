import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { OptionCard } from "./OptionCard";
import { computeProfile, PROFILES, type QuizAnswers, type ProfileId } from "@/lib/quiz";
import orlandoLogo from "@/assets/orlando-co-logo.png.asset.json";


type Step =
  | "intro"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "capture"
  | "loading"
  | "result"
  | "offer";

const ORDER: Step[] = ["intro", "q1", "q2", "q3", "q4", "capture", "loading", "result", "offer"];
const QUESTION_STEPS = 5; // q1..q4 + capture

export function Quiz() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [profile, setProfile] = useState<ProfileId | null>(null);

  const stepIndex = ORDER.indexOf(step);
  const questionProgress = useMemo(() => {
    if (step === "intro") return 0;
    if (step === "q1") return 1;
    if (step === "q2") return 2;
    if (step === "q3") return 3;
    if (step === "q4") return 4;
    if (step === "capture") return 5;
    return 5;
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

  // Scroll to top on step change
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-primary-foreground shadow-card">
            OC
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            Orlando Company
          </span>
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
            onPick={(v) => pick("preocupacao", v, "q2")}
          />
        )}

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
            onPick={(v) => pick("lightning", v, "capture")}
          />
        )}

        {step === "capture" && (
          <Capture
            initialName={answers.nome}
            initialEmail={answers.email}
            onSubmit={(nome, email) => {
              setAnswers((a) => ({ ...a, nome, email }));
              setStep("loading");
            }}
          />
        )}

        {step === "loading" && <Loading />}

        {step === "result" && profile && (
          <Result
            profileId={profile}
            firstName={answers.nome?.split(" ")[0] ?? ""}
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
        🎢 Sua viagem para <span className="text-primary">Orlando</span> está realmente preparada?
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        Descubra em menos de 1 minuto se você corre o risco de enfrentar filas gigantes, gastar mais do que deveria e perder atrações importantes.
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

function Capture({
  initialName,
  initialEmail,
  onSubmit,
}: {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (nome: string, email: string) => void;
}) {
  const [nome, setNome] = useState(initialName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = nome.trim();
    const em = email.trim();
    if (n.length < 2) return setErr("Digite seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return setErr("Digite um email válido.");
    if (em.length > 254 || n.length > 80) return setErr("Texto muito longo.");
    setErr(null);
    onSubmit(n, em);
  }

  return (
    <section className="animate-quiz-in">
      <h2 className="text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        Estamos quase terminando...
      </h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Para gerar seu resultado personalizado, informe seus dados.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold text-foreground">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            maxLength={80}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como podemos te chamar?"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none ring-ring/30 transition focus:border-primary focus:ring-4"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            maxLength={254}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none ring-ring/30 transition focus:border-primary focus:ring-4"
          />
        </div>

        {err && <p className="text-sm font-medium text-destructive">{err}</p>}

        <button
          type="submit"
          className="mt-2 w-full rounded-2xl bg-gradient-cta px-6 py-4 text-base font-bold text-cta-foreground shadow-cta transition-all hover:-translate-y-0.5 sm:text-lg"
        >
          Ver meu resultado →
        </button>

        <p className="pt-1 text-center text-[11px] text-muted-foreground">
          🔒 Seus dados estão seguros. Nada de spam — só conteúdo que ajuda sua viagem.
        </p>
      </form>
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
  firstName,
  onNext,
}: {
  profileId: ProfileId;
  firstName: string;
  onNext: () => void;
}) {
  const p = PROFILES[profileId];
  return (
    <section className="animate-quiz-in">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {firstName ? `${firstName}, seu perfil é` : "Seu perfil é"}
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

function Offer() {
  const CHECKOUT_URL = "https://pay.hotmart.com/X106205275B?off=lbqxl0o7&bid=1781109260386";

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
      <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-card sm:p-8">
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

      <p className="text-center text-xs text-muted-foreground">
        Calma, vai dar tudo certo. ✨ Menos ansiedade, mais magia.
      </p>
    </section>
  );
}
