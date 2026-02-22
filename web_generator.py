#!/usr/bin/env python3
"""
Generador Masivo de Páginas Web - 10 Landing Pages de Alta Conversión
"""

import os
import json
from datetime import datetime

class WebPageGenerator:
    def __init__(self):
        self.templates = {
            "saas": self.saas_template,
            "ecommerce": self.ecommerce_template,
            "agency": self.agency_template,
            "app": self.app_template,
            "consulting": self.consulting_template,
            "education": self.education_template,
            "health": self.health_template,
            "finance": self.finance_template,
            "real_estate": self.real_estate_template,
            "creative": self.creative_template
        }
        
        self.projects = [
            {
                "name": "AI Marketing Pro",
                "type": "saas",
                "description": "Plataforma de marketing con IA para automatizar campañas",
                "color_scheme": "blue",
                "target": "Marketing Managers"
            },
            {
                "name": "EduTech Academy",
                "type": "education",
                "description": "Plataforma de cursos online con certificación",
                "color_scheme": "green",
                "target": "Estudiantes y profesionales"
            },
            {
                "name": "HealthTrack 360",
                "type": "health",
                "description": "Sistema de seguimiento de salud y bienestar",
                "color_scheme": "teal",
                "target": "Personas conscientes de su salud"
            },
            {
                "name": "FinSmart App",
                "type": "finance",
                "description": "App de gestión financiera personal",
                "color_scheme": "purple",
                "target": "Jóvenes profesionales"
            },
            {
                "name": "RealEstate AI",
                "type": "real_estate",
                "description": "Plataforma de búsqueda de propiedades con IA",
                "color_scheme": "orange",
                "target": "Compradores de vivienda"
            },
            {
                "name": "Creative Studio Pro",
                "type": "creative",
                "description": "Suite de herramientas para diseñadores creativos",
                "color_scheme": "pink",
                "target": "Diseñadores y creativos"
            },
            {
                "name": "BizConsult AI",
                "type": "consulting",
                "description": "Consultoría empresarial impulsada por IA",
                "color_scheme": "indigo",
                "target": "Pequeñas y medianas empresas"
            },
            {
                "name": "ShopStream Ecommerce",
                "type": "ecommerce",
                "description": "Plataforma de ecommerce con streaming en vivo",
                "color_scheme": "red",
                "target": "Emprendedores y retailers"
            },
            {
                "name": "DevTools Pro",
                "type": "agency",
                "description": "Herramientas para desarrolladores y equipos de software",
                "color_scheme": "gray",
                "target": "Desarrolladores y equipos tech"
            },
            {
                "name": "Mindful App",
                "type": "app",
                "description": "App de meditación y mindfulness",
                "color_scheme": "cyan",
                "target": "Personas buscando bienestar mental"
            }
        ]
    
    def saas_template(self, project):
        """Template para SaaS"""
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project['name']} - Plataforma SaaS</title>
    <style>
        :root {{
            --primary: #2563eb;
            --secondary: #1e40af;
            --accent: #3b82f6;
            --light: #f8fafc;
            --dark: #1e293b;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            color: var(--dark);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }}
        
        /* Header */
        header {{
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }}
        
        .navbar {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
        }}
        
        .logo {{
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
        }}
        
        .nav-links {{
            display: flex;
            gap: 2rem;
        }}
        
        .nav-links a {{
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            transition: color 0.3s;
        }}
        
        .nav-links a:hover {{
            color: var(--primary);
        }}
        
        .cta-button {{
            background: var(--primary);
            color: white;
            padding: 0.8rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }}
        
        .cta-button:hover {{
            background: var(--secondary);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
        }}
        
        /* Hero Section */
        .hero {{
            padding: 10rem 0 5rem;
            color: white;
            text-align: center;
        }}
        
        .hero h1 {{
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }}
        
        .hero p {{
            font-size: 1.25rem;
            max-width: 700px;
            margin: 0 auto 2rem;
            opacity: 0.9;
        }}
        
        /* Features */
        .features {{
            padding: 5rem 0;
            background: white;
        }}
        
        .section-title {{
            text-align: center;
            margin-bottom: 3rem;
        }}
        
        .section-title h2 {{
            font-size: 2.5rem;
            color: var(--dark);
            margin-bottom: 1rem;
        }}
        
        .features-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }}
        
        .feature-card {{
            background: var(--light);
            padding: 2rem;
            border-radius: 15px;
            transition: transform 0.3s;
        }}
        
        .feature-card:hover {{
            transform: translateY(-10px);
        }}
        
        .feature-icon {{
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }}
        
        /* CTA Section */
        .cta-section {{
            padding: 5rem 0;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            text-align: center;
        }}
        
        .cta-section h2 {{
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }}
        
        /* Footer */
        footer {{
            background: var(--dark);
            color: white;
            padding: 3rem 0;
            text-align: center;
        }}
        
        @media (max-width: 768px) {{
            .hero h1 {{
                font-size: 2.5rem;
            }}
            
            .nav-links {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <nav class="navbar">
                <a href="#" class="logo">{project['name']}</a>
                <div class="nav-links">
                    <a href="#features">Características</a>
                    <a href="#pricing">Precios</a>
                    <a href="#about">Nosotros</a>
                    <a href="#contact">Contacto</a>
                </div>
                <a href="#cta" class="cta-button">Comenzar Gratis</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Revoluciona tu {project['target']} con IA</h1>
            <p>{project['description']}. Automatiza, optimiza y escala tu negocio con nuestra plataforma inteligente.</p>
            <a href="#cta" class="cta-button" style="font-size: 1.2rem; padding: 1rem 3rem;">Prueba 14 Días Gratis</a>
        </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
        <div class="container">
            <div class="section-title">
                <h2>Características Principales</h2>
                <p>Todo lo que necesitas en una sola plataforma</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Automatización Inteligente</h3>
                    <p>Automatiza tareas repetitivas con IA avanzada que aprende de tus patrones.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Analítica en Tiempo Real</h3>
                    <p>Dashboard interactivo con métricas clave y predicciones precisas.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h3>Asistente IA Personalizado</h3>
                    <p>Asistente virtual que se adapta a tus necesidades específicas.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="cta-section">
        <div class="container">
            <h2>Comienza tu Transformación Digital Hoy</h2>
            <p style="margin-bottom: 2rem; font-size: 1.2rem;">Únete a miles de empresas que ya están creciendo con {project['name']}</p>
            <a href="#" class="cta-button" style="background: white; color: var(--primary);">Solicitar Demo Personalizada</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 {project['name']}. Todos los derechos reservados.</p>
            <p style="margin-top: 1rem; opacity: 0.8;">contacto@{project['name'].lower().replace(' ', '')}.com | +34 900 123 456</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {{
                    target.scrollIntoView({{
                        behavior: 'smooth'
                    }});
                }}
            }});
        }});

        // Form submission
        document.querySelector('.cta-button').addEventListener('click', function() {{
            alert('¡Gracias por tu interés! Te contactaremos en breve.');
        }});
    </script>
