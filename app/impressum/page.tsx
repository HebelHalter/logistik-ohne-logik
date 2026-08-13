export default function Impressum() {
  return (
    <main className="min-h-screen bg-[#0B1F33] px-6 py-20 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <a
          href="/"
          className="text-sm font-bold text-[#F26A21] hover:underline"
        >
          ← Zurück zur Startseite
        </a>

        <h1 className="mt-8 text-4xl font-black md:text-6xl">
          Impressum
        </h1>

        <div className="mt-12 space-y-10 text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white">
              Angaben zum Betreiber
            </h2>

            <p className="mt-4 leading-7">
              Maurice Leppert
              <br />
              Dr.-Salvador-Allende-Straße 2
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              Kontakt
            </h2>

            <p className="mt-4 leading-7">
              E-Mail:{" "}
              <a
                href="mailto:maurice.leppert@web.de"
                className="text-[#F26A21] hover:underline"
              >
                maurice.leppert@web.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              Inhaltlich verantwortlich
            </h2>

            <p className="mt-4 leading-7">
              Maurice Leppert
              <br />
              Anschrift wie oben
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              Hinweis zum Projekt
            </h2>

            <p className="mt-4 leading-7">
              LogistikOhneLogik ist ein unabhängiges Projekt zur
              Dokumentation und Verbesserung von Bedingungen im
              Berufsfahreralltag.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}