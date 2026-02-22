#!/usr/bin/env python3
"""
CONTINUACIÓN - PROGRAMA PARA DIBUJOS KDP
"""

import os
import json
import random
from datetime import datetime

class KDPDrawingCreator:
    def __init__(self):
        self.output_dir = "kdp_drawings"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_book_ideas(self, count: int = 10) -> list:
        """Generar múltiples ideas de libros KDP"""
        print(f"Generando {count} ideas de libros KDP...")
        
        ideas = []
        categories = list(self.categories.keys())
        
        for i in range(count):
            category = random.choice(categories)
            idea = self._generate_single_idea(category)
            idea["id"] = i + 1
            idea["priority"] = self._determine_priority(idea)
            ideas.append(idea)
            
            self._print_idea_summary(idea, i + 1)
        
        return ideas
    
    def _generate_single_idea(self, category: str) -> dict:
        """Generar una sola idea de libro"""
        subcategory = random.choice(self.categories[category])
        trend = random.choice(self.current_trends)
        
        return {
            "category": category,
            "subcategory": subcategory,
            "trend": trend,
            "title": self._generate_title(category, subcategory, trend),
            "description": self._generate_description(category, subcategory, trend),
            "page_count": self._get_page_count(category),
            "book_size": self._get_book_size(category),
            "interior_type": self._get_interior_type(category),
            "cover_style": self._get_cover_style(category),
            "target_audience": self._get_target_audience(category),
            "keywords": self._get_keywords(category, subcategory, trend),
            "competition": self._get_competition_level(subcategory),
            "demand": self._get_market_demand(category),
            "earnings_potential": self._get_earnings_potential(category),
            "creation_time": self._get_creation_time(category),
            "tools_required": self._get_tools_required(category)
        }
    
    def _generate_title(self, category: str, subcategory: str, trend: str) -> str:
        """Generar título"""
        templates = {
            "coloring_books": [
                "{trend} {subcategory} Coloring Book",
                "The Art of {trend}: {subcategory} Edition",
                "{subcategory} Coloring: A {trend} Journey",
                "Mindful {subcategory}: {trend} Coloring Book"
            ],
            "activity_books": [
                "{trend} {subcategory} Challenge",
                "Brain Games: {trend} {subcategory}",
                "{subcategory} Adventures: {trend} Theme",
                "The Ultimate {trend} {subcategory} Book"
            ],
            "journals": [
                "{trend} {subcategory} Journal",
                "My {trend} {subcategory} Companion",
                "{subcategory} for {trend} Enthusiasts",
                "The {trend} {subcategory} Guide"
            ],
            "kids_books": [
                "{trend} {subcategory} for Kids",
                "Fun with {subcategory}: {trend} Edition",
                "{subcategory} Learning: {trend} Theme",
                "{trend} Adventures: {subcategory} Book"
            ]
        }
        
        template = random.choice(templates.get(category, templates["coloring_books"]))
        return template.format(subcategory=subcategory, trend=trend)
    
    def _generate_description(self, category: str, subcategory: str, trend: str) -> str:
        """Generar descripción"""
        descriptions = {
            "coloring_books": f"""Escape into a world of creativity with this beautiful {subcategory.lower()} coloring book inspired by {trend.lower()}!

FEATURES:
• {random.randint(50, 100)} unique and intricate designs
• Single-sided pages to prevent bleed-through
• Various difficulty levels for all skill levels
• High-quality paper perfect for all coloring mediums
• Perforated pages for easy removal and display

PERFECT FOR:
• {trend.lower()} enthusiasts and practitioners
• Stress relief and mindfulness practice
• Artists seeking inspiration
• Gift-giving for any occasion

Experience the therapeutic benefits of coloring while exploring {trend.lower()} themes!""",
            
            "activity_books": f"""Challenge your mind with this engaging {subcategory.lower()} book focused on {trend.lower()}!

INCLUDES:
• {random.randint(100, 200)} carefully crafted activities
• Progressive difficulty from beginner to expert
• Solutions provided for all puzzles
• Large, easy-to-read print
• High-quality paper that prevents bleed-through

BENEFITS:
• Enhances cognitive function and memory
• Provides hours of entertainment
• Perfect for travel or relaxation
• Suitable for all ages and skill levels

Keep your mind sharp while exploring {trend.lower()} concepts!""",
            
            "journals": f"""Embark on a transformative {trend.lower()} journey with this beautifully designed {subcategory.lower()}!

THIS JOURNAL OFFERS:
• {random.randint(100, 200)} pages for daily reflection
• Thought-provoking prompts and questions
• Inspirational quotes throughout
• High-quality paper suitable for all pens
• Durable cover for daily use

IDEAL FOR:
• Tracking {trend.lower()} progress and insights
• Daily gratitude and reflection practice
• Goal setting and achievement tracking
• Creating a lasting record of your journey

Start your {trend.lower()} adventure today!"""
        }
        
        return descriptions.get(category, descriptions["coloring_books"])
    
    def _get_page_count(self, category: str) -> int:
        """Obtener conteo de páginas"""
        ranges = {
            "coloring_books": (50, 100),
            "activity_books": (100, 200),
            "journals": (120, 240),
            "kids_books": (40, 80)
        }
        low, high = ranges.get(category, (50, 100))
        return random.randint(low, high)
    
    def _get_book_size(self, category: str) -> str:
        """Obtener tamaño del libro"""
        sizes = {
            "coloring_books": ["8.5\" x 11\"", "8.5\" x 8.5\"", "7\" x 10\""],
            "activity_books": ["8.5\" x 11\"", "6\" x 9\"", "7\" x 10\""],
            "journals": ["6\" x 9\"", "5.5\" x 8.5\"", "7\" x 10\""],
            "kids_books": ["8.5\" x 11\"", "8.5\" x 8.5\"", "7\" x 10\""]
        }
        return random.choice(sizes.get(category, ["8.5\" x 11\""]))
    
    def _get_interior_type(self, category: str) -> str:
        """Obtener tipo de interior"""
        types = {
            "coloring_books": "Black & White Interior with White Paper",
            "activity_books": "Black & White Interior with White Paper",
            "journals": "Black & White Interior with Cream Paper",
            "kids_books": "Color Interior with White Paper"
        }
        return types.get(category, "Black & White Interior with White Paper")
    
    def _get_cover_style(self, category: str) -> str:
        """Obtener estilo de portada"""
        styles = {
            "coloring_books": "Minimalist with one prominent colored illustration",
            "activity_books": "Bright and engaging with puzzle elements",
            "journals": "Elegant and sophisticated with subtle textures",
            "kids_books": "Colorful and playful with cartoon characters"
        }
        return styles.get(category, "Professional and eye-catching")
    
    def _get_target_audience(self, category: str) -> list:
        """Obtener audiencia objetivo"""
        audiences = {
            "coloring_books": [
                "Adults seeking stress relief",
                "Art therapy patients",
                "Seniors looking for hobbies",
                "Teens interested in art"
            ],
            "activity_books": [
                "Puzzle enthusiasts",
                "Parents seeking educational activities",
                "Teachers for classroom use",
                "Travelers needing entertainment"
            ],
            "journals": [
                "People practicing mindfulness",
                "Students and professionals",
                "Goal-oriented individuals",
                "Therapy patients"
            ],
            "kids_books": [
                "Parents of young children",
                "Preschool teachers",
                "Homeschooling families",
                "Childcare centers"
            ]
        }
        return random.sample(audiences.get(category, ["General audience"]), 3)
    
    def _get_keywords(self, category: str, subcategory: str, trend: str) -> list:
        """Obtener palabras clave"""
        base = [
            subcategory.lower(),
            trend.lower(),
            f"{subcategory.lower()} book",
            f"{trend.lower()} activities",
            "Amazon KDP"
        ]
        
        category_words = {
            "coloring": ["stress relief", "relaxation", "art therapy", "creative"],
            "activity": ["brain games", "puzzles", "educational", "learning"],
            "journal": ["self-reflection", "personal growth", "goal setting"]
        }
        
        cat_key = category.split("_")[0]
        extra = category_words.get(cat_key, [])
        
        trending = ["bestseller", "gift idea", "new release", "hot seller"]
        
        all_words = base + extra + trending
        return random.sample(all_words, min(7, len(all_words)))
    
    def _get_competition_level(self, subcategory: str) -> str:
        """Obtener nivel de competencia"""
        high_comp = ["Adult Coloring Books", "Gratitude Journals", "Word Search Books"]
        if subcategory in high_comp:
            return "High"
        elif "Kids" in subcategory or "Children" in subcategory:
            return "Medium"
        return random.choice(["Low", "Medium"])
    
    def _get_market_demand(self, category: str) -> str:
        """Obtener demanda del mercado"""
        high_demand = ["coloring_books", "journals"]
        medium_demand = ["activity_books", "kids_books"]
        
        if category in high_demand:
            return "Very High"
        elif category in medium_demand:
            return "High"
        return "Medium"
    
    def _get_earnings_potential(self, category: str) -> dict:
        """Obtener potencial de ganancias"""
        base_prices = {
            "coloring_books": 6.99,
            "activity_books": 7.99,
            "journals": 8.99,
            "kids_books": 5.99
        }
        
        base = base_prices.get(category, 6.99)
        royalty = 0.60
        
        return {
            "price": f"${base:.2f}",
            "profit_per_book": f"${base * royalty:.2f}",
            "monthly_sales_range": "100-1000 copies",
            "monthly_earnings": f"${100 * base * royalty:.2f} - ${1000 * base * royalty:.2f}",
            "yearly_earnings": f"${100 * 12 * base * royalty:.2f} - ${1000 * 12 * base * royalty:.2f}"
        }
    
    def _get_creation_time(self, category: str) -> str:
        """Obtener tiempo de creación"""
        times = {
            "coloring_books": "2-4 weeks",
            "activity_books": "1-2 weeks",
            "journals": "1-3 weeks",
            "kids_books": "2-3 weeks"
        }
        return times.get(category, "2-3 weeks")
    
    def _get_tools_required(self, category: str) -> list:
        """Obtener herramientas requeridas"""
        tools = {
            "coloring_books": [
                "Adobe Illustrator/Procreate",
                "Drawing tablet",
                "KDP templates",
                "Color palette tools"
            ],
            "activity_books": [
                "Microsoft Word/Google Docs",
                "Puzzle generators",
                "KDP templates",
                "Font libraries"
            ],
            "journals": [
                "Canva/Adobe InDesign",
                "Journal templates",
                "Font pairing tools",
                "Cover design software"
            ],
            "kids_books": [
                "Children's illustration software",
                "Educational templates",
                "Colorful fonts",
                "Character design tools"
            ]
        }
        return tools.get(category, ["Design software", "KDP templates"])
    
    def _determine_priority(self, idea: dict) -> str:
        """Determinar prioridad"""
        demand = idea["demand"]
        competition = idea["competition"]
        
        if demand == "Very High" and competition in ["Low", "Medium"]:
            return "High"
        elif demand == "High" and competition == "Low":
            return "High"
        elif demand == "Medium" and competition == "Low":
            return "Medium"
        else:
            return "Low"
    
    def _print_idea_summary(self, idea: dict, index: int):
        """Imprimir resumen de idea"""
        print(f"\n{index}. {idea['title']}")
        print(f"   📂 Categoría: {idea['category']} > {idea['subcategory']}")
        print(f"   📊 Páginas: {idea['page_count']} | Tamaño: {idea['book_size']}")
        print(f"   🎯 Audiencia: {', '.join(idea['target_audience'][:2])}")
        print(f"   💰 Ganancia/libro: {idea['earnings_potential']['profit_per_book']}")
        print(f"   📈 Demanda: {idea['demand']} | Competencia: {idea['competition']}")
        print(f"   ⏱️ Tiempo: {idea['creation_time']} | Prioridad: {idea['priority']}")
    
    def create_design_templates(self, ideas: list):
        """Crear plantillas de diseño"""
        print("\n" + "=" * 60)
        print("CREANDO PLANTILLAS DE DISEÑO")
        print("=" * 60)
        
        templates_dir = os.path.join(self.output_dir, "design_templates")
        os.makedirs(templates_dir, exist_ok=True)
        
        for idea in ideas:
            if idea["priority"] in ["High", "Medium"]:
                template = self._create_single_template(idea)
                self._save_template(template, templates_dir)
    
    def _create_single_template(self, idea: dict) -> dict:
        """Crear plantilla individual"""
        return {
            "book_info": {
                "title": idea["title"],
                "category": idea["category"],
                "subcategory": idea["subcategory"]
            },
            "design_specs": {
                "page_size": idea["book_size"],
                "bleed": "0.125 inches",
                "margins": "0.5 inches minimum",
                "safe_zone": "0.25 inches from edges"
            },
            "cover_design": {
                "front": {
                    "title_position": "Center top 1/3",
                    "subtitle_position": "Below title",
                    "image_position": "Center",
                    "author_position": "Bottom center"
                },
                "back": {
                    "description_position": "Top 2/3",
                    "barcode_position": "Bottom right",
                    "price_position": "Near barcode"
                },
                "spine": {
                    "title_orientation": "Vertical or horizontal",
                    "author_position": "Below title"
                }
            },
            "interior_layout": {
                "page_numbers": "Bottom center",
                "chapter_starts": "Right-hand pages",
                "header_footer": "Minimal or none",
                "content_margins": "0.75 inches"
            },
            "color_palette": self._generate_color_palette(idea["category"], idea["trend"]),
            "typography": {
                "title_font": self._get_title_font(idea["category"]),
                "body_font": self._get_body_font(idea["category"]),
                "font_sizes": {
                    "title": "48-72pt",
                    "subtitle": "24-36pt",
                    "body": "10-12pt"
                }
            },
            "file_requirements": {
                "format": "PDF",
                "color_mode": "CMYK",
                "resolution": "300 DPI",
                "file_naming": "Title_Interior_Cover_Version.pdf"
            }
        }
    
    def _generate_color_palette(self, category: str, trend: str) -> list:
        """Generar paleta de colores"""
        palettes = {
            "coloring_books": [
                {"name": "Primary", "hex": "#2E294E"},
                {"name": "Accent", "hex": "#1B998B"},
                {"name": "Highlight", "hex": "#F46036"},
                {"name": "Background", "hex": "#FFFFFF"}
            ],
            "activity_books": [
                {"name": "Primary", "hex": "#3A506B"},
                {"name": "Accent", "hex": "#5BC0BE"},
                {"name": "Highlight", "hex": "#FF9F1C"},
                {"name": "Background", "hex": "#F7F9FC"}
            ],
            "journals": [
                {"name": "Primary", "hex": "#4A4A4A"},
                {"name": "Accent", "hex": "#8A8A8A"},
                {"name": "Highlight", "hex": "#D4AF37"},
                {"name": "Background", "hex