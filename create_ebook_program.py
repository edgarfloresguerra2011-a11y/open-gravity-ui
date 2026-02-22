#!/usr/bin/env python3
"""
PROGRAMA PARA HACER EBOOKS Y GENERAR DINERO
Sistema automatizado de creación y monetización de ebooks
"""

import os
import json
import random
from datetime import datetime
from typing import List, Dict, Any

class EbookCreator:
    def __init__(self):
        self.output_dir = "ebooks_generados"
        self.templates_dir = "ebook_templates"
        self.marketplaces = ["Amazon KDP", "Gumroad", "Payhip", "Shopify", "Etsy"]
        
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.templates_dir, exist_ok=True)
        
        # Categorías populares para ebooks
        self.categories = {
            "self_help": ["Personal Development", "Mindfulness", "Productivity", "Happiness"],
            "business": ["Entrepreneurship", "Marketing", "Finance", "Leadership"],
            "health": ["Fitness", "Nutrition", "Mental Health", "Wellness"],
            "technology": ["Programming", "AI", "Cybersecurity", "Web Development"],
            "fiction": ["Romance", "Mystery", "Fantasy", "Science Fiction"],
            "education": ["Language Learning", "Study Guides", "How-To Guides", "Tutorials"]
        }
        
        # Plantillas de estructura de ebooks
        self.ebook_templates = self._create_templates()
    
    def _create_templates(self) -> Dict[str, Any]:
        """Crear plantillas de ebooks"""
        return {
            "self_help_template": {
                "title_pattern": "The Complete Guide to {topic}",
                "chapters": [
                    "Introduction: Why {topic} Matters",
                    "Chapter 1: Understanding {topic}",
                    "Chapter 2: The Science Behind {topic}",
                    "Chapter 3: Practical Strategies",
                    "Chapter 4: Common Challenges",
                    "Chapter 5: Advanced Techniques",
                    "Chapter 6: Success Stories",
                    "Chapter 7: Your Action Plan",
                    "Conclusion: Your Journey Begins"
                ],
                "sections_per_chapter": 3,
                "avg_pages": 150,
                "price_range": "$4.99 - $9.99"
            },
            "business_template": {
                "title_pattern": "{topic}: The Ultimate Business Guide",
                "chapters": [
                    "Introduction: The {topic} Opportunity",
                    "Chapter 1: Fundamentals of {topic}",
                    "Chapter 2: Market Analysis",
                    "Chapter 3: Strategy Development",
                    "Chapter 4: Implementation Guide",
                    "Chapter 5: Case Studies",
                    "Chapter 6: Scaling Your Business",
                    "Chapter 7: Financial Planning",
                    "Conclusion: From Idea to Profit"
                ],
                "sections_per_chapter": 4,
                "avg_pages": 200,
                "price_range": "$7.99 - $14.99"
            },
            "how_to_template": {
                "title_pattern": "How to {topic}: Step-by-Step Guide",
                "chapters": [
                    "Introduction: What You'll Learn",
                    "Chapter 1: Getting Started",
                    "Chapter 2: Essential Tools & Resources",
                    "Chapter 3: Basic Techniques",
                    "Chapter 4: Intermediate Skills",
                    "Chapter 5: Advanced Methods",
                    "Chapter 6: Troubleshooting",
                    "Chapter 7: Pro Tips & Tricks",
                    "Conclusion: Mastery Achieved"
                ],
                "sections_per_chapter": 5,
                "avg_pages": 120,
                "price_range": "$3.99 - $8.99"
            }
        }
    
    def generate_ebook_idea(self, category: str = None) -> Dict[str, Any]:
        """Generar idea de ebook"""
        if not category:
            category = random.choice(list(self.categories.keys()))
        
        subcategory = random.choice(self.categories[category])
        template_name = random.choice(list(self.ebook_templates.keys()))
        template = self.ebook_templates[template_name]
        
        # Temas populares basados en tendencias
        trending_topics = {
            "self_help": ["Mindfulness", "Digital Detox", "Habit Formation", "Emotional Intelligence"],
            "business": ["Remote Work", "E-commerce", "Personal Branding", "AI for Business"],
            "health": ["Intermittent Fasting", "Mental Wellness", "Home Workouts", "Sleep Optimization"],
            "technology": ["ChatGPT Prompts", "No-Code Tools", "Cybersecurity Basics", "Web3 Introduction"]
        }
        
        topic = random.choice(trending_topics.get(category, [subcategory]))
        
        idea = {
            "category": category,
            "subcategory": subcategory,
            "topic": topic,
            "template": template_name,
            "title": template["title_pattern"].format(topic=topic),
            "estimated_pages": template["avg_pages"],
            "price_range": template["price_range"],
            "potential_earnings": self._calculate_earnings(template["avg_pages"]),
            "market_demand": self._assess_market_demand(topic),
            "competition_level": random.choice(["Low", "Medium", "High"]),
            "creation_time": f"{template['avg_pages'] // 10} hours",
            "keywords": self._generate_keywords(topic, category)
        }
        
        return idea
    
    def _calculate_earnings(self, pages: int) -> Dict[str, Any]:
        """Calcular ganancias potenciales"""
        base_price = 4.99 if pages < 100 else 7.99 if pages < 200 else 9.99
        royalty_rate = 0.70  # 70% royalty en Amazon KDP
        
        return {
            "monthly_sales_low": 50,
            "monthly_sales_high": 500,
            "price_low": base_price - 2,
            "price_high": base_price + 5,
            "monthly_earnings_low": f"${50 * (base_price - 2) * royalty_rate:.2f}",
            "monthly_earnings_high": f"${500 * (base_price + 5) * royalty_rate:.2f}",
            "yearly_earnings_low": f"${50 * 12 * (base_price - 2) * royalty_rate:.2f}",
            "yearly_earnings_high": f"${500 * 12 * (base_price + 5) * royalty_rate:.2f}"
        }
    
    def _assess_market_demand(self, topic: str) -> str:
        """Evaluar demanda del mercado"""
        high_demand_topics = ["AI", "ChatGPT", "Remote Work", "E-commerce", "Mental Health"]
        medium_demand_topics = ["Productivity", "Fitness", "Programming", "Marketing"]
        
        if topic in high_demand_topics:
            return "Very High"
        elif topic in medium_demand_topics:
            return "High"
        else:
            return random.choice(["Medium", "High"])
    
    def _generate_keywords(self, topic: str, category: str) -> List[str]:
        """Generar keywords para SEO"""
        base_keywords = [
            f"{topic} ebook",
            f"{topic} guide",
            f"{topic} book",
            f"learn {topic}",
            f"{topic} for beginners",
            f"master {topic}",
            f"{topic} tutorial"
        ]
        
        category_keywords = {
            "self_help": ["personal development", "self improvement", "growth mindset"],
            "business": ["entrepreneurship", "business guide", "make money online"],
            "health": ["wellness", "healthy living", "fitness guide"],
            "technology": ["tech guide", "digital skills", "online learning"]
        }
        
        return base_keywords + category_keywords.get(category, [])
    
    def create_ebook_structure(self, idea: Dict[str, Any]) -> Dict[str, Any]:
        """Crear estructura detallada del ebook"""
        template = self.ebook_templates[idea["template"]]
        
        chapters = []
        for i, chapter_title in enumerate(template["chapters"]):
            formatted_title = chapter_title.format(topic=idea["topic"])
            
            chapter = {
                "number": i + 1,
                "title": formatted_title,
                "sections": [],
                "estimated_pages": random.randint(8, 15),
                "key_points": []
            }
            
            # Crear secciones para cada capítulo
            for j in range(template["sections_per_chapter"]):
                section = {
                    "title": f"Section {j + 1}.{i + 1}: {self._generate_section_title(idea['topic'])}",
                    "content_outline": self._generate_section_content(),
                    "exercises": random.randint(1, 3),
                    "examples": random.randint(2, 4)
                }
                chapter["sections"].append(section)
            
            # Agregar puntos clave
            for k in range(3):
                chapter["key_points"].append(self._generate_key_point(idea['topic']))
            
            chapters.append(chapter)
        
        ebook_structure = {
            "metadata": idea,
            "structure": {
                "title": idea["title"],
                "subtitle": f"The Complete Guide to Mastering {idea['topic']}",
                "author": "Your Name Here",
                "description": self._generate_description(idea['topic'], idea['category']),
                "chapters": chapters,
                "total_pages": sum(chapter["estimated_pages"] for chapter in chapters),
                "appendices": [
                    "Resources & Tools",
                    "Further Reading",
                    "Worksheets",
                    "Checklists"
                ],
                "bonuses": [
                    "Free Video Course",
                    "Printable Worksheets",
                    "Community Access",
                    "One-on-One Consultation"
                ]
            },
            "production": {
                "cover_design": "Professional cover required",
                "formatting": "EPUB, MOBI, PDF",
                "isbn": "Required for wide distribution",
                "categories": [idea["category"], idea["subcategory"]] + random.sample(list(self.categories.keys()), 2)
            },
            "marketing": {
                "launch_strategy": "Pre-order campaign + email list",
                "promotion_channels": ["Amazon Ads", "Facebook Groups", "Book Blogs", "Social Media"],
                "price_strategy": "Launch discount + upsells",
                "review_strategy": "ARC copies to reviewers"
            }
        }
        
        return ebook_structure
    
    def _generate_section_title(self, topic: str) -> str:
        """Generar título de sección"""
        patterns = [
            f"Understanding {topic} Fundamentals",
            f"Practical Applications of {topic}",
            f"Advanced {topic} Techniques",
            f"{topic} Best Practices",
            f"Common {topic} Mistakes to Avoid",
            f"{topic} Case Studies",
            f"Tools for {topic} Success",
            f"Future of {topic}"
        ]
        return random.choice(patterns)
    
    def _generate_section_content(self) -> List[str]:
        """Generar esquema de contenido para sección"""
        content_points = [
            "Introduction and overview",
            "Step-by-step instructions",
            "Real-world examples",
            "Common challenges and solutions",
            "Pro tips and tricks",
            "Actionable exercises",
            "Summary and key takeaways",
            "Next steps"
        ]
        return random.sample(content_points, random.randint(4, 6))
    
    def _generate_key_point(self, topic: str) -> str:
        """Generar punto clave"""
        points = [
            f"How {topic} can transform your life/business",
            f"The science behind effective {topic}",
            f"Common misconceptions about {topic}",
            f"Step-by-step framework for {topic} success",
            f"Tools and resources for mastering {topic}",
            f"Case studies of {topic} success stories",
            f"Future trends in {topic}",
            f"How to measure {topic} progress"
        ]
        return random.choice(points)
    
    def _generate_description(self, topic: str, category: str) -> str:
        """Generar descripción del ebook"""
        descriptions = {
            "self_help": f"""Discover the transformative power of {topic} with this comprehensive guide. 
            Whether you're a beginner or looking to deepen your practice, this book provides practical 
            strategies, scientific insights, and actionable steps to help you achieve remarkable results.
            
            Inside you'll find:
            • Step-by-step techniques for mastering {topic}
            • Real-life examples and case studies
            • Exercises to reinforce learning
            • Tools for tracking progress
            • Advanced methods for continued growth
            
            Start your journey to {topic} mastery today!""",
            
            "business": f"""Unlock the secrets of {topic} and transform your business with this ultimate guide. 
            From foundational concepts to advanced strategies, this book provides everything you need to 
            succeed in today's competitive market.
            
            What you'll learn:
            • Proven {topic} strategies that actually work
            • How to avoid common pitfalls
            • Tools and technologies for efficiency
            • Case studies from successful businesses
            • Action plans for immediate implementation
            
            Take your business to the next level with {topic}!""",
            
            "technology": f"""Master {topic} with this comprehensive guide designed for all skill levels. 
            Learn the fundamentals, explore advanced techniques, and discover practical applications 
            that will enhance your skills and career opportunities.
            
            This book covers:
            • Fundamentals of {topic} explained simply
            • Hands-on projects and exercises
            • Industry best practices
            • Troubleshooting common issues
            • Resources for continued learning
            
            Become a {topic} expert faster than you thought possible!"""
        }
        
        return descriptions.get(category, descriptions["self_help"])
    
    def generate_multiple_ideas(self, count: int = 10) -> List[Dict[str, Any]]:
        """Generar múltiples ideas de ebooks"""
        print(f"Generando {count} ideas de ebooks...")
        ideas = []
        
        for i in range(count):
            category = random.choice(list(self.categories.keys()))
            idea = self.generate_ebook_idea(category)
            idea["id"] = i + 1
            idea["priority"] = random.choice(["High", "Medium", "Low"])
            ideas.append(idea)
            
            print(f"  {i+1}. {idea['title']}")
            print(f"     Category: {idea['category']} | Earnings: {idea['potential_earnings']['monthly_earnings_low']} - {idea['potential_earnings']['monthly_earnings_high']}/month")
        
        return ideas
    
    def save_ebook_plan(self, ebook_structure: Dict[str, Any]) -> str:
        """Guardar plan de ebook en archivo"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        topic = ebook_structure["metadata"]["topic"].replace(" ", "_").lower()
        filename = f"ebook_plan_{topic}_{timestamp}.json"
        filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(ebook_structure, f, indent=2, ensure_ascii=False)
        
        return filepath
    
    def create_marketing_plan(self, ebook_structure: Dict[str, Any]) -> Dict[str, Any]:
        """Crear plan de marketing para el ebook"""
        metadata = ebook_structure["metadata"]
        
        marketing_plan = {
            "pre_launch": {
                "timeline": "30 days before launch",
                "activities": [
                    "Build email list with lead magnet",
                    "Create landing page",
                    "Set up pre-order campaign",
                    "Secure book reviews",
                    "Create social media content calendar"
                ]
            },
            "launch": {
                "timeline": "Launch week",
                "activities": [
                    "Email sequence to subscribers",
                    "Social media blitz",
                    "Amazon ads campaign",
                    "Influencer outreach",
                    "Limited-time discount"
                ]
            },
            "post_launch": {
                "timeline": "30 days after launch",
                "activities": [
                    "Collect and showcase reviews",
                    "Run retargeting ads",
                    "Create upsell offers",
                    "Update based on feedback",
                    "Plan next book"
                ]
            },
            "promotion_channels": {
                "paid": ["Amazon Ads", "Facebook Ads", "BookBub", "Goodreads"],
                "free": ["Social Media", "Email Marketing", "Guest Blogging", "Podcast Interviews"],
                "partnerships": ["Affiliate Marketing", "Bundle Deals", "Cross-promotion"]
            },
            "conversion_strategy": {
                "funnel": "Free chapter → Book → Course → Coaching",
                "price_points": {
                    "ebook": metadata["price_range"],
                    "paperback": "$12.99 - $19.99",
                    "audiobook": "$14.99 - $24.99",
                    "bundle": "$29.99 - $49.99"
                },
                "upsells": ["Video Course", "Worksheets", "Community Access", "Coaching"]
            }
        }
        
        return marketing_plan
    
    def generate_full_ebook_package(self, count: int = 5) -> List[Dict[str, Any]]:
        """Generar paquete completo de ebooks"""
        print("=" * 60)
        print("GENERANDO PAQUETE COMPLETO DE EBOOKS")
        print("=" * 60)
        
        packages = []
        ideas = self.generate_multiple_ideas(count)
        
        for i, idea in enumerate(ideas):
            print(f"\n📚 Procesando ebook {i+1}: {idea['title']}")
            
            # Crear estructura del ebook
            ebook_structure = self.create_ebook_structure(idea)
            
            # Crear plan de marketing
            marketing_plan = self.create_marketing_plan(ebook_structure)
            
            # Guardar archivos
            ebook_file = self.save_ebook_plan(ebook_structure)
            
            package = {
                "idea": idea,
                "structure": ebook_structure,
                "marketing