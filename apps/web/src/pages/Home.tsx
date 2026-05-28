import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth, getPatients, type Patient } from "../api/client.ts";

export default function Home() {
  const [health, setHealth] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [healthRes, patientList] = await Promise.all([
          getHealth(),
          getPatients(),
        ]);
        if (!cancelled) {
          setHealth(healthRes.status);
          setPatients(patientList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h1>lime-scriber</h1>
      <p>
        API health:{" "}
        {error ? (
          <span className="error">{error}</span>
        ) : health ? (
          <span className="ok">{health}</span>
        ) : (
          "loading…"
        )}
      </p>
      <section>
        <h2>Patients</h2>
        {patients.length === 0 && !error ? (
          <p>Loading patients…</p>
        ) : (
          <ul>
            {patients.map((patient) => (
              <li key={patient.id}>{patient.fullName}</li>
            ))}
          </ul>
        )}
      </section>
      <p>
        <Link to="/notes">Notes (stub)</Link>
      </p>
    </main>
  );
}
