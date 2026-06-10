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
      "Você está animado para a viagem, mas ainda existem alguns pontos importantes que podem gerar filas, estresse e gastos desnecessários.",
  },
  planejador: {
    id: "planejador",
    name: "Planejador Inteligente",
    emoji: "🗺️",
    description:
      "Você já está no caminho certo e com alguns ajustes pode aproveitar muito mais os parques.",
  },
  cacador: {
    id: "cacador",
    name: "Caçador de Filas",
    emoji: "⚡",
    description:
      "Seu foco é aproveitar o máximo possível dos parques sem desperdiçar horas em filas desnecessárias.",
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

  if (a.planejamento === "tudo") planejadorScore += 3;
  if (a.planejamento === "ideia") planejadorScore += 1;
  if (a.planejamento === "nao") exploradorScore += 2;

  if (a.problema === "filas") cacadorScore += 3;
  if (a.problema === "economizar") exploradorScore += 1;
  if (a.problema === "roteiro") planejadorScore += 2;
  if (a.problema === "estresse") exploradorScore += 2;

  if (a.lightning === "sim") planejadorScore += 2;
  if (a.lightning === "mais-ou-menos") cacadorScore += 1;
  if (a.lightning === "nao") exploradorScore += 2;

  const scores: Array<[ProfileId, number]> = [
    ["cacador", cacadorScore],
    ["planejador", planejadorScore],
    ["explorador", exploradorScore],
  ];
  scores.sort((a, b) => b[1] - a[1]);
  return scores[0][0];
}
