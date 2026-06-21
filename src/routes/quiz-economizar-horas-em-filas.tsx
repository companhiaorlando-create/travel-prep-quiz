import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/quiz/Quiz";

export const Route = createFileRoute("/quiz-economizar-horas-em-filas")({
  head: () => ({
    meta: [
      { title: "Quiz Orlando Sem Complicação | Orlando Company" },
      {
        name: "description",
        content:
          "Descubra em menos de 1 minuto se sua viagem para Orlando está realmente preparada. Fuja das filas, economize e aproveite cada dia.",
      },
      { property: "og:title", content: "Quiz Orlando Sem Complicação | Orlando Company" },
      {
        property: "og:description",
        content:
          "Descubra em menos de 1 minuto se sua viagem para Orlando está realmente preparada.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  return <Quiz />;
}
