"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Report = {
  id: number;
  created_at: string;
  category: string;
  location: string;
  description: string;
  waiting_time: number | null;
  has_toilet: boolean;
  has_shower: boolean;
  has_parking: boolean;
  suggestion: string | null;
  image_url: string | null;
  status: string;
};

export default function Home() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [waitingTime, setWaitingTime] = useState("");
  const [hasToilet, setHasToilet] = useState(false);
  const [hasShower, setHasShower] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const problems = [
    {
      title: "Parken & Ruhezeiten",
      text: "Überfüllte Rastplätze, fehlende Stellplätze und die tägliche Suche nach einem sicheren Platz für die Pause.",
      number: "01",
    },
    {
      title: "Sanitär & Würde",
      text: "Fehlende Toiletten, verschmutzte Anlagen und kaum Möglichkeiten zum Duschen gehören für viele zum Alltag.",
      number: "02",
    },
    {
      title: "Wartezeiten",
      text: "Stunden an Rampen, Baustellen und Be- oder Entladestellen – oft ohne klare Informationen.",
      number: "03",
    },
    {
      title: "Fahrerbedingungen",
      text: "Fehlende Aufenthaltsräume, schlechte Kommunikation und mangelnder Respekt gegenüber Fahrern.",
      number: "04",
    },
  ];

  const solutions = [
    {
      title: "Bessere Sanitärversorgung",
      text: "Mehr verlässliche Zugänge zu Toiletten und Duschen an Rastplätzen, Logistikstandorten und Be- und Entladestellen.",
    },
    {
      title: "Digitale Zeitfenster",
      text: "Transparente Be- und Entladezeiten können Wartezeiten reduzieren und Fahrern mehr Planungssicherheit geben.",
    },
    {
      title: "Mehr sichere Parkplätze",
      text: "Zusätzliche Stellflächen und bessere Informationen zur Auslastung helfen bei der Einhaltung von Ruhezeiten.",
    },
    {
      title: "Mehr Respekt im Alltag",
      text: "Klare Abläufe, bessere Kommunikation und vernünftige Aufenthaltsmöglichkeiten schaffen bessere Bedingungen für Fahrer.",
    },
  ];

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoadingReports(true);

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Fehler beim Laden der Meldungen:", error);
      setLoadingReports(false);
      return;
    }

    setReports((data as Report[]) || []);
    setLoadingReports(false);
  }

  function shareWhatsApp() {
    const text =
      "Unterstütze LogistikOhneLogik – Probleme sichtbar machen, Fahrer zusammenbringen und Lösungen voranbringen.";

    const url = window.location.href;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${text} ${url}`
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopyMessage("Link kopiert ✓");

      setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    } catch (error) {
      console.error("Link konnte nicht kopiert werden:", error);
      setCopyMessage("Kopieren fehlgeschlagen");

      setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSending(true);
    setMessage("");

    let imageUrl: string | null = null;

    try {
      if (photo) {
        if (!photo.type.startsWith("image/")) {
          setMessage("Bitte nur Bilddateien hochladen.");
          setSending(false);
          return;
        }

        if (photo.size > 6 * 1024 * 1024) {
          setMessage("Das Foto darf maximal 6 MB groß sein.");
          setSending(false);
          return;
        }

        const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(filePath, photo, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload Fehler:", uploadError);
          setMessage(`Upload-Fehler: ${uploadError.message}`);
          setSending(false);
          return;
        }

        const { data } = supabase.storage
          .from("report-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("reports").insert({
        category,
        location,
        description,
        waiting_time: waitingTime ? Number(waitingTime) : null,
        has_toilet: hasToilet,
        has_shower: hasShower,
        has_parking: hasParking,
        suggestion: suggestion || null,
        image_url: imageUrl,
      });

      if (error) {
        console.error("Datenbank Fehler:", error);
        setMessage("Beim Speichern der Meldung ist ein Fehler aufgetreten.");
        setSending(false);
        return;
      }

      setMessage(
        "Danke! Deine Meldung wurde gespeichert und wartet auf Freigabe."
      );

      setCategory("");
      setLocation("");
      setDescription("");
      setWaitingTime("");
      setHasToilet(false);
      setHasShower(false);
      setHasParking(false);
      setSuggestion("");
      setPhoto(null);

      const fileInput = document.getElementById(
        "photo"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);
      setMessage("Es ist ein unerwarteter Fehler aufgetreten.");
    }

    setSending(false);
  }

  return (
    <main className="bg-[#0B1F33] text-white">
      {/* HERO */}
      <section
        className="relative min-h-screen bg-cover bg-center md:bg-[center_right]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7,17,29,0.97) 0%, rgba(7,17,29,0.88) 45%, rgba(7,17,29,0.45) 100%), url('/hero-europe.jpg')",
        }}
      >
        <nav className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-3 md:px-12 lg:px-20">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="LogistikOhneLogik Logo"
              className="h-20 w-auto md:h-24"
            />
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 lg:flex">
            <a href="#probleme" className="transition hover:text-white">
              Probleme
            </a>
            <a href="#stimmen" className="transition hover:text-white">
              Meldungen
            </a>
            <a href="#loesungen" className="transition hover:text-white">
              Lösungen
            </a>
            <a href="#petition" className="transition hover:text-white">
              Petition
            </a>
            <a href="#ueber-uns" className="transition hover:text-white">
              Über uns
            </a>
          </div>

          <a
            href="#melden"
            className="rounded-md bg-[#F26A21] px-5 py-3 text-sm font-bold transition hover:scale-[1.02] hover:bg-[#ff762b]"
          >
            Situation melden
          </a>
        </nav>

        <div className="relative z-10 flex min-h-[calc(100vh-110px)] items-center px-6 py-20 md:px-12 lg:px-20">
          <div className="max-w-5xl">
            <div className="mb-7 flex items-center gap-3">
              <div className="h-[2px] w-10 bg-[#F26A21]" />

              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#F26A21]">
                Von Fahrern. Für Fahrer.
              </p>
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Die Straße hält
              <br />
              Deutschland
              <br />
              am Laufen.
            </h1>

            <h2 className="mt-8 max-w-3xl text-xl font-semibold leading-relaxed text-gray-300 md:text-3xl">
              Aber wer kümmert sich um die, die sie jeden Tag fahren?
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
              Parkplatzmangel. Fehlende Sanitäranlagen. Lange Wartezeiten.
              Fehlender Respekt. Wir machen den Fahreralltag sichtbar –
              sachlich, unabhängig und lösungsorientiert.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#melden"
                className="rounded-md bg-[#F26A21] px-8 py-4 text-center font-bold transition hover:scale-[1.02] hover:bg-[#ff762b]"
              >
                Situation melden
              </a>

              <a
                href="#petition"
                className="rounded-md border border-white/30 bg-white/5 px-8 py-4 text-center font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F33]"
              >
                Petition unterstützen
              </a>
            </div>

            <p className="mt-12 text-xs font-bold uppercase tracking-[0.25em] text-gray-400 md:text-sm">
              Nicht meckern. Melden. Verbessern.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEME */}
      <section
        id="probleme"
        className="px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
                Realität auf der Straße
              </p>

              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Du weißt selbst,
                <br />
                wie es draußen läuft.
              </h2>
            </div>

            <div className="flex items-end">
              <div>
                <p className="text-lg leading-8 text-gray-300">
                  Stundenlang an der Rampe warten. Abends keinen vernünftigen
                  Stellplatz finden. Eine Toilette suchen, obwohl du gerade
                  Waren im Wert von hunderttausenden Euro angeliefert hast.
                </p>

                <p className="mt-6 text-xl font-bold">
                  Viele dieser Situationen bleiben unsichtbar.
                </p>

                <p className="mt-2 text-xl font-bold text-[#F26A21]">
                  Wir wollen das ändern.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {problems.map((problem) => (
              <article
                key={problem.title}
                className="group min-h-[320px] border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#F26A21]/60 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-[#F26A21]">
                    {problem.number}
                  </span>

                  <span className="text-2xl text-gray-600 transition group-hover:text-[#F26A21]">
                    ↗
                  </span>
                </div>

                <div className="mt-20">
                  <h3 className="text-2xl font-bold">{problem.title}</h3>

                  <p className="mt-5 leading-7 text-gray-400">
                    {problem.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STIMMEN */}
      <section
        id="stimmen"
        className="border-y border-white/10 bg-[#081827] px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
              Stimmen von der Straße
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Echte Situationen.
              <br />
              Sachlich dokumentiert.
            </h2>
          </div>

          {loadingReports ? (
            <p className="text-gray-400">Meldungen werden geladen...</p>
          ) : reports.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-8">
              <p className="text-lg font-bold">
                Noch keine freigegebenen Meldungen vorhanden.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#0D2237]"
                >
                  {report.image_url && (
                    <img
                      src={report.image_url}
                      alt={`Meldung aus ${report.location}`}
                      className="h-56 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F26A21]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#F26A21]">
                        {report.category}
                      </span>

                      {report.waiting_time !== null && (
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">
                          {report.waiting_time} Min. Wartezeit
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-2xl font-black">
                      {report.location}
                    </h3>

                    <p className="mt-4 leading-7 text-gray-300">
                      {report.description}
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-md bg-black/20 p-3">
                        <p className="text-gray-500">WC</p>
                        <p className="mt-1 font-bold">
                          {report.has_toilet ? "Ja" : "Nein"}
                        </p>
                      </div>

                      <div className="rounded-md bg-black/20 p-3">
                        <p className="text-gray-500">Dusche</p>
                        <p className="mt-1 font-bold">
                          {report.has_shower ? "Ja" : "Nein"}
                        </p>
                      </div>

                      <div className="rounded-md bg-black/20 p-3">
                        <p className="text-gray-500">Parken</p>
                        <p className="mt-1 font-bold">
                          {report.has_parking ? "Ja" : "Nein"}
                        </p>
                      </div>
                    </div>

                    {report.suggestion && (
                      <div className="mt-6 border-l-2 border-[#F26A21] pl-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#F26A21]">
                          Verbesserungsvorschlag
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {report.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LÖSUNGEN */}
      <section
        id="loesungen"
        className="px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
              Lösungen statt nur Beschwerden
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Was könnte besser werden?
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              Probleme sichtbar zu machen ist nur der Anfang. Wir wollen
              Erfahrungen bündeln und daraus konkrete Verbesserungsvorschläge
              entwickeln.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {solutions.map((solution) => (
              <article
                key={solution.title}
                className="rounded-xl border border-white/10 bg-white/[0.035] p-8"
              >
                <h3 className="text-2xl font-black">{solution.title}</h3>

                <p className="mt-4 leading-7 text-gray-300">
                  {solution.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-[#F26A21]/30 bg-[#F26A21]/10 p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
              Unser Grundsatz
            </p>

            <p className="mt-4 text-3xl font-black md:text-5xl">
              Nicht meckern. Melden. Verbessern.
            </p>
          </div>
        </div>
      </section>

      {/* PETITION */}
      <section
        id="petition"
        className="border-y border-white/10 bg-[#081827] px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
              Gemeinsam sichtbar werden
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Petition an den Deutschen Bundestag.
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              Die Petition soll konkrete Verbesserungen für Berufskraftfahrer
              unterstützen und die Probleme im Fahreralltag stärker in den
              öffentlichen und politischen Fokus bringen.
            </p>

            <div className="mt-8 space-y-3 text-gray-300">
              <p>• bessere Bedingungen an Rast- und Logistikstandorten</p>
              <p>• mehr Aufmerksamkeit für Parkplatz- und Ruhezeitprobleme</p>
              <p>• würdige Sanitär- und Aufenthaltsmöglichkeiten</p>
              <p>• weniger unnötige Wartezeiten</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
              Du unterstützt das Anliegen?
            </p>

            <h3 className="mt-4 text-3xl font-black">
              Dann hilf dabei, es sichtbar zu machen.
            </h3>

            <p className="mt-4 leading-7 text-gray-300">
              Lies dir die Petition durch und teile sie mit anderen Fahrern.
            </p>

            <div className="mt-8 grid gap-3">
              <a
                href="/petition.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-[#F26A21] px-6 py-4 text-center font-black transition hover:bg-[#ff762b]"
              >
                Petition öffnen →
              </a>

              <button
                type="button"
                onClick={shareWhatsApp}
                className="rounded-md border border-white/15 px-6 py-4 font-bold transition hover:bg-white hover:text-[#0B1F33]"
              >
                Per WhatsApp teilen
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="rounded-md border border-white/15 px-6 py-4 font-bold transition hover:bg-white hover:text-[#0B1F33]"
              >
                {copyMessage || "Link kopieren"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ÜBER UNS */}
      <section
        id="ueber-uns"
        className="px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
                Über das Projekt
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                Eine Plattform für den echten Fahreralltag.
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-gray-300">
              <p>
                LogistikOhneLogik soll eine unabhängige Plattform für
                Berufskraftfahrer werden. Hier geht es nicht darum, einfach
                Frust abzuladen.
              </p>

              <p>
                Wir wollen reale Situationen dokumentieren, Erfahrungen
                zusammenbringen und sichtbar machen, wo es gut läuft und wo
                sich etwas ändern muss.
              </p>

              <p className="font-bold text-white">
                Die Plattform soll langfristig Fahrern, Öffentlichkeit,
                Unternehmen und Politik ein realistischeres Bild davon geben,
                wie der Alltag auf der Straße wirklich aussieht.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-7">
              <p className="text-sm font-bold text-[#F26A21]">01</p>
              <h3 className="mt-5 text-xl font-black">
                Probleme sichtbar machen
              </h3>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-7">
              <p className="text-sm font-bold text-[#F26A21]">02</p>
              <h3 className="mt-5 text-xl font-black">
                Fahrer zusammenbringen
              </h3>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-7">
              <p className="text-sm font-bold text-[#F26A21]">03</p>
              <h3 className="mt-5 text-xl font-black">
                Lösungen voranbringen
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* MELDEFORMULAR */}
      <section
        id="melden"
        className="border-y border-white/10 bg-[#081827] px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F26A21]">
              Deine Erfahrung zählt
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Situation melden.
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              Beschreibe sachlich, was passiert ist. Je strukturierter die
              Meldung, desto besser können wir Probleme später sichtbar und
              vergleichbar machen.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 rounded-xl border border-white/10 bg-white/[0.035] p-6 md:p-10"
          >
            <div>
              <label htmlFor="category" className="mb-3 block text-sm font-bold">
                Kategorie
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-[#0D2237] px-4 py-4 text-white outline-none focus:border-[#F26A21]"
              >
                <option value="">Kategorie auswählen</option>
                <option value="Parkplatz">Parkplatz</option>
                <option value="Sanitär">Sanitär</option>
                <option value="Wartezeit">Wartezeit</option>
                <option value="Be- und Entladung">Be- und Entladung</option>
                <option value="Fahrerbedingungen">Fahrerbedingungen</option>
                <option value="Sicherheit">Sicherheit</option>
                <option value="Positive Erfahrung">Positive Erfahrung</option>
                <option value="Lösungsvorschlag">Lösungsvorschlag</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="mb-3 block text-sm font-bold">
                Standort
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="z. B. Logistikzentrum Nürnberg"
                className="w-full rounded-md border border-white/10 bg-[#0D2237] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-[#F26A21]"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-3 block text-sm font-bold"
              >
                Was ist passiert?
              </label>

              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Beschreibe die Situation möglichst sachlich..."
                className="w-full resize-none rounded-md border border-white/10 bg-[#0D2237] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-[#F26A21]"
              />
            </div>

            <div>
              <label
                htmlFor="waitingTime"
                className="mb-3 block text-sm font-bold"
              >
                Wartezeit in Minuten
              </label>

              <input
                id="waitingTime"
                type="number"
                min="0"
                value={waitingTime}
                onChange={(e) => setWaitingTime(e.target.value)}
                placeholder="z. B. 160"
                className="w-full rounded-md border border-white/10 bg-[#0D2237] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-[#F26A21]"
              />
            </div>

            <div>
              <p className="mb-4 text-sm font-bold">Ausstattung vor Ort</p>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-[#0D2237] p-4">
                  <input
                    type="checkbox"
                    checked={hasToilet}
                    onChange={(e) => setHasToilet(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>WC vorhanden</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-[#0D2237] p-4">
                  <input
                    type="checkbox"
                    checked={hasShower}
                    onChange={(e) => setHasShower(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Dusche vorhanden</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-[#0D2237] p-4">
                  <input
                    type="checkbox"
                    checked={hasParking}
                    onChange={(e) => setHasParking(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Parkmöglichkeit</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="suggestion"
                className="mb-3 block text-sm font-bold"
              >
                Was könnte verbessert werden?
              </label>

              <textarea
                id="suggestion"
                rows={4}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Optional: Was wäre aus deiner Sicht eine sinnvolle Lösung?"
                className="w-full resize-none rounded-md border border-white/10 bg-[#0D2237] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-[#F26A21]"
              />
            </div>

            <div>
              <label htmlFor="photo" className="mb-3 block text-sm font-bold">
                Foto hinzufügen
              </label>

              <input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPhoto(file || null);
                }}
                className="block w-full rounded-md border border-dashed border-white/20 bg-[#0D2237] px-4 py-5 text-sm text-gray-300"
              />

              <p className="mt-3 text-sm text-gray-500">
                JPG, PNG oder WebP. Maximal 6 MB.
              </p>

              {photo && (
                <p className="mt-2 text-sm font-semibold text-[#F26A21]">
                  Ausgewählt: {photo.name}
                </p>
              )}

              <p className="mt-3 text-sm text-gray-500">
                Bitte keine erkennbaren Personen oder Kennzeichen hochladen.
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-black/20 p-5 text-sm leading-6 text-gray-400">
              Keine Beleidigungen, keine personenbezogenen Daten und keine
              unbelegten Anschuldigungen. Beschreibe nur Situationen, die du
              selbst erlebt oder beobachtet hast.
            </div>

            <button
              type="submit"
              disabled={sending}
              className="rounded-md bg-[#F26A21] px-8 py-5 text-lg font-black transition hover:bg-[#ff762b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Wird hochgeladen..." : "Meldung absenden →"}
            </button>

            {message && (
              <div
                className={`rounded-md border p-4 text-sm font-semibold ${
                  message.startsWith("Danke")
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06121E] px-6 py-14 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <img
                src="/logo.png"
                alt="LogistikOhneLogik Logo"
                className="h-32 w-auto"
              />

              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                Probleme sichtbar machen. Fahrer zusammenbringen. Lösungen
                voranbringen.
              </p>
            </div>

            <div>
              <p className="font-bold">Plattform</p>

              <div className="mt-4 grid gap-3 text-sm text-gray-400">
                <a href="#probleme" className="hover:text-white">
                  Probleme
                </a>

                <a href="#stimmen" className="hover:text-white">
                  Meldungen
                </a>

                <a href="#loesungen" className="hover:text-white">
                  Lösungen
                </a>

                <a href="#melden" className="hover:text-white">
                  Situation melden
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold">Projekt</p>

              <div className="mt-4 grid gap-3 text-sm text-gray-400">
                <a href="#petition" className="hover:text-white">
                  Petition
                </a>

                <a href="#ueber-uns" className="hover:text-white">
                  Über uns
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold">Rechtliches</p>

              <div className="mt-4 grid gap-3 text-sm text-gray-400">
                <a href="/impressum" className="hover:text-white">
                  Impressum
                </a>

                <a href="/datenschutz" className="hover:text-white">
                  Datenschutz
                </a>

                <span>Community-Richtlinien</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>© 2026 LogistikOhneLogik</p>
            <p>Von Fahrern. Für Fahrer.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}