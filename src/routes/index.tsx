import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Em breve | Orlando Company" },
      { name: "description", content: "Em breve." },
    ],
  }),
  component: ComingSoon,
});

function ComingSoon() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground text-center">
        Em breve
      </h1>
    </main>
  );
}
