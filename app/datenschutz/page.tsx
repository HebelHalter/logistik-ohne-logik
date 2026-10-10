export default function Datenschutz() {
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
          Datenschutzerklärung
        </h1>

        <p className="mt-6 text-gray-400">
          Stand: August 2026
        </p>

        <div className="mt-12 space-y-12 text-gray-300">
          {/* 1 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              1. Verantwortlicher
            </h2>

            <p className="mt-4 leading-7">
              Verantwortlich für die Verarbeitung personenbezogener Daten auf
              dieser Website ist:
            </p>

            <p className="mt-4 leading-7">
              Stefan, Mießler
              <br />
              Jahnstraße 28, 72213, Altensteig
              <br />
              Deutschland
              <br />
              E-Mail:{" "}
              <a
                href="mailto:maurice.leppert@web.de"
                className="text-[#F26A21] hover:underline"
              >
                maurice.leppert@web.de
              </a>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              2. Zweck dieser Website
            </h2>

            <p className="mt-4 leading-7">
              LogistikOhneLogik ist eine unabhängige Plattform zur
              Dokumentation von Erfahrungen und Bedingungen im Alltag von
              Berufskraftfahrern.
            </p>

            <p className="mt-4 leading-7">
              Nutzer können insbesondere Situationen melden, Standorte
              angeben, Erfahrungen beschreiben, Wartezeiten erfassen,
              Ausstattungsmerkmale angeben, Verbesserungsvorschläge einreichen
              und optional Bilder hochladen.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              3. Verarbeitung beim Besuch der Website
            </h2>

            <p className="mt-4 leading-7">
              Beim Aufruf einer Website können technisch notwendige
              Informationen verarbeitet werden. Dazu können insbesondere die
              IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Seite,
              Browserinformationen, Betriebssystem und technische
              Verbindungsdaten gehören.
            </p>

            <p className="mt-4 leading-7">
              Diese Verarbeitung dient insbesondere dazu, die Website technisch
              bereitzustellen, die Stabilität und Sicherheit zu gewährleisten
              und technische Fehler zu erkennen.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              4. Fahrermeldungen
            </h2>

            <p className="mt-4 leading-7">
              Wenn du über das Formular eine Situation meldest, verarbeiten wir
              die von dir eingegebenen Informationen.
            </p>

            <p className="mt-4 leading-7">
              Dazu können gehören:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
              <li>Kategorie der Meldung</li>
              <li>angegebener Standort</li>
              <li>Beschreibung der Situation</li>
              <li>angegebene Wartezeit</li>
              <li>Angaben zu WC, Dusche und Parkmöglichkeiten</li>
              <li>Verbesserungsvorschläge</li>
              <li>optional hochgeladene Bilder</li>
            </ul>

            <p className="mt-4 leading-7">
              Zweck der Verarbeitung ist die Dokumentation, Prüfung und
              gegebenenfalls Veröffentlichung sachlicher Meldungen über den
              Fahreralltag.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              5. Veröffentlichung von Meldungen
            </h2>

            <p className="mt-4 leading-7">
              Eingereichte Meldungen werden nicht automatisch öffentlich
              angezeigt. Sie können zunächst geprüft und moderiert werden.
            </p>

            <p className="mt-4 leading-7">
              Erst freigegebene Meldungen können im öffentlich sichtbaren
              Bereich „Stimmen von der Straße“ erscheinen.
            </p>

            <p className="mt-4 leading-7">
              Nutzer werden gebeten, keine personenbezogenen Daten anderer
              Personen, keine erkennbaren Kennzeichen und keine unnötig
              identifizierbaren Personen hochzuladen oder zu veröffentlichen.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              6. Foto-Uploads
            </h2>

            <p className="mt-4 leading-7">
              Nutzer können freiwillig Bilder zu einer Meldung hochladen.
              Bilder werden derzeit über den von uns eingesetzten
              Speicheranbieter Supabase gespeichert.
            </p>

            <p className="mt-4 leading-7">
              Bitte lade ausschließlich Bilder hoch, die für die Meldung
              erforderlich sind und für deren Nutzung du die notwendigen
              Rechte besitzt.
            </p>

            <p className="mt-4 leading-7">
              Insbesondere sollen keine erkennbaren Personen, fremden
              Fahrzeugkennzeichen oder sonstigen unnötigen personenbezogenen
              Informationen enthalten sein.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              7. Supabase
            </h2>

            <p className="mt-4 leading-7">
              Für Datenbankfunktionen und die Speicherung hochgeladener Inhalte
              verwenden wir Supabase.
            </p>

            <p className="mt-4 leading-7">
              Dabei können Daten, die über das Meldeformular übermittelt
              werden, auf der technischen Infrastruktur von Supabase
              verarbeitet und gespeichert werden.
            </p>

            <p className="mt-4 leading-7">
              Welche konkreten Speicherorte und Unterauftragnehmer genutzt
              werden, richtet sich nach der von uns gewählten
              Supabase-Projektkonfiguration.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              8. Hosting
            </h2>

            <p className="mt-4 leading-7">
              Die Website soll über Vercel bereitgestellt werden.
            </p>

            <p className="mt-4 leading-7">
              Im Rahmen des Hostings können technisch notwendige
              Verbindungsdaten verarbeitet werden, um die Website auszuliefern
              sowie Sicherheit und Stabilität des Dienstes zu gewährleisten.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              9. Cookies und ähnliche Technologien
            </h2>

            <p className="mt-4 leading-7">
              In der derzeitigen Version der Website setzen wir selbst keine
              Werbe- oder Tracking-Cookies ein.
            </p>

            <p className="mt-4 leading-7">
              Sollten später Analyse-, Werbe- oder andere nicht technisch
              notwendige Technologien eingesetzt werden, wird diese
              Datenschutzerklärung entsprechend ergänzt und, soweit
              erforderlich, eine vorherige Einwilligung eingeholt.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              10. Speicherdauer
            </h2>

            <p className="mt-4 leading-7">
              Personenbezogene Daten werden grundsätzlich nur so lange
              gespeichert, wie dies für den jeweiligen Zweck erforderlich ist
              oder gesetzliche Aufbewahrungspflichten bestehen.
            </p>

            <p className="mt-4 leading-7">
              Eingereichte Meldungen können gespeichert werden, solange sie für
              die Dokumentation des Fahreralltags und den Betrieb der Plattform
              erforderlich sind.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              11. Rechtsgrundlagen
            </h2>

            <p className="mt-4 leading-7">
              Die Verarbeitung personenbezogener Daten erfolgt nur, soweit
              hierfür eine datenschutzrechtliche Rechtsgrundlage besteht.
            </p>

            <p className="mt-4 leading-7">
              Je nach Verarbeitung können insbesondere die freiwillige
              Einwilligung des Nutzers, die Durchführung eines vom Nutzer
              gewünschten Dienstes oder berechtigte Interessen am sicheren und
              funktionsfähigen Betrieb der Plattform in Betracht kommen.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              12. Rechte betroffener Personen
            </h2>

            <p className="mt-4 leading-7">
              Nach Maßgabe der Datenschutz-Grundverordnung können betroffene
              Personen insbesondere folgende Rechte haben:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
              <li>Recht auf Auskunft</li>
              <li>Recht auf Berichtigung</li>
              <li>Recht auf Löschung</li>
              <li>Recht auf Einschränkung der Verarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
              <li>Recht auf Widerspruch</li>
              <li>
                Recht auf Widerruf einer erteilten Einwilligung für die Zukunft
              </li>
            </ul>

            <p className="mt-4 leading-7">
              Zur Ausübung deiner Rechte kannst du dich an die oben genannte
              E-Mail-Adresse wenden.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              13. Beschwerderecht
            </h2>

            <p className="mt-4 leading-7">
              Betroffene Personen haben außerdem das Recht, sich bei einer
              zuständigen Datenschutzaufsichtsbehörde zu beschweren, wenn sie
              der Ansicht sind, dass die Verarbeitung ihrer personenbezogenen
              Daten gegen Datenschutzrecht verstößt.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-black text-white">
              14. Änderungen dieser Datenschutzerklärung
            </h2>

            <p className="mt-4 leading-7">
              Wir können diese Datenschutzerklärung anpassen, wenn sich die
              Website, die eingesetzten Dienste oder die rechtlichen
              Anforderungen ändern.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}