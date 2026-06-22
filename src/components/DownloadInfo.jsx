function DownloadInfo({ mesaj }) {
  return (
    <div className="zona-info">
      {mesaj && <p>{mesaj}</p>}
    </div>
  );
}

export default DownloadInfo;