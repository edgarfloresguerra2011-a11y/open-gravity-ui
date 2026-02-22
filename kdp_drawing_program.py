#!/usr/bin/env python3
"""
PROGRAMA PARA HACER DIBUJOS PARA KDP (Kindle Direct Publishing)
Sistema automatizado de creación de libros para colorear y libros de actividades
"""

import os
import json
import random
from datetime import datetime
from typing import List, Dict, Any

class KDPDrawingCreator:
    def __init__(self):
        self.output_dir = "kdp_drawings"
        self.templates_dir = os.path.join(self.output_dir, "templates")
        self.market_research_dir = os.path.join(self.output_dir, "market_research")
        
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.templates_dir, exist_ok=True)
        os.makedirs(self.market_research_dir, exist_ok=True)
        
        # Categorías populares en KDP
        self.categories = {
            "coloring_books": [
                "Adult Coloring Books",
                "Children's Coloring Books", 
                "Mandala Coloring Books",
                "Animal Coloring Books",
                "Fantasy Coloring Books",
                "Floral Coloring Books"
            ],
            "activity_books": [
                "Dot to Dot Books",
                "Maze Books",
                "Word Search Books",
                "Sudoku Books",
                "Crossword Books",
                "Puzzle Books"
            ],
            "journals": [
                "Gratitude Journals",
                "Bullet Journals",
                "Travel Journals",
                "Fitness Journals",
                "Recipe Journals",
                "Dream Journals"
            ],
            "kids_books": [
                "ABC Learning Books",
                "Number Tracing Books",
                "Shape Learning Books",
                "Story Coloring Books",
                "Activity Workbooks",
                "Educational Worksheets"
            ]
        }
        
        # Tendencias actuales en KDP
        self.current_trends = [
            "Mindfulness and Meditation",
            "Mental Health Awareness",
            "Sustainable Living",
            "Digital Detox",
            "Self-Care and Wellness",
            "Minimalist Lifestyle"
        ]
        
        # Palabras clave populares
        self.popular_keywords = {
            "coloring": ["stress relief", "relaxation", "art therapy", "creative", "meditative"],
            "activity": ["brain games", "puzzles", "educational", "learning", "fun activities"],
            "journal": ["self-reflection", "personal growth", "goal setting", "planning", "organization"]
        }
    
    def generate_book_idea(self, category: str = None) -> Dict[str, Any]:
        """Generar idea de libro para KDP"""
        if not category:
            category = random.choice(list(self.categories.keys()))
        
        subcategory = random.choice(self.categories[category])
        trend = random.choice(self.current_trends)
        
        # Generar título atractivo
        title = self._generate_title(category, subcategory, trend)
        
        # Generar descripción
        description = self._generate_description(category, subcategory, trend)
        
        # Calcular potencial de ganancias
        earnings = self._calculate_earnings(category)
        
        idea = {
            "category": category,
            "subcategory": subcategory,
            "trend": trend,
            "title": title,
            "description": description,
            "page_count": self._determine_page_count(category),
            "interior_type": self._determine_interior_type(category),
            "cover_type": "Matte or Glossy",
            "size": self._determine_book_size(category),
            "keywords": self._generate_keywords(category, subcategory, trend),
            "target_audience": self._determine_target_audience(category),
            "competition_level": self._assess_competition(category, subcategory),
            "market_demand": self._assess_market_demand(category),
            "earnings_potential": earnings,
            "creation_time": self._estimate_creation_time(category),
            "tools_needed": self._determine_tools_needed(category)
        }
        
        return idea
    
    def _generate_title(self, category: str, subcategory: str, trend: str) -> str:
        """Generar título atractivo"""
        title_patterns = {
            "coloring_books": [
                "{trend} Coloring Book: {subcategory}",
                "{subcategory} Coloring Book for {trend}",
                "The Ultimate {subcategory} Coloring Book",
                "{trend} Inspired {subcategory} Coloring Book"
            ],
            "activity_books": [
                "{trend} {subcategory} Book",
                "{subcategory} Activities for {trend}",
                "The Big Book of {subcategory} for {trend}",
                "{trend} Themed {subcategory}"
            ],
            "journals": [
                "{trend} {subcategory}",
                "{subcategory} for {trend}",
                "My {trend} {subcategory}",
                "The {trend} {subcategory} Companion"
            ],
            "kids_books": [
                "{subcategory} for Kids: {trend} Edition",
                "{trend} {subcategory} for Children",
                "Fun {subcategory}: {trend} Theme",
                "{trend} Learning {subcategory}"
            ]
        }
        
        pattern = random.choice(title_patterns.get(category, title_patterns["coloring_books"]))
        return pattern.format(subcategory=subcategory, trend=trend)
    
    def _generate_description(self, category: str, subcategory: str, trend: str) -> str:
        """Generar descripción persuasiva"""
        descriptions = {
            "coloring_books": f"""Discover the perfect {trend.lower()} escape with this beautiful {subcategory.lower()}!

This coloring book features:
• {random.randint(50, 100)} unique and intricate designs
• Single-sided pages to prevent bleed-through
• A variety of difficulty levels from simple to complex
• High-quality paper perfect for colored pencils, markers, or gel pens
• Perforated pages for easy removal and display

Perfect for:
• {trend} enthusiasts seeking creative expression
• Stress relief and mindfulness practice
• Artists looking for inspiration
• Gift-giving for any occasion

Unleash your creativity and experience the therapeutic benefits of coloring today!""",
            
            "activity_books": f"""Challenge your mind with this engaging {subcategory.lower()} focused on {trend.lower()}!

Features include:
• {random.randint(100, 200)} carefully crafted activities
• Increasing difficulty levels to keep you engaged
• Solutions provided at the back of the book
• Large print for easy reading
• High-quality paper that prevents bleed-through

Benefits:
• Improves cognitive function and memory
• Provides hours of entertainment
• Perfect for travel or relaxation
• Suitable for all skill levels

Keep your mind sharp and entertained with this must-have activity book!""",
            
            "journals": f"""Embark on your {trend.lower()} journey with this beautifully designed {subcategory.lower()}!

This journal includes:
• {random.randint(100, 200)} pages for daily entries
• Prompts and questions to guide your reflection
• Inspirational quotes throughout
• High-quality paper that works with most pens
• Durable cover for daily use

Perfect for:
• Tracking your {trend.lower()} progress
• Daily reflection and gratitude practice
• Goal setting and achievement tracking
• Creating lasting memories

Start your transformative journey today!"""
        }
        
        return descriptions.get(category, descriptions["coloring_books"])
    
    def _calculate_earnings(self, category: str) -> Dict[str, Any]:
        """Calcular ganancias potenciales"""
        # Precios típicos en KDP por categoría
        base_prices = {
            "coloring_books": 6.99,
            "activity_books": 7.99,
            "journals": 8.99,
            "kids_books": 5.99
        }
        
        base_price = base_prices.get(category, 6.99)
        royalty_rate = 0.60  # 60% royalty para libros de impresión bajo demanda
        
        return {
            "suggested_price": f"${base_price:.2f}",
            "production_cost": f"${base_price * 0.4:.2f}",
            "profit_per_book": f"${base_price * royalty_rate:.2f}",
            "monthly_sales_low": 100,
            "monthly_sales_high": 1000,
            "monthly_earnings_low": f"${100 * base_price * royalty_rate:.2f}",
            "monthly_earnings_high": f"${1000 * base_price * royalty_rate:.2f}",
            "yearly_earnings_low": f"${100 * 12 * base_price * royalty_rate:.2f}",
            "yearly_earnings_high": f"${1000 * 12 * base_price * royalty_rate:.2f}"
        }
    
    def _determine_page_count(self, category: str) -> int:
        """Determinar número de páginas"""
        page_ranges = {
            "coloring_books": (50, 100),
            "activity_books": (100, 200),
            "journals": (150, 250),
            "kids_books": (30, 80)
        }
        
        low, high = page_ranges.get(category, (50, 100))
        return random.randint(low, high)
    
    def _determine_interior_type(self, category: str) -> str:
        """Determinar tipo de interior"""
        interiors = {
            "coloring_books": "Black & White Interior with White Paper",
            "activity_books": "Black & White Interior with White Paper",
            "journals": "Black & White Interior with Cream Paper",
            "kids_books": "Color Interior with White Paper"
        }
        
        return interiors.get(category, "Black & White Interior with White Paper")
    
    def _determine_book_size(self, category: str) -> str:
        """Determinar tamaño del libro"""
        sizes = {
            "coloring_books": ["8.5\" x 11\"", "8.5\" x 8.5\"", "7\" x 10\""],
            "activity_books": ["8.5\" x 11\"", "6\" x 9\"", "7\" x 10\""],
            "journals": ["6\" x 9\"", "5.5\" x 8.5\"", "7\" x 10\""],
            "kids_books": ["8.5\" x 11\"", "8.5\" x 8.5\"", "7\" x 10\""]
        }
        
        return random.choice(sizes.get(category, ["8.5\" x 11\""]))
    
    def _generate_keywords(self, category: str, subcategory: str, trend: str) -> List[str]:
        """Generar palabras clave para KDP"""
        base_keywords = [
            subcategory.lower(),
            trend.lower(),
            f"{subcategory.lower()} book",
            f"{trend.lower()} activities",
            "Amazon KDP",
            "print on demand"
        ]
        
        # Agregar keywords específicas por categoría
        category_keywords = self.popular_keywords.get(category.split("_")[0], [])
        
        # Agregar palabras clave de moda
        trending_keywords = [
            "bestseller",
            "gift idea",
            "new release",
            "hot seller",
            "trending now"
        ]
        
        all_keywords = base_keywords + category_keywords + trending_keywords
        return random.sample(all_keywords, min(7, len(all_keywords)))
    
    def _determine_target_audience(self, category: str) -> List[str]:
        """Determinar audiencia objetivo"""
        audiences = {
            "coloring_books": [
                "Adults seeking stress relief",
                "Art therapy patients",
                "Seniors looking for hobbies",
                "Teens interested in art",
                "Gift buyers for special occasions"
            ],
            "activity_books": [
                "Puzzle enthusiasts",
                "Parents seeking educational activities",
                "Teachers for classroom use",
                "Travelers needing entertainment",
                "Seniors maintaining cognitive health"
            ],
            "journals": [
                "People practicing mindfulness",
                "Students and professionals",
                "Goal-oriented individuals",
                "Therapy patients",
                "Memory keepers and writers"
            ],
            "kids_books": [
                "Parents of young children",
                "Preschool teachers",
                "Homeschooling families",
                "Grandparents buying gifts",
                "Childcare centers"
            ]
        }
        
        return random.sample(audiences.get(category, ["General audience"]), 3)
    
    def _assess_competition(self, category: str, subcategory: str) -> str:
        """Evaluar nivel de competencia"""
        # Categorías con alta competencia
        high_competition = ["Adult Coloring Books", "Gratitude Journals", "Word Search Books"]
        
        if subcategory in high_competition:
            return "High"
        elif "Kids" in subcategory or "Children" in subcategory:
            return "Medium"
        else:
            return random.choice(["Low", "Medium"])
    
    def _assess_market_demand(self, category: str) -> str:
        """Evaluar demanda del mercado"""
        high_demand_categories = ["coloring_books", "journals"]
        medium_demand_categories = ["activity_books", "kids_books"]
        
        if category in high_demand_categories:
            return "Very High"
        elif category in medium_demand_categories:
            return "High"
        else:
            return "Medium"
    
    def _estimate_creation_time(self, category: str) -> str:
        """Estimar tiempo de creación"""
        time_estimates = {
            "coloring_books": "2-4 weeks",
            "activity_books": "1-2 weeks",
            "journals": "1-3 weeks",
            "kids_books": "2-3 weeks"
        }
        
        return time_estimates.get(category, "2-3 weeks")
    
    def _determine_tools_needed(self, category: str) -> List[str]:
        """Determinar herramientas necesarias"""
        tools = {
            "coloring_books": [
                "Adobe Illustrator or Procreate",
                "Drawing tablet (optional)",
                "KDP template for chosen size",
                "Color palette generator",
                "Pattern creation tools"
            ],
            "activity_books": [
                "Microsoft Word or Google Docs",
                "Puzzle generation software",
                "KDP template",
                "Font libraries",
                "Layout design software"
            ],
            "journals": [
                "Canva or Adobe InDesign",
                "Journal template collection",
                "Font pairing tools",
                "Cover design software",
                "Interior layout tools"
            ],
            "kids_books": [
                "Children's illustration software",
                "Educational content templates",
                "Colorful font libraries",
                "Character design tools",
                "Age-appropriate content guides"
            ]
        }
        
        return tools.get(category, ["Design software", "KDP templates", "Creative tools"])
    
    def create_design_brief(self, idea: Dict[str, Any]) -> Dict[str, Any]:
        """Crear brief de diseño detallado"""
        design_brief = {
            "project_overview": {
                "title": idea["title"],
                "category": idea["category"],
                "subcategory": idea["subcategory"],
                "trend": idea["trend"],
                "target_audience": idea["target_audience"]
            },
            "specifications": {
                "page_count": idea["page_count"],
                "book_size": idea["size"],
                "interior_type": idea["interior_type"],
                "cover_type": idea["cover_type"],
                "bleed_settings": "0.125 inches on all sides",
                "margin_requirements": "0.5 inches minimum"
            },
            "design_requirements": {
                "cover_design": {
                    "style": self._determine_cover_style(idea["category"]),
                    "colors": self._generate_color_palette(idea["category"], idea["trend"]),
                    "fonts": self._recommend_fonts(idea["category"]),
                    "elements": ["Title", "Subtitle", "Author Name", "Eye-catching imagery"]
                },
                "interior_design": {
                    "layout": self._determine_layout(idea["category"]),
                    "page_templates": self._create_page_templates(idea["category"]),
                    "difficulty_progression": "Easy to Hard",
                    "variety_requirements": "Mix of simple and complex designs"
                }
            },
            "content_plan": {
                "themes": self._generate_themes(idea["subcategory"], idea["trend"]),
                "variations": self._determine_variations(idea["category"]),
                "bonus_content": self._suggest_bonus_content(idea["category"]),
                "page_sequence": self._plan_page_sequence(idea["page_count"])
            },
            "production_checklist": [
                "Create cover design in CMYK color mode",
                "Design interior pages with proper margins",
                "Export as PDF with embedded fonts",
                "Test print sample",
                "Create 3D mockup for marketing",
                "Write compelling book description",
                "Research and select keywords",
                "Set up pricing and distribution"
            ]
        }
        
        return design_brief
    
    def _determine_cover_style(self, category: str) -> str:
        """Determinar estilo de portada"""
        styles = {
            "coloring_books": "Minimalist with one prominent colored illustration",
            "activity_books": "Bright and engaging with puzzle elements",
            "journals": "Elegant and sophisticated with subtle textures",
            "kids_books": "Colorful and playful with cartoon characters"
        }
        
        return styles.get(category, "Professional and eye-catching")
    
    def _generate_color_palette(self, category: str, trend: str) -> List[str]:
        """Generar paleta de colores"""
        palettes = {
            "coloring_books": ["#2E294E", "#1B998B", "#F46036", "#C5D86D", "#FFFFFF"],
