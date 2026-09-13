import { TexturePanel } from "@/components/shared/TexturePanel";
import { juergenPollack } from "@/content/about";

export function PollackFeature() {
  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <TexturePanel
          variant="kampfkunst"
          className="aspect-[4/5] w-full rounded-2xl"
          label={juergenPollack.name}
        />
        <div>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
            {juergenPollack.role}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            {juergenPollack.name}
          </h2>
          <p className="mt-5 max-w-xl text-paper/75">{juergenPollack.intro}</p>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-paper/70 sm:grid-cols-2">
            {juergenPollack.qualifications.map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
