export type RiskLevel = "alto" | "moderado" | "baixo";

export interface RiskResult {
  id: RiskLevel;
  title: string;
  subtitle: string;
  paragraphs: string[];
  bullets: string[];
}

export const RISK_RESULTS: Record<RiskLevel, RiskResult> = {
  alto: {
    id: "alto",
    title: "🚨 Sua viagem está em zona de risco",
    subtitle:
      "Pelas suas respostas, você tem grandes chances de perder entre 12 e 18 horas da viagem em filas que poderiam ser evitadas.",
    paragraphs: [
      "Isso representa aproximadamente:",
      "A boa notícia é que esse cenário não acontece por falta de dinheiro, e sim por falta de estratégia. Com o planejamento certo, boa parte desse tempo pode ser recuperada.",
    ],
    bullets: [
      "até 10 atrações grandes",
      "quase 2 dias de parque",
      "ou centenas de dólares caso tente compensar comprando fura-filas.",
    ],
  },
  moderado: {
    id: "moderado",
    title: "⚠️ Sua viagem precisa de alguns ajustes",
    subtitle:
      "Pelas suas respostas, você provavelmente perderia entre 8 e 14 horas em filas que poderiam ser evitadas.",
    paragraphs: [
      "Isso equivale aproximadamente a:",
      "Você já tem uma boa base de planejamento, mas ainda existem decisões que podem fazer bastante diferença no seu aproveitamento.",
    ],
    bullets: [
      "até 7 atrações grandes",
      "quase 1 dia inteiro de parque",
      "além do risco de gastar mais dinheiro tentando resolver problemas durante a viagem.",
    ],
  },
  baixo: {
    id: "baixo",
    title: "✅ Você está no caminho certo",
    subtitle:
      "Pelas suas respostas, sua viagem já demonstra um bom nível de preparação. Mesmo assim, ainda existe o risco de perder entre 3 e 7 horas em filas evitáveis.",
    paragraphs: [
      "Na prática isso representa:",
      "Pequenos ajustes costumam gerar um ganho enorme no aproveitamento da viagem.",
    ],
    bullets: [
      "até 4 atrações importantes",
      "boa parte de uma manhã ou tarde de parque",
      "tempo que poderia ser usado em shows, restaurantes ou experiências extras.",
    ],
  },
};

export interface QuizAnswers {
  preocupacao?: string;
  planejamento?: string;
  apps?: string;
  comer?: string;
  ordem?: string;
  nome?: string;
  email?: string;
}

function scoreAnswer(v: string | undefined): number {
  if (v === "sim" || v === "tudo") return 2;
  if (v === "meio" || v === "ideia") return 1;
  if (v === "nao") return 0;
  return 0;
}

export function computeRisk(a: QuizAnswers): RiskLevel {
  // Preocupação: quanto mais focada em aproveitar melhor, mais preparado.
  let prep = 0;
  if (a.preocupacao === "aproveitar") prep += 2;
  else if (a.preocupacao === "organizar" || a.preocupacao === "filas") prep += 1;

  prep += scoreAnswer(a.planejamento);
  prep += scoreAnswer(a.apps);
  prep += scoreAnswer(a.comer);
  prep += scoreAnswer(a.ordem);

  // Máximo = 10
  if (prep >= 7) return "baixo";
  if (prep >= 4) return "moderado";
  return "alto";
}