</body>
</html>'''
    
    def ecommerce_template(self, project):
        """Template para Ecommerce"""
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project['name']} - Plataforma Ecommerce</title>
    <style>
        :root {{
            --primary: #dc2626;
            --secondary: #b91c1c;
            --accent: #ef4444;
            --light: #fef2f2;
            --dark: #1f2937;
        }}
        
        /* Estilos similares al template SaaS pero con colores rojos */
        body {{
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: white;
        }}
        
        .hero {{
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 8rem 0 4rem;
        }}
        
        .product-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 3rem 0;
        }}
        
        .product-card {{
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s;
        }}
        
        .product-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }}
    </style>
</head>
<body>
    <header>
        <!-- Similar header structure -->
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Tu Tienda Online con {project['name']}</h1>
            <p>{project['description']}. Vende en línea con herramientas profesionales.</p>
            <a href="#" class="cta-button">Crear Tienda Gratis</a>
        </div>
    </section>
    
    <section class="products">
        <div class="container">
            <h2>Productos Destacados</h2>
            <div class="product-grid">
                <!-- Product cards -->
            </div>
        </div>
    </section>
    
    <footer>
        <!-- Footer similar -->
    </footer>
</body>
</html>'''
    
    def generate_all_pages(self):
        """Generar todas las páginas web"""
        print("Generando 10 páginas web de alta conversión...")
        print("="*60)
        
        os.makedirs("websites", exist_ok=True)
        
        results = []
        
        for i, project in enumerate(self.projects, 1):
            print(f"Generando página {i}/10: {project['name']} ({project['type']})")
            
            # Obtener template
            template_func = self.templates.get(project['type'], self.saas_template)
            html_content = template_func(project)
            
            # Crear nombre de archivo seguro
            safe_name = project['name'].lower().replace(' ', '_').replace('-', '_')
            filename = f"websites/{safe_name}.html"
            
            # Guardar archivo
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            # Crear también un directorio con assets
            project_dir = f"websites/{safe_name}"
            os.makedirs(project_dir, exist_ok=True)
            
            # Guardar HTML en el directorio también
            with open(f"{project_dir}/index.html", 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            # Crear archivo de configuración del proyecto
            project_config = {{
                "project_name": project['name'],
                "type": project['type'],
                "description": project['description'],
                "target_audience": project['target'],
                "color_scheme": project['color_scheme'],
                "generated_date": datetime.now().isoformat(),
                "files": [
                    f"{project_dir}/index.html"
                ],
                "seo_keywords": [
                    project['name'].lower(),
                    project['type'],
                    project['target'].lower(),
                    "españa",
                    "2024"
                ]
            }}
            
            with open(f"{project_dir}/project.json", 'w', encoding='utf-8') as f:
                json.dump(project_config, f, indent=2, ensure_ascii=False)
            
            results.append({{
                "id": i,
                "name": project['name'],
                "type": project['type'],
                "files": [
                    filename,
                    f"{project_dir}/index.html",
                    f"{project_dir}/project.json"
                ],
                "url_preview": f"file://{os.path.abspath(filename)}"
            }})
        
        print(f"\n✅ 10 páginas web generadas exitosamente!")
        return results
    
    def create_index_page(self, results):
        """Crear página índice con todos los proyectos"""
        print("\nCreando página índice de proyectos...")
        
        index_html = '''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portafolio de Proyectos Web</title>
    <style>
        * {
            margin: 0;
            padding: