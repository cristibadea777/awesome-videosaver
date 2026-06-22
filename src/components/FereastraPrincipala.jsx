import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";

import DownloadForm from "./DownloadForm";
import DownloadInfo from "./DownloadInfo";
import "./FereastraPrincipala.css";
import ServerStatus from "./ServerStatus";

const API_URL = "http://100.88.234.43:8000";

function FereastraPrincipala() {
  const [descarca, setDescarca] = useState(false);
  const [mesaj, setMesaj] = useState("");

  async function descarcaVideo(dateVideo) {
    setDescarca(true);
    setMesaj("Se descarcă video-ul...");

    try {
      const response = await fetch(`${API_URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dateVideo)
      });

      if (!response.ok) {
        setMesaj("Eroare.");
        return false;
      }

      const fileName =
        response.headers.get("X-File-Name") || `clip.${dateVideo.format}`;

      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const filePath = await save({
        defaultPath: fileName,
        filters: [
          {
            name: "Media",
            extensions: [dateVideo.format]
          }
        ]
      });

      if (!filePath) {
        setMesaj("Salvare anulată.");
        return false;
      }

      await writeFile(filePath, bytes);

      setMesaj(`Descărcare finalizată: ${filePath}`);
      return true;
    } catch (error) {
      console.log(error);
      setMesaj("Eroare.");
      return false;
    } finally {
      setDescarca(false);
    }
  }

  return (
    <div className="container-principal">
      <ServerStatus apiUrl={API_URL} />

      <div className="zona-taiere">
        <DownloadForm
          descarca={descarca}
          onDownload={descarcaVideo}
        />
      </div>

      <DownloadInfo mesaj={mesaj} />
    </div>
  );
}

export default FereastraPrincipala;