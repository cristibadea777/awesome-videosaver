import { useState } from "react";

function DownloadForm({ descarca, onDownload }) {
  const [inputLink, setInputLink] = useState("");

  const [oraStart, setOraStart] = useState("0");
  const [minStart, setMinStart] = useState("0");
  const [secStart, setSecStart] = useState("0");

  const [oraFin, setOraFin] = useState("0");
  const [minFin, setMinFin] = useState("0");
  const [secFin, setSecFin] = useState("10");

  const [format, setFormat] = useState("mp4");

  function formatTimp(ora, min, sec) {
    return `${ora.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
  }

  async function trimiteDescarcare() {
    if (!inputLink.trim()) {
      alert("Introdu un link.");
      return;
    }

    const start = formatTimp(oraStart, minStart, secStart);
    const end = formatTimp(oraFin, minFin, secFin);

    const succes = await onDownload({
      url: inputLink,
      start,
      end,
      format
    });

    if (succes) {
      setInputLink("");
    }
  }

  return (
    <div className="formular-taiere">
      <label>Link video</label>
      <input
        value={inputLink}
        onChange={(e) => setInputLink(e.target.value)}
        placeholder="https://..."
      />

      <label>Start</label>
      <div className="time-row">
        <input value={oraStart} onChange={(e) => setOraStart(e.target.value)} />
        <input value={minStart} onChange={(e) => setMinStart(e.target.value)} />
        <input value={secStart} onChange={(e) => setSecStart(e.target.value)} />
      </div>

      <label>Final</label>
      <div className="time-row">
        <input value={oraFin} onChange={(e) => setOraFin(e.target.value)} />
        <input value={minFin} onChange={(e) => setMinFin(e.target.value)} />
        <input value={secFin} onChange={(e) => setSecFin(e.target.value)} />
      </div>

      <label>Format</label>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="mp4">mp4</option>
        <option value="mp3">mp3</option>
      </select>

      <button onClick={trimiteDescarcare} disabled={descarca}>
        {descarca ? "Se descarcă..." : "Descarcă"}
      </button>
    </div>
  );
}

export default DownloadForm;