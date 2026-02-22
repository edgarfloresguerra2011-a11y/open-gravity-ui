#!/usr/bin/env python3
"""
Programa para Crear eBooks y Generar Dinero
Sistema completo de generación y venta de eBooks
"""

import os
import json
from datetime import datetime

class EbookMoneyMaker:
    def __init__(self):
        self.program_name = "Ebook Profit Generator Pro"
        self.version = "2.0.0"
        
    def create_program_structure(self):
        """Crear estructura completa del programa"""
        print(f"Creando {self.program_name} v{self.version}...")
        print("="*60)
        
        # Directorio principal
        os.makedirs("ebook_profit_system", exist_ok=True)
        
        # 1. Configuración principal
        self.create_main_config()
        
        # 2. Módulos del sistema
        self.create_modules()
        
        # 3. Templates de eBooks
        self.create_ebook_templates()
        
        # 4. Sistema de ventas
        self.create_sales_system()
        
        # 5. Documentación
        self.create_documentation()
        
        print(f"\n✅ {self.program_name} creado exitosamente!")
        return "ebook_profit_system"
    
    def create_main_config(self):
        """Crear configuración principal"""
        config = {
            "program_name": self.program_name,
            "version": self.version,
            "created": datetime.now().isoformat(),
            "description": "Sistema completo para crear y vender eBooks automáticamente",
            "features": [
                "Generación automática de eBooks",
                "Templates profesionales",
                "Sistema de ventas integrado",
                "Marketing automático",
                "Análisis de ganancias",
                "Multiplataforma (Amazon KDP, Gumroad, etc.)"
            ],
            "revenue_streams": [
                "Venta directa de eBooks",
                "Afiliados",
                "Versiones premium",
                "Bundles",
                "Suscripciones"
            ],
            "target_markets": [
                "Amazon KDP",
                "Gumroad",
                "Payhip",
                "Shopify",
                "WordPress + WooCommerce"
            ]
        }
        
        with open("ebook_profit_system/config.json", 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2)
        
        print("✓ Configuración principal creada")
    
    def create_modules(self):
        """Crear módulos del sistema"""
        modules_dir = "ebook_profit_system/modules"
        os.makedirs(modules_dir, exist_ok=True)
        
        # Módulo 1: Generador de contenido
        content_gen = '''#!/usr/bin/env python3
"""
Módulo: Generador de Contenido para eBooks
Usa IA para crear contenido original y optimizado
"""

import json
import random
from datetime import datetime

class ContentGenerator:
    def __init__(self):
        self.topics = [
            "Salud y Bienestar", "Finanzas Personales", "Desarrollo Personal",
            "Tecnología", "Marketing Digital", "Productividad",
            "Relaciones", "Negocios Online", "Inversiones",
            "Cocina Saludable", "Ejercicio en Casa", "Meditación"
        ]
        
        self.templates = {
            "guia_practica": self.guia_practica_template,
            "curso_completo": self.curso_completo_template,
            "manual_tecnico": self.manual_tecnico_template,
            "historias_exito": self.historias_exito_template
        }
    
    def generate_ebook_content(self, topic, template_type="guia_practica"):
        """Generar contenido completo para un eBook"""
        print(f"Generando eBook sobre: {topic}")
        
        template_func = self.templates.get(template_type, self.guia_practica_template)
        content = template_func(topic)
        
        # Agregar capítulos
        chapters = self.generate_chapters(topic)
        content["chapters"] = chapters
        
        # Agregar metadata
        content["metadata"] = {
            "generated_date": datetime.now().isoformat(),
            "word_count": sum(len(chap["content"].split()) for chap in chapters),
            "target_audience": self.get_target_audience(topic),
            "price_suggestion": self.calculate_price(topic, len(chapters))
        }
        
        return content
    
    def guia_practica_template(self, topic):
        """Template para guía práctica"""
        return {
            "title": f"Guía Práctica de {topic} - Paso a Paso",
            "subtitle": "Todo lo que necesitas saber para tener éxito",
            "introduction": f"Esta guía te llevará de la teoría a la práctica en el mundo de {topic}.",
            "conclusion": "Ahora tienes todas las herramientas para aplicar lo aprendido.",
            "call_to_action": "¡Comienza hoy mismo tu transformación!"
        }
    
    def generate_chapters(self, topic):
        """Generar capítulos del eBook"""
        chapter_count = random.randint(8, 15)
        chapters = []
        
        for i in range(chapter_count):
            chapter = {
                "number": i + 1,
                "title": f"Capítulo {i + 1}: {self.generate_chapter_title(topic, i)}",
                "content": self.generate_chapter_content(topic, i),
                "key_points": self.generate_key_points(),
                "exercises": self.generate_exercises() if random.random() > 0.5 else [],
                "resources": self.generate_resources()
            }
            chapters.append(chapter)
        
        return chapters
    
    def generate_chapter_title(self, topic, chapter_num):
        """Generar título de capítulo"""
        titles = [
            f"Fundamentos de {topic}",
            f"Estrategias Avanzadas",
            f"Herramientas Esenciales",
            f"Casos de Éxito",
            f"Errores a Evitar",
            f"Plan de Acción",
            f"Recursos Adicionales",
            f"El Futuro de {topic}"
        ]
        return titles[chapter_num % len(titles)]
    
    def generate_chapter_content(self, topic, chapter_num):
        """Generar contenido de capítulo"""
        # En producción real, aquí se integraría con una API de IA
        paragraphs = [
            f"En este capítulo exploraremos los aspectos clave de {topic}.",
            "Aprenderás técnicas probadas que puedes aplicar inmediatamente.",
            "Incluimos ejemplos reales y ejercicios prácticos.",
            "Al final del capítulo, tendrás un plan claro de acción."
        ]
        
        return " ".join(paragraphs)
    
    def generate_key_points(self):
        """Generar puntos clave"""
        return [
            "Punto clave 1: Concepto fundamental",
            "Punto clave 2: Estrategia práctica",
            "Punto clave 3: Herramienta esencial",
            "Punto clave 4: Método de implementación"
        ]
    
    def generate_exercises(self):
        """Generar ejercicios prácticos"""
        return [
            "Ejercicio 1: Aplica el concepto a tu situación",
            "Ejercicio 2: Crea tu plan personalizado",
            "Ejercicio 3: Mide tus resultados",
            "Ejercicio 4: Ajusta y optimiza"
        ]
    
    def generate_resources(self):
        """Generar recursos adicionales"""
        return [
            "Plantilla descargable",
            "Lista de verificación",
            "Enlaces útiles",
            "Recomendaciones de herramientas"
        ]
    
    def get_target_audience(self, topic):
        """Determinar audiencia objetivo"""
        audiences = {
            "Salud": ["Personas saludables", "Deportistas", "Mayores de 40"],
            "Finanzas": ["Emprendedores", "Inversores", "Ahorradores"],
            "Tecnología": ["Desarrolladores", "Marketers", "Empresarios"]
        }
        
        for key, value in audiences.items():
            if key.lower() in topic.lower():
                return value
        
        return ["General", "Interesados en aprender", "Practicantes"]
    
    def calculate_price(self, topic, chapter_count):
        """Calcular precio sugerido"""
        base_price = 9.99
        price_per_chapter = 0.99
        topic_multiplier = 1.5 if "Avanzado" in topic else 1.0
        
        price = base_price + (chapter_count * price_per_chapter * topic_multiplier)
        return round(price, 2)

def main():
    """Ejemplo de uso"""
    generator = ContentGenerator()
    
    # Generar eBook de ejemplo
    ebook = generator.generate_ebook_content("Marketing Digital", "guia_practica")
    
    print(f"📖 eBook generado: {ebook['title']}")
    print(f"📊 Capítulos: {len(ebook['chapters'])}")
    print(f"💰 Precio sugerido: ${ebook['metadata']['price_suggestion']}")
    print(f"🎯 Audiencia: {', '.join(ebook['metadata']['target_audience'])}")
    
    # Guardar
    with open('generated_ebook.json', 'w', encoding='utf-8') as f:
        json.dump(ebook, f, indent=2)
    
    print("\\n✅ eBook guardado en generated_ebook.json")

if __name__ == "__main__":
    main()'''
        
        with open(f"{modules_dir}/content_generator.py", 'w', encoding='utf-8') as f:
            f.write(content_gen)
        
        # Módulo 2: Formateador y diseñador
        formatter = '''#!/usr/bin/env python3
"""
Módulo: Formateador y Diseñador de eBooks
Convierte contenido en eBooks profesionales (PDF, EPUB, MOBI)
"""

import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

class EbookFormatter:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Configurar estilos personalizados"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor='#2c3e50'
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=18,
            spaceAfter=15,
            textColor='#34495e'
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=12,
            textColor='#2c3e50'
        ))
    
    def create_pdf_ebook(self, ebook_data, output_file="ebook_output.pdf"):
        """Crear eBook en formato PDF"""
        print(f"Creando PDF: {output_file}")
        
        doc = SimpleDocTemplate(
            output_file,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # Título
        title = Paragraph(ebook_data["title"], self.styles['CustomTitle'])
        story.append(title)
        story.append(Spacer(1, 0.25*inch))
        
        # Subtítulo
        if "subtitle" in ebook_data:
            subtitle = Paragraph(ebook_data["subtitle"], self.styles['CustomHeading'])
            story.append(subtitle)
            story.append(Spacer(1, 0.5*inch))
        
        # Introducción
        if "introduction" in ebook_data:
            intro = Paragraph(f"<b>Introducción</b><br/>{ebook_data['introduction']}", 
                            self.styles['CustomBody'])
            story.append(intro)
            story.append(Spacer(1, 0.5*inch))
        
        # Capítulos
        if "chapters" in ebook_data:
            for chapter in ebook_data["chapters"]:
                # Título del capítulo
                chap_title = Paragraph(f"<b>{chapter['title']}</b>", 
                                     self.styles['CustomHeading'])
                story.append(chap_title)
                story.append(Spacer(1, 0.25*inch))
                
                # Contenido del capítulo
                if "content" in chapter:
                    content = Paragraph(chapter["content"], self.styles['CustomBody'])
                    story.append(content)
                    story.append(Spacer(1, 0.25*inch))
                
                # Puntos clave
                if "key_points" in chapter and chapter["key_points"]:
                    story.append(Paragraph("<b>Puntos Clave:</b>", self.styles['CustomBody']))
                    for point in chapter["key_points"]:
                        story.append(Paragraph(f"• {point}", self.styles['CustomBody']))
                    story.append(Spacer(1, 0.25*inch))
                
                story.append(Spacer(1, 0.5*inch))
        
        # Conclusión
        if "conclusion" in ebook_data:
            concl = Paragraph(f"<b>Conclusión</b><br/>{ebook_data['conclusion']}", 
                            self.styles['CustomBody'])
            story.append(concl)
            story.append(Spacer(1, 0.25*inch))
        
        # Llamada a la acción
        if "call_to_action" in ebook_data:
            cta = Paragraph(f"<b>{ebook_data['call_to_action']}</b>", 
                          self.styles['CustomHeading'])
            story.append(cta)
        
        # Construir PDF
        doc.build(story)
        print(f"✅ PDF creado exitosamente: {output_file}")
        return output_file
    
    def create_epub_ebook(self, ebook_data, output_file="ebook_output.epub"):
        """Crear eBook en formato EPUB (estructura básica)"""
        print(f"Creando estructura EPUB: {output_file}")
        
        # En producción real, usaría una librería como ebooklib
        # Por ahora creamos la estructura básica
        epub_structure = {
            "format": "EPUB",
            "version": "3.0",
            "metadata": {
                "title": ebook_data.get("title", "eBook sin título"),
                "author": "Ebook Profit Generator",
                "language": "es",
                "identifier": f"ebook-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            },
            "chapters": len(ebook_data.get("chapters", [])),
            "files": [
                "content.opf",
                "toc.ncx",
                "chapter1.xhtml",
                "styles.css"
            ]
        }
        
        with open(output_file.replace('.epub', '_structure.json'), 'w', encoding='utf-8') as f:
            json.dump(epub_structure, f, indent=2)
        
        print(f"✅ Estructura EPUB guardada")
        return output_file.replace('.epub', '_structure.json')

def main():
    """Ejemplo de uso"""
    formatter = EbookFormatter()
    
    # Cargar eBook de ejemplo
    with open('generated_ebook.json', 'r', encoding='utf-8') as f:
        ebook_data = json.load(f)
    
    # Crear PDF
    pdf_file = formatter.create_pdf_ebook(ebook_data, "mi_ebook.pdf")
    
    # Crear estructura EPUB
    epub_structure = formatter.create_epub_ebook(ebook_data, "mi_ebook.epub")
    
    print(f"\\n📁 Archivos creados:")
    print(f"  • {pdf_file}")
    print(f"  • {epub_structure}")
    print("\\n✅ eBook listo para publicación!")

if __name__ == "__main__":
    main()'''
        
        with open(f"{modules_dir}/ebook_formatter.py", 'w', encoding='utf-8') as f:
            f.write(formatter)
        
        # Módulo 3: Sistema de ventas
        sales_system = '''#!/usr/bin/env python3
"""
Módulo: Sistema de Ventas y Monetización
Gestiona ventas, pagos y distribución de eBooks
"""

import json
import random
from datetime import datetime, timedelta

class SalesSystem:
    def __init__(self):
        self.platforms = {
            "amazon_kdp": {
                "royalty": 0.7,  # 70%
                "requirements": ["PDF", "EPUB", "MOBI"],
                "categories": ["Educación", "Negocios", "Salud", "Tecnología"]
            },
            "gumroad": {
                "royalty": 0.85,  # 85%
                "requirements": ["PDF"],
                "features": ["Pay-what-you-want", "Subscriptions"]
            },
            "payhip": {
                "royalty": 0.95,  # 95%
                "requirements": ["PDF", "EPUB"],
                "features": ["Coupons", "Affiliates"]
            }
        }
        
        self.pricing_strategies = [
            "Tiered Pricing",
            "Bundle Pricing",
            "Subscription Model",
            "Pay What You Want",
            "Free + Premium"
        ]
    
    def calculate_profit(self, price, platform, units_sold):
        """Calcular ganancias"""
        royalty_rate = self.platforms[platform]["royalty"]
        revenue = price * units_sold
        platform_fee = revenue * (1 - royalty_rate)
        profit = revenue - platform_fee
        
        return {
            "revenue": round(revenue, 2),
