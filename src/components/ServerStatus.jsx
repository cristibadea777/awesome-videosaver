import { useEffect, useState } from "react";

function ServerStatus({ apiUrl }) {
  const [serverOnline, setServerOnline] = useState(false);

  async function verificaServer() {
    try {
      const response = await fetch(`${apiUrl}/`);

      if (!response.ok) {
        setServerOnline(false);
        return;
      }

      setServerOnline(true);
    } catch {
      setServerOnline(false);
    }
  }

  useEffect(() => {
    verificaServer();

    const interval = setInterval(() => {
      verificaServer();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bara-status">
      <span>server: {serverOnline ? "online" : "offline"}</span>
    </div>
  );
}

export default ServerStatus;