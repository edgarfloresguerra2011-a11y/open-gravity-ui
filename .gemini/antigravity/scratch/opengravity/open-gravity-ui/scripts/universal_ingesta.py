import os
import json
import asyncio
import aiohttp
import mimetypes
from pathlib import Path
from datetime import datetime
import dotenv

# Cargar .env para obtener la URL de OpenGravity
dotenv.load_dotenv()
API_URL = os.getenv("OPENGRAVITY_API_URL", "http://localhost:3000/api/ingest")

# Extensiones de interés
MEDIA_EXT = {'.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.mp3', '.wav', '.html', '.css', '.js', '.py', '.txt', '.md'}

async def ingest_file(session, file_path):
    try:
        stats = file_path.stat()
        mime_type, _ = mimetypes.guess_type(file_path)
        
        # Para archivos de texto, leer el contenido
        content = ""
        if mime_type and (mime_type.startswith('text/') or mime_type == 'application/javascript'):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(2000) # Solo los primeros 2k para no saturar

        payload = {
            "type": "file",
            "data": {
                "name": file_path.name,
                "path": str(file_path),
                "mime": mime_type or "application/octet-stream",
                "size": stats.st_size,
                "content_preview": content,
                "timestamp": datetime.fromtimestamp(stats.st_mtime).isoformat()
            }
        }

        async with session.post(API_URL, json=payload) as resp:
            if resp.status == 200:
                print(f"✅ Inyectado: {file_path.name}")
            else:
                print(f"⚠️ Error {resp.status} en {file_path.name}")
                
    except Exception as e:
        print(f"❌ Error procesando {file_path}: {e}")

async def scan_and_inject(root_dirs):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for d in root_dirs:
            p = Path(d)
            if not p.exists(): continue
            print(f"🔍 Escaneando {d}...")
            
            # Buscamos archivos creados recientemente o de los formatos clave
            for file in p.rglob('*'):
                if file.is_file() and file.suffix.lower() in MEDIA_EXT:
                    # Evitar carpetas de sistema/librerías
                    if any(x in str(file) for x in ['node_modules', '.git', '.next', '__pycache__', 'venv']):
                        continue
                    
                    tasks.append(ingest_file(session, file))
                    
                    # Limitar concurrencia
                    if len(tasks) >= 20:
                        await asyncio.gather(*tasks)
                        tasks = []
        
        if tasks:
            await asyncio.gather(*tasks)

if __name__ == "__main__":
    # Escaneamos el scratch y otros directorios relevantes del usuario
    targets = [
        "c:\\Users\\Usuario\\.gemini\\antigravity\\scratch",
        # Podríamos agregar Desktop/Documents si fuera necesario, pero mantenemos el scope seguro
    ]
    asyncio.run(scan_and_inject(targets))
