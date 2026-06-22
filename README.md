````markdown
# awesome-videosaver

Aplicație desktop client-server pentru descărcarea și tăierea unor secvențe video.

Clientul este realizat cu **React + Tauri**, iar serverul este realizat în **Python FastAPI** și rulează într-un container **Docker**. Serverul folosește `yt-dlp` pentru descărcarea videoclipului și `ffmpeg` pentru tăierea intervalului ales.

## Capturi de ecran

### Interfața aplicației

![Interfața aplicației](poze/interfata.png)

### Serverul rulat în Docker

![Server Docker](poze/server.png)

## Funcționalități

- introducere link video;
- alegere timp de început și timp de final;
- alegere format: `mp4` sau `mp3`;
- verificare status server: online/offline;
- descărcare și tăiere video pe server;
- salvarea fișierului rezultat pe calculatorul clientului.

## Arhitectură

Aplicația folosește o arhitectură client-server:

```text
Client React/Tauri  ->  Server FastAPI  ->  yt-dlp + ffmpeg
````

Clientul trimite o cerere HTTP către server. Serverul procesează videoclipul și returnează fișierul rezultat către client.

## Tehnologii folosite

* React
* Tauri
* Python
* FastAPI
* Docker
* yt-dlp
* ffmpeg

## Rulare client

În directorul principal al proiectului:

```bash
npm install
npm run tauri dev
```

În fișierul clientului, adresa serverului este setată prin:

```js
const API_URL = "http://IP_SERVER:8000";
```

## Rulare server cu Docker

În folderul `backend`:

```bash
docker build -t awesome-videosaver-backend .
docker run -d --name videosaver -p 8000:8000 awesome-videosaver-backend
```

Verificare server:

```bash
curl http://127.0.0.1:8000/
```

Răspuns așteptat:

```json
{"status":"server online"}
```

## Comenzi utile Docker

```bash
docker ps
docker start videosaver
docker stop videosaver
docker logs videosaver
```

## Structură proiect

```text
awesome-videosaver/
│
├── backend/
│   ├── main.py
│   ├── downloader.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── src/
│   └── components/
│       ├── FereastraPrincipala.jsx
│       ├── DownloadForm.jsx
│       ├── DownloadInfo.jsx
│       └── ServerStatus.jsx
│
├── poze/
│   ├── interfata.png
│   └── server.png
│
└── README.md
```

## Concluzie

Proiectul demonstrează o aplicație distribuită simplă, în care clientul și serverul sunt componente separate care comunică prin HTTP. Clientul oferă interfața grafică, iar serverul execută partea de procesare video.

```
```
