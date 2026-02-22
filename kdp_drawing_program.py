#!/usr/bin/env python3
"""
Programa para Crear Dibujos para KDP (Amazon Kindle Direct Publishing)
Sistema de generación de ilustraciones para libros y productos
"""

import os
import json
from datetime import datetime

def create_kdp_drawing_system():
    """Crear sistema completo para dibujos KDP"""
    print("🎨 CREANDO PROGRAMA PARA DIBUJOS KDP")
    print("="*60)
    
    # Directorio principal
    os.makedirs("kdp_drawing_pro", exist_ok=True)
    
    # 1. Programa principal
    main_program = '''#!/usr/bin/env python3
"""
KDP DRAWING PRO - Sistema de creación de ilustraciones para Amazon KDP
"""

import json
import random
from datetime import datetime

class KDPDrawingGenerator:
    def __init__(self):
        self.categories = [
            "Libros infantiles",
            "Libros de colorear para adultos", 
            "Journaling y planners",
            "Educativos",
            "Ficción",
            "No ficción",
            "Romance",
            "Misterio",
            "Fantasia",
            "Ciencia ficción"
        ]
        
        self.styles = [
            "Minimalista",
            "Realista",
            "Acuarela",
            "Vectorial",
            "Dibujo a mano",
            "Digital painting",
            "Comic/Manga",
            "Retro/Vintage",
            "Moderno",
            "Abstracto"
        ]
        
        self.formats = {
            "paperback": {"dimensions": "6x9 pulgadas", "dpi": 300, "color_mode": "CMYK"},
            "hardcover": {"dimensions": "7x10 pulgadas", "dpi": 300, "color_mode": "CMYK"},
            "coloring_book": {"dimensions": "8.5x11 pulgadas", "dpi": 300, "color_mode": "CMYK"},
            "journal": {"dimensions": "6x9 pulgadas", "dpi": 300, "color_mode": "CMYK"}
        }
    
    def generate_project_idea(self):
        """Generar idea para proyecto KDP"""
        category = random.choice(self.categories)
        style = random.choice(self.styles)
        format_type = random.choice(list(self.formats.keys()))
        
        ideas = {
            "Libros infantiles": [
                "Animales del bosque",
                "Aventuras espaciales",
                "Criaturas mágicas",
                "Medios de transporte",
                "Profesiones"
            ],
            "Libros de colorear para adultos": [
                "Mandalas complejas",
                "Patrones geométricos",
                "Naturaleza detallada",
                "Arquitectura",
                "Animales en detalle"
            ],
            "Journaling y planners": [
                "Páginas decorativas",
                "Encabezados creativos",
                "Bordes ornamentales",
                "Iconos temáticos",
                "Trackers visuales"
            ]
        }
        
        theme = random.choice(ideas.get(category, ["Tema creativo", "Ilustraciones únicas"]))
        
        return {
            "category": category,
            "style": style,
            "format": format_type,
            "theme": theme,
            "pages": random.randint(50, 150),
            "illustrations_needed": random.randint(20, 100),
            "price_suggestion": round(random.uniform(4.99, 24.99), 2),
            "potential_royalty": round(random.uniform(500, 5000), 2)
        }
    
    def create_project_plan(self, idea):
        """Crear plan detallado del proyecto"""
        print(f"\\n📐 Creando proyecto: {idea['theme']} ({idea['category']})")
        
        project = {
            "metadata": {
                "title": f"{idea['theme']} - {idea['style']} Style",
                "category": idea["category"],
                "format": idea["format"],
                "created": datetime.now().isoformat(),
                "target_market": "Amazon KDP"
            },
            "specifications": self.get_specifications(idea["format"]),
            "illustration_plan": self.create_illustration_plan(idea),
            "production_timeline": self.create_timeline(idea),
            "monetization": self.create_monetization_plan(idea)
        }
        
        return project
    
    def get_specifications(self, format_type):
        """Obtener especificaciones técnicas"""
        specs = self.formats[format_type]
        
        return {
            **specs,
            "bleed": "0.125 pulgadas",
            "margins": "0.5 pulgadas mínimo",
            "file_format": "PDF/X-1a recomendado",
            "color_profile": "US Web Coated (SWOP) v2",
            "fonts": "Embedded or outlined",
            "image_quality": "High resolution, no compression"
        }
    
    def create_illustration_plan(self, idea):
        """Crear plan de ilustraciones"""
        illustration_types = {
            "Libros infantiles": ["Portada", "Personajes", "Escenarios", "Objetos", "Acciones"],
            "Libros de colorear": ["Portada", "Páginas complejas", "Páginas simples", "Patrones", "Bordes"],
            "Journaling": ["Portada", "Páginas mensuales", "Páginas semanales", "Trackers", "Decoraciones"]
        }
        
        types = illustration_types.get(idea["category"], ["Portada", "Interior", "Detalles"])
        
        illustrations = []
        for i in range(idea["illustrations_needed"]):
            ill_type = random.choice(types)
            illustrations.append({
                "id": i + 1,
                "type": ill_type,
                "complexity": random.choice(["simple", "medium", "complex"]),
                "estimated_time": random.randint(30, 180),  # minutos
                "description": f"{ill_type} en estilo {idea['style']}",
                "tools_recommended": self.get_tools_for_style(idea["style"])
            })
        
        return {
            "total_illustrations": idea["illustrations_needed"],
            "types": list(set(types)),
            "list": illustrations[:10],  # Mostrar solo primeros 10
            "total_time_hours": sum(ill["estimated_time"] for ill in illustrations) / 60
        }
    
    def get_tools_for_style(self, style):
        """Recomendar herramientas según estilo"""
        tools = {
            "Minimalista": ["Adobe Illustrator", "Figma", "Inkscape"],
            "Realista": ["Adobe Photoshop", "Procreate", "Clip Studio Paint"],
            "Acuarela": ["Watercolor brushes", "Procreate", "Rebelle"],
            "Vectorial": ["Adobe Illustrator", "Affinity Designer", "CorelDRAW"],
            "Dibujo a mano": ["iPad + Apple Pencil", "Wacom Tablet", "Traditional media"]
        }
        
        return tools.get(style, ["Adobe Creative Suite", "Procreate", "Affinity"])
    
    def create_timeline(self, idea):
        """Crear línea de tiempo de producción"""
        total_hours = idea["illustrations_needed"] * 1.5  # Estimación
        
        return {
            "research": "2-3 días",
            "sketching": "3-5 días",
            "illustration": f"{int(total_hours/8)} días laborables",
            "formatting": "2-3 días",
            "review": "1-2 días",
            "publishing": "1 día",
            "total_estimated": f"{int(total_hours/8 + 10)} días"
        }
    
    def create_monetization_plan(self, idea):
        """Crear plan de monetización"""
        # Cálculos de Amazon KDP
        price = idea["price_suggestion"]
        pages = idea["pages"]
        
        # Costos de impresión de Amazon (estimado)
        printing_cost = 0.85 + (pages * 0.012)  # Fórmula simplificada
        
        # Regalías (60% para precios $2.99-$9.99, 35% fuera de ese rango)
        if 2.99 <= price <= 9.99:
            royalty_rate = 0.60
        else:
            royalty_rate = 0.35
        
        royalty_per_book = (price - printing_cost) * royalty_rate
        
        return {
            "suggested_price": price,
            "printing_cost": round(printing_cost, 2),
            "royalty_rate": f"{royalty_rate*100}%",
            "royalty_per_book": round(royalty_per_book, 2),
            "break_even_sales": max(1, int(100 / royalty_per_book)),  # Asumiendo $100 de inversión
            "monthly_sales_projections": {
                "conservative": random.randint(50, 200),
                "realistic": random.randint(200, 500),
                "optimistic": random.randint(500, 1000)
            },
            "monthly_income_projections": {
                "conservative": round(royalty_per_book * 100, 2),
                "realistic": round(royalty_per_book * 300, 2),
                "optimistic": round(royalty_per_book * 750, 2)
            }
        }
    
    def save_project(self, project, filename):
        """Guardar proyecto en archivo"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(project, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Proyecto guardado: {filename}")
        
        # Mostrar resumen
        print(f"\\n📊 RESUMEN DEL PROYECTO:")
        print(f"   Título: {project['metadata']['title']}")
        print(f"   Ilustraciones: {project['illustration_plan']['total_illustrations']}")
        print(f"   Tiempo estimado: {project['illustration_plan']['total_time_hours']:.1f} horas")
        print(f"   Regalía por libro: ${project['monetization']['royalty_per_book']}")
        
        return filename

def main():
    """Función principal"""
    print("🎨 KDP DRAWING PRO - Generador de Proyectos de Ilustración")
    print("="*60)
    
    generator = KDPDrawingGenerator()
    
    # Generar 3 proyectos
    print("\\n💡 GENERANDO PROYECTOS PARA KDP:")
    print("-"*40)
    
    projects = []
    for i in range(3):
        idea = generator.generate_project_idea()
        print(f"\\n{i+1}. {idea['theme']}")
        print(f"   Categoría: {idea['category']}")
        print(f"   Estilo: {idea['style']}")
        print(f"   Formato: {idea['format']}")
        print(f"   Ilustraciones: {idea['illustrations_needed']}")
        print(f"   Precio sugerido: ${idea['price_suggestion']}")
        
        # Crear proyecto completo
        project = generator.create_project_plan(idea)
        filename = f"kdp_project_{i+1}_{idea['category'].lower().replace(' ', '_')}.json"
        generator.save_project(project, filename)
        projects.append(project)
    
    # Calcular totales
    total_illustrations = sum(p["illustration_plan"]["total_illustrations"] for p in projects)
    total_hours = sum(p["illustration_plan"]["total_time_hours"] for p in projects)
    avg_royalty = sum(p["monetization"]["royalty_per_book"] for p in projects) / len(projects)
    
    print(f"\\n📈 REPORTE GENERAL:")
    print("="*40)
    print(f"Total proyectos: {len(projects)}")
    print(f"Total ilustraciones: {total_illustrations}")
    print(f"Total horas estimadas: {total_hours:.1f}")
    print(f"Regalía promedio por libro: ${avg_royalty:.2f}")
    
    # Proyección de ingresos
    monthly_sales = 300  # Estimación conservadora
    monthly_income = avg_royalty * monthly_sales
    
    print(f"\\n💰 PROYECCIÓN DE INGRESOS (mensual):")
    print(f"   Ventas estimadas: {monthly_sales} libros/mes")
    print(f"   Ingreso estimado: ${monthly_income:.2f}/mes")
    print(f"   Ingreso anual: ${monthly_income * 12:.2f}/año")
    
    # Guardar reporte
    report = {
        "total_projects": len(projects),
        "total_illustrations": total_illustrations,
        "total_hours": total_hours,
        "average_royalty": avg_royalty,
        "monthly_projection": {
            "sales": monthly_sales,
            "income": monthly_income,
            "annual_income": monthly_income * 12
        },
        "generated_date": datetime.now().isoformat()
    }
    
    with open('kdp_projects_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    
    print(f"\\n✅ Reporte guardado en: kdp_projects_report.json")
    
    print("\\n🎯 PRÓXIMOS PASOS:")
    print("1. Desarrollar ilustraciones según plan")
    print("2. Formatear según especificaciones KDP")
    print("3. Crear portada atractiva")
    print("4. Publicar en Amazon KDP")
    print("5. Promocionar el libro")

if __name__ == "__main__":
    main()'''
    
    with open("kdp_drawing_pro/main.py", 'w', encoding='utf-8') as f:
        f.write(main_program)
    
    # 2. Guía de especificaciones KDP
    kdp_guide = '''# GUÍA COMPLETA DE ESPECIFICACIONES KDP

## Formatos de Libro

### 1. Tapa Blanda (Paperback)
- **Tamaños estándar:**
  - 5" x 8" (12.7 x 20.32 cm)
  - 6" x 9" (15.24 x 22.86 cm) ← Más popular
  - 8.5" x 11" (21.59 x 27.94 cm)
- **Resolución:** 300 DPI mínimo
- **Modo color:** CMYK
- **Sangrado:** 0.125" (3.175 mm)
- **Márgenes:** 0.5" mínimo

### 2. Tapa Dura (Hardcover)
- **Tamaños disponibles:**
  - 6" x 9" (15.24 x 22.86 cm)
  - 7" x 10" (17.78 x 25.4 cm)
  - 8.5" x 11" (21.59 x 27.94 cm)
- **Resolución:** 300 DPI
- **Cubierta:** Incluye lomo y solapas

### 3. Libros para Colorear
- **Tamaño recomendado:** 8.5" x 11"
- **Papel:** Blanco premium (90 gsm)
- **Impresión:** Una cara (single-sided)
- **Encuadernación:** Perfecta (sin espiral)

## Especificaciones Técnicas

### Archivos de Interior
- **Formato:** PDF
- **Versión PDF:** 1.3, 1.4 o 1.6
- **Compresión:** Sin compresión JPEG
- **Fuentes:** Incrustadas o convertidas a curvas
- **Perfil color:** US Web Coated (SWOP) v2

### Portadas
- **Resolución:** 300 DPI
- **Modo color:** CMYK
- **Plantilla:** Usar generador de KDP
- **Espacio para código de barras:** 2" x 1.2"

## Ilustraciones para KDP

### Estilos Populares
1. **Minimalista:** Líneas limpias, colores planos
2. **Acuarela:** Efectos de pintura, texturas
3. **Vectorial:** Formas geométricas, escalable
4. **Realista:** Detallado, sombreado profesional
5. **Dibujo a mano:** Orgánico, personal

### Herramientas Recomendadas
- **Adobe Illustrator:** Vectorial, portadas
- **Adobe Photoshop:** Ilustraciones, retoque
- **Procreate:** Dibujo digital, texturas
- **Affinity Designer/Photo:** Alternativa económica
- **Canva:** Plantillas rápidas

### Flujo de Trabajo
1. **Investigación:** Nicho, competencia, tendencias
2. **Sketching:** Bocetos en baja resolución
3. **Lineart:** Líneas limpias y definidas
4. **Color:** Paletas coherentes
5. **Sombreado:** Profundidad y volumen
6. **Detalles:** Texturas, efectos finales
7. **Exportación:** Formatos correctos

## Monetización en KDP

### Estructura de Precios
- **Libros infantiles:** $4.99 - $12.99
- **Libros para colorear:** $6.99 - $9.99
- **Journaling:** $8.99 - $14.99
- **Ficción:** $2.99 - $9.99
- **No ficción:** $9.99 - $19.99

### Regalías
- **60%:** Para precios $2.99-$9.99 (ciertos países