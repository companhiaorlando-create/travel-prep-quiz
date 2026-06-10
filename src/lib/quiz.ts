export type ProfileId = "explorador" | "planejador" | "cacador";

export interface Profile {
  id: ProfileId;
  name: string;
  emoji: string;
  description: string;
}

export const PROFILES: Record<ProfileId, Profile> = {
  explorador: {
    id: "explorador",
    name: "Explorador Ansioso",
    emoji: "🧭",
    description:
      "Você está animado para a viagem, mas ainda existem alguns pontos que podem gerar estresse, gastos desnecessários e perda de tempo nos parques.\n\nCom um direcionamento simples, sua experiência pode ser muito mais tranquila e organizada.",
  },
  planejador: {
    id: "planejador",
    name: "Planejador Inteligente",
    emoji: "🗺️",
    description:
      "Você já está à frente da maioria dos viajantes e demonstra preocupação com o planejamento da viagem.\n\nCom alguns ajustes estratégicos, pode aproveitar ainda mais os parques e evitar erros comuns que muitos turistas cometem.",
  },
  cacador: {
    id: "cacador",
    name: "Caçador de Filas",
    emoji: "⚡",
    description:
      "Você já percebeu que o maior risco da sua viagem não é o valor dos ingressos.\n\nÉ gastar milhares de reais para passar horas em filas enquanto outras famílias conseguem aproveitar muito mais atrações no mesmo dia.\n\nA boa notícia é que isso pode ser evitado com planejamento e estratégias simples.",
  },
};

export interface QuizAnswers {
  preocupacao?: string;
  planejamento?: string;
  problema?: string;
  lightning?: string;
  nome?: string;
  email?: string;
}

export function computeProfile(a: QuizAnswers): ProfileId {
  let cacadorScore = 0;
  let planejadorScore = 0;
  let exploradorScore = 0;

  if (a.preocupacao === "filas") cacadorScore += 2;
  if (a.preocupacao === "dinheiro") exploradorScore += 1;
  if (a.preocupacao === "organizar") exploradorScore += 2;
  if (a.preocupacao === "aproveitar") planejadorScore += 1;

  // Pergunta 2 (nova): "Conseguiria aproveitar sem roteiro?"
  if (a.planejamento === "tranquilo") cacadorScore += 1;
  if (a.planejamento === "talvez") planejadorScore += 1;
  if (a.planejamento === "dificil") planejadorScore += 2;
  if (a.planejamento === "nao-ideia") exploradorScore += 3;

  if (a.problema === "filas") cacadorScore += 3;
  if (a.problema === "economizar") exploradorScore += 1;
  if (a.problema === "roteiro") planejadorScore += 2;
  if (a.problema === "estresse") exploradorScore += 2;

  if (a.lightning === "sim") planejadorScore += 2;
  if (a.lightning === "mais-ou-menos") cacadorScore += 1;
  if (a.lightning === "provavelmente-nao") exploradorScore += 1;
  if (a.lightning === "nao") exploradorScore += 2;

  const scores: Array<[ProfileId, number]> = [
    ["cacador", cacadorScore],
    ["planejador", planejadorScore],
    ["explorador", exploradorScore],
  ];
  scores.sort((a, b) => b[1] - a[1]);
  return scores[0][0];
}
