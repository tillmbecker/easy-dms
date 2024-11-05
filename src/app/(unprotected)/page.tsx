import Hero from "@/components/hero";

export default async function Index() {
  return (
    <div className="flex flex-col gap-20 max-w-5xl p-5">
      <main className="flex-1 flex flex-col gap-6 px-4">
        <Hero />
      </main>
    </div>
  );
}
