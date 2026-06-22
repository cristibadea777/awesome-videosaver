import os
import re
import shutil
import subprocess
import tempfile
from yt_dlp import YoutubeDL

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if os.name == "nt":
    FFMPEG_PATH = os.path.join(BASE_DIR, "bin", "ffmpeg.exe")
else:
    FFMPEG_PATH = shutil.which("ffmpeg") or "ffmpeg"

def curata_nume(text):
    text = re.sub(r"[^a-zA-Z0-9_-]+", "_", text)
    return text[:60].strip("_")

def secunde_din_timp(timp):
    parti = timp.split(":")
    ore = int(parti[0])
    minute = int(parti[1])
    secunde = int(parti[2])
    return ore * 3600 + minute * 60 + secunde

def download_clip(video_url, start_time, end_time, video_format, output_dir):
    if os.name == "nt" and not os.path.exists(FFMPEG_PATH):
        raise Exception("Lipsește fișierul backend/bin/ffmpeg.exe")

    start_sec = secunde_din_timp(start_time)
    end_sec = secunde_din_timp(end_time)

    if end_sec <= start_sec:
        raise Exception("Interval invalid. Timpul de final trebuie să fie mai mare decât timpul de start.")

    os.makedirs(output_dir, exist_ok=True)

    with tempfile.TemporaryDirectory() as temp_dir:
        ydl_opts = {
            "format": "best[ext=mp4]/best",
            "outtmpl": os.path.join(temp_dir, "%(id)s.%(ext)s"),
            "quiet": True,
            "noplaylist": True,
            "ffmpeg_location": FFMPEG_PATH,
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)

        title = curata_nume(info.get("title", "video"))

        input_file = None
        for file in os.listdir(temp_dir):
            if file.endswith(".mp4"):
                input_file = os.path.join(temp_dir, file)
                break

        if input_file is None:
            raise Exception("Nu s-a găsit fișierul video descărcat.")

        safe_start = start_time.replace(":", "-")
        safe_end = end_time.replace(":", "-")
        output_file = os.path.join(output_dir, f"{title}_{safe_start}_{safe_end}.{video_format}")

        if video_format == "mp3":
            command = [
                FFMPEG_PATH, "-y", "-ss", start_time, "-to", end_time,
                "-i", input_file, "-vn", "-q:a", "2", output_file
            ]
        else:
            command = [
                FFMPEG_PATH, "-y", "-ss", start_time, "-to", end_time,
                "-i", input_file, "-c", "copy", output_file
            ]

        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            raise Exception(result.stderr)

        return output_file