#!/usr/bin/env python3
"""
Creación Rápida de 10 Páginas Web
"""

import os
from datetime import datetime

# Lista de proyectos
projects = [
    {"name": "AI Marketing Pro", "desc": "Marketing automation con IA", "color": "blue"},
    {"name": "EduTech Academy", "desc": "Plataforma educativa online", "color": "green"},
    {"name": "HealthTrack 360", "desc": "Seguimiento de salud", "color": "teal"},
    {"name": "FinSmart App", "desc": "Gestión financiera personal", "color": "purple"},
    {"name": "RealEstate AI", "desc": "Búsqueda de propiedades con IA", "color": "orange"},
    {"name": "Creative Studio", "desc": "Herramientas para diseñadores", "color": "pink"},
    {"name": "BizConsult AI", "desc": "Consultoría empresarial IA", "color": "indigo"},
    {"name": "ShopStream", "desc": "Ecommerce con streaming", "color": "red"},
    {"name": "DevTools Pro", "desc": "Herramientas para developers", "color": "gray"},
    {"name": "Mindful App", "desc": "Meditación y mindfulness", "color": "cyan"}
]

def create_website(project, index):
    """Crear una página web simple"""
    safe_name = project["name"].lower().replace(" ", "_")
    
    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project["name"]}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }}
        .header {{
            background: {project["color"]};
            color: white;
            padding: 2rem;
            text-align: center;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        .hero {{
            text-align: center;
            padding: 4rem 0;
        }}
        .cta-button {{
            background: {project["color"]};
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 2rem;
        }}
        .features {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 3rem;
        }}
        .feature {{
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        footer {{
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 3rem;
        }}
        @media (max-width: 768px) {{
            .features {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{project["name"]}</h1>
        <p>{project["desc"]}</p>
    </div>
    
    <div class="container">
        <div class="hero">
            <h2>Transforma tu negocio con nuestra solución</h2>
            <p>La plataforma más avanzada del mercado para {project["desc"].lower()}</p>
            <button class="cta-button">Comenzar Prueba Gratis</button>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🚀 Automatización</h3>
                <p>Automatiza procesos y ahorra tiempo valioso.</p>
            </div>
            <div class="feature">
                <h3>📊 Analítica</h3>
                <p>Métricas en tiempo real para mejores decisiones.</p>
            </div>
            <div class="feature">
                <h3>🤖 IA Integrada</h3>
                <p>Inteligencia artificial para optimizar resultados.</p>
            </div>
        </div>
    </div>
    
    <footer>
        <p>&copy; 2024 {project["name"]}. Todos los derechos reservados.</p>
        <p>contacto@{safe_name}.com | +34 900 000 000</p>
    </footer>
    
    <script>
        document.querySelector('.cta-button').addEventListener('click', function() {{
            alert('¡Gracias por tu interés! Te redirigiremos al formulario de registro.');
            // En producción: window.location.href = '/registro';
        }});
    </script>
</body>
</html>'''
    
    # Crear directorio
    os.makedirs("websites", exist_ok=True)
    
    # Guardar archivo
    filename = f"websites/{safe_name}.html"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return filename

def main():
    """Generar todas las páginas"""
    print("Generando 10 páginas web de alta conversión...")
    print("="*60)
    
    results = []
    
    for i, project in enumerate(projects, 1):
        print(f"Creando página {i}/10: {project['name']}")
        filename = create_website(project, i)
        results.append({
            "id": i,
            "name": project["name"],
            "file": filename,
            "color": project["color"]
        })
    
    # Crear índice
    print("\nCreando página índice...")
    index_html = '''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portafolio de Proyectos Web</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f0f2f5;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .project-card {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        .project-card:hover {
            transform: translateY(-5px);
        }
        .project-card h3 {
            margin-top: 0;
            color: #333;
        }
        .preview-button {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 0.8rem 1.5rem;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 1rem;
        }
        .stats {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            margin: 2rem auto;
            max-width: 800px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Portafolio de Proyectos Web</h1>
        <p>10 landing pages de alta conversión generadas automáticamente</p>
    </div>
    
    <div class="stats">
        <h2>📊 Estadísticas de Generación</h2>
        <p><strong>Total páginas:</strong> 10</p>
        <p><strong>Fecha:</strong> ''' + datetime.now().strftime("%Y-%m-%d %H:%M") + '''</p>
        <p><strong>Estado:</strong> ✅ Completado</p>
    </div>
    
    <div class="projects-grid">'''
    
    for project in results:
        index_html += f'''
        <div class="project-card">
            <h3>{project["name"]}</h3>
            <p><strong>Color:</strong> <span style="color:{project['color']}">● {project['color']}</span></p>
            <p><strong>Archivo:</strong> {project['file'].split('/')[-1]}</p>
            <a href="{project['file']}" class="preview-button" target="_blank">Ver Página</a>
        </div>'''
    
    index_html += '''
    </div>
    
    <div style="text-align:center; margin-top:3rem; padding:2rem; background:#333; color:white;">
        <p>Generado automáticamente por el sistema de creación masiva</p>
        <p>© 2024 - Todos los proyectos listos para producción</p>
    </div>
</body>
</html>'''
    
    with open("websites/index.html", 'w', encoding='utf-8') as f:
        f.write(index_html)
    
    print(f"\n✅ 10 páginas web creadas exitosamente!")
    print(f"📁 Directorio: websites/")
    print(f"📄 Índice: websites/index.html")
    
    # Mostrar resumen
    print("\n" + "="*60)
    print("RESUMEN DE PÁGINAS CREADAS:")
    print("="*60)
    for project in results:
        print(f"  {project['id']}. {project['name']} -> {project['file']}")
    
    print("\n" + "="*60)
    print("¡FASE 2 COMPLETADA! Páginas web listas.")
    print("="*60)

if __name__ == "__main__":
    main()