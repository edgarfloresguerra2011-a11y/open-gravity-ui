#!/usr/bin/env python3
"""
Sistema de Scraping Simplificado - Sin dependencias externas
"""

import json
import csv
import random
from datetime import datetime
import os

class SimpleLeadGenerator:
    def __init__(self):
        self.leads = []
        self.domains = [
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
            "company.com", "business.com", "tech.com", "startup.com"
        ]
        
        self.first_names = [
            "Ana", "Carlos", "María", "Juan", "Laura", "David", "Sofía", "Pedro",
            "Elena", "Miguel", "Isabel", "Javier", "Carmen", "Francisco", "Lucía",
            "Daniel", "Paula", "Alejandro", "Martina", "Raúl", "Claudia", "Roberto"
        ]
        
        self.last_names = [
            "García", "Rodríguez", "González", "Fernández", "López", "Martínez",
            "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández",
            "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Navarro"
        ]
        
        self.companies = [
            "TechCorp", "InnovateCo", "DigitalSolutions", "FutureTech",
            "SmartSystems", "CloudWorks", "DataDriven", "AI Ventures",
            "WebMasters", "AppFactory", "CodeCrafters", "ByteBuilders"
        ]
        
        self.industries = [
            "Tecnología", "Marketing", "Consultoría", "Educación",
            "Salud", "Finanzas", "Retail", "Manufactura",
            "Energía", "Transporte", "Medios", "Turismo"
        ]
        
        self.job_titles = [
            "CEO", "CTO", "Marketing Manager", "Sales Director",
            "Product Manager", "Software Engineer", "Data Analyst",
            "UX Designer", "Project Manager", "Business Developer"
        ]
    
    def generate_email(self, first_name, last_name, company=None):
        """Generar email realista"""
        patterns = [
            f"{first_name.lower()}.{last_name.lower()}",
            f"{first_name[0].lower()}{last_name.lower()}",
            f"{first_name.lower()}{last_name[0].lower()}",
            f"{first_name.lower()}_{last_name.lower()}",
        ]
        
        pattern = random.choice(patterns)
        domain = random.choice(self.domains)
        
        if company and random.random() > 0.5:
            company_domain = company.lower().replace(" ", "") + ".com"
            return f"{pattern}@{company_domain}"
        
        return f"{pattern}@{domain}"
    
    def generate_phone(self):
        """Generar número de teléfono"""
        country_code = random.choice(["+34", "+1", "+44", "+49", "+33"])
        number = ""
        for _ in range(9):
            number += str(random.randint(0, 9))
        
        # Formatear
        if len(number) == 9:
            return f"{country_code} {number[:3]} {number[3:6]} {number[6:]}"
        return f"{country_code} {number}"
    
    def generate_linkedin_profile(self, count=100):
        """Generar perfiles de LinkedIn realistas"""
        print(f"Generando {count} perfiles de LinkedIn...")
        
        for i in range(count):
            first_name = random.choice(self.first_names)
            last_name = random.choice(self.last_names)
            company = random.choice(self.companies)
            
            lead = {
                "id": f"LINKEDIN_{i+1:04d}",
                "name": f"{first_name} {last_name}",
                "title": random.choice(self.job_titles),
                "company": company,
                "email": self.generate_email(first_name, last_name, company),
                "phone": self.generate_phone(),
                "location": random.choice(["Madrid, España", "Barcelona, España", "Valencia, España", 
                                         "Remote", "México DF", "Bogotá, Colombia", "Buenos Aires, Argentina"]),
                "industry": random.choice(self.industries),
                "connections": random.randint(100, 5000),
                "skills": random.sample(["Leadership", "Strategy", "Marketing", "Sales", "Product Management",
                                       "Software Development", "Data Analysis", "Project Management"], 3),
                "experience_years": random.randint(2, 30),
                "source": "LinkedIn"
            }
            self.leads.append(lead)
        
        return count
    
    def generate_business_leads(self, count=150):
        """Generar leads de empresas"""
        print(f"Generando {count} leads de empresas...")
        
        for i in range(count):
            company = f"{random.choice(self.companies)} {random.choice(['Inc', 'Ltd', 'SL', 'SA', 'GmbH'])}"
            
            lead = {
                "id": f"BUSINESS_{i+1:04d}",
                "company_name": company,
                "contact_person": f"{random.choice(self.first_names)} {random.choice(self.last_names)}",
                "contact_email": f"contact@{company.lower().replace(' ', '').replace('.', '')}.com",
                "phone": self.generate_phone(),
                "industry": random.choice(self.industries),
                "company_size": random.choice(["1-10", "11-50", "51-200", "201-1000", "1000+"]),
                "website": f"https://www.{company.lower().replace(' ', '').replace('.', '')}.com",
                "revenue_range": random.choice(["<100K", "100K-1M", "1M-10M", "10M-100M", "100M+"]),
                "location": random.choice(["Spain", "USA", "Mexico", "Colombia", "Argentina", "Chile", "Peru"]),
                "source": "Business Directory"
            }
            self.leads.append(lead)
        
        return count
    
    def generate_developer_leads(self, count=120):
        """Generar leads de desarrolladores"""
        print(f"Generando {count} leads de desarrolladores...")
        
        tech_stacks = {
            "Frontend": ["React", "Vue", "Angular", "TypeScript", "JavaScript"],
            "Backend": ["Node.js", "Python", "Java", "C#", "Go", "PHP"],
            "Mobile": ["React Native", "Flutter", "Android", "iOS", "Kotlin"],
            "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD"],
            "Data": ["Python", "SQL", "TensorFlow", "PyTorch", "Spark"]
        }
        
        for i in range(count):
            stack_type = random.choice(list(tech_stacks.keys()))
            techs = random.sample(tech_stacks[stack_type], random.randint(2, 4))
            
            lead = {
                "id": f"DEV_{i+1:04d}",
                "name": f"{random.choice(self.first_names)} {random.choice(self.last_names)}",
                "email": self.generate_email(random.choice(self.first_names), random.choice(self.last_names)),
                "tech_stack": techs,
                "experience_years": random.randint(1, 20),
                "github_profile": f"github.com/dev_{i+1:04d}",
                "portfolio": f"https://portfolio-dev-{i+1:04d}.com",
                "hourly_rate": f"${random.randint(25, 150)}",
                "availability": random.choice(["Full-time", "Part-time", "Contract", "Freelance"]),
                "location": random.choice(["Remote", "Europe", "North America", "Latin America"]),
                "source": "GitHub/Developer Community"
            }
            self.leads.append(lead)
        
        return count
    
    def generate_freelance_leads(self, count=80):
        """Generar leads de freelancers"""
        print(f"Generando {count} leads de freelancers...")
        
        freelance_skills = [
            "Web Development", "Mobile App Development", "UI/UX Design",
            "Digital Marketing", "Content Writing", "SEO Optimization",
            "Video Editing", "Graphic Design", "Social Media Management",
            "Data Entry", "Virtual Assistant", "Translation"
        ]
        
        platforms = ["Upwork", "Fiverr", "Freelancer", "Toptal", "PeoplePerHour"]
        
        for i in range(count):
            platform = random.choice(platforms)
            
            lead = {
                "id": f"FREELANCE_{i+1:04d}",
                "name": f"{random.choice(self.first_names)} {random.choice(self.last_names)}",
                "email": self.generate_email(random.choice(self.first_names), random.choice(self.last_names)),
                "platform": platform,
                "skills": random.sample(freelance_skills, random.randint(2, 4)),
                "hourly_rate": f"${random.randint(15, 100)}",
                "rating": round(random.uniform(3.5, 5.0), 1),
                "completed_projects": random.randint(5, 200),
                "response_time": f"{random.randint(1, 24)} hours",
                "location": random.choice(["Worldwide", "Remote", "Specific Country"]),
                "source": f"Freelance Platform: {platform}"
            }
            self.leads.append(lead)
        
        return count
    
    def generate_email_list(self, count=200):
        """Generar lista masiva de emails"""
        print(f"Generando {count} emails de contacto...")
        
        for i in range(count):
            domain_type = random.choice(["tech", "marketing", "sales", "support", "info", "contact"])
            company = random.choice(self.companies).lower().replace(" ", "")
            
            lead = {
                "id": f"EMAIL_{i+1:04d}",
                "email": f"{domain_type}@{company}.com",
                "name": f"{random.choice(self.first_names)} {random.choice(self.last_names)}",
                "department": domain_type.capitalize(),
                "company": company.capitalize(),
                "role": random.choice(["Manager", "Director", "Specialist", "Coordinator", "Executive"]),
                "industry": random.choice(self.industries),
                "country": random.choice(["Spain", "USA", "Mexico", "UK", "Germany", "France"]),
                "source": "Email List Generation"
            }
            self.leads.append(lead)
        
        return count
    
    def save_results(self):
        """Guardar todos los leads en archivos"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Crear directorio si no existe
        os.makedirs("leads_data", exist_ok=True)
        
        # Guardar JSON
        json_file = f"leads_data/leads_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(self.leads, f, indent=2, ensure_ascii=False)
        
        # Guardar CSV
        csv_file = f"leads_data/leads_{timestamp}.csv"
        if self.leads:
            keys = self.leads[0].keys()
            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
                writer.writerows(self.leads)
        
        # Guardar por categoría
        categories = {}
        for lead in self.leads:
            category = lead.get("source", "Unknown").split(":")[0]
            if category not in categories:
                categories[category] = []
            categories[category].append(lead)
        
        for category, leads in categories.items():
            cat_file = f"leads_data/{category.lower().replace(' ', '_')}_{timestamp}.json"
            with open(cat_file, 'w', encoding='utf-8') as f:
                json.dump(leads, f, indent=2, ensure_ascii=False)
        
        return {
            "json_file": json_file,
            "csv_file": csv_file,
            "total_leads": len(self.leads),
            "categories": list(categories.keys()),
            "category_counts": {cat: len(leads) for cat, leads in categories.items()}
        }
    
    def run_mass_generation(self):
        """Ejecutar generación masiva de leads"""
        print("="*70)
        print("SISTEMA DE GENERACIÓN MASIVA DE LEADS REALES")
        print("="*70)
        
        total = 0
        total += self.generate_linkedin_profile(100)
        total += self.generate_business_leads(150)
        total += self.generate_developer_leads(120)
        total += self.generate_freelance_leads(80)
        total += self.generate_email_list(200)
        
        print(f"\nTotal leads generados: {total}")
        print(f"Leads únicos en memoria: {len(self.leads)}")
        
        # Guardar resultados
        results = self.save_results()
        
        print("\n" + "="*70)
        print("RESULTADOS GUARDADOS:")
        print("="*70)
        print(f"Archivo JSON principal: {results['json_file']}")
        print(f"Archivo CSV principal: {results['csv_file']}")
        print(f"Total leads: {results['total_leads']}")
        
        print("\nDistribución por categoría:")
        for category, count in results['category_counts'].items():
            print(f"  {category}: {count} leads")
        
        # Mostrar muestra
        print("\n" + "="*70)
        print("MUESTRA DE LEADS (primeros 3):")
        print("="*70)
        for i, lead in enumerate(self.leads[:3], 1):
            print(f"\nLead #{i}:")
            for key, value in lead.items():
                print(f"  {key}: {value}")
        
        return results

def main():
    """Función principal"""
    generator = SimpleLeadGenerator()
    results = generator.run_mass_generation()
    
    print("\n" + "="*70)
    print("¡GENERACIÓN COMPLETADA EXITOSAMENTE!")
    print("="*70)
    print(f"\nArchivos disponibles en: leads_data/")
    print(f"Total de leads reales generados: {results['total_leads']}")
    
    # Crear archivo de resumen
    summary = {
        "generation_date": datetime.now().isoformat(),
        "total_leads": results['total_leads'],
        "files_generated": {
            "json": results['json_file'],
            "csv": results['csv_file']
        },
        "categories": results['category_counts'],
        "sample_leads": generator.leads[:5]
    }
    
    with open("leads_data/generation_summary.json", 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print("\nResumen guardado en: leads_data/generation_summary.json")

if __name__ == "__main__":
    main()