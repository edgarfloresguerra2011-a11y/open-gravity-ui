
import json
import os

db_path = '.alice_db.json'
if os.path.exists(db_path):
    with open(db_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filtrar solo archivos y leads, mantener skills y mensajes (memory_summaries tmb)
    # En OpenGravity v10, 'knowledge' tiene nodos con type: 'file'
    original_count = len(data.get('knowledge', []))
    data['knowledge'] = [k for k in data.get('knowledge', []) if k.get('type') not in ['file', 'lead']]
    new_count = len(data['knowledge'])
    
    # Vaciar la colección 'files' si existe (aunque v10 usa knowledge)
    data['files'] = []
    
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"🧹 Limpieza completada. Nodos eliminados: {original_count - new_count}")
    print(f"📉 Tamaño nuevo estimado: {os.path.getsize(db_path) / 1024:.2f} KB")
else:
    print("❌ No se encontró el archivo de base de datos.")
