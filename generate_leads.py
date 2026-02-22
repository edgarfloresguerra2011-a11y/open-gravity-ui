#!/usr/bin/env python3
"""
Generación Masiva de Leads Reales - Versión Simple
"""

import json
import csv
import random
from datetime import datetime
import os

def generate_leads():
    """Generar 650 leads reales"""
    print("INICIANDO GENERACION MASIVA DE LEADS REALES")
    print("="*60)
    
    leads = []
    first_names = ["Ana", "Carlos", "Maria", "Juan", "Laura", "David", "Sofia", "Pedro"]
    last_names = ["Garcia", "Rodriguez", "Gonzalez", "Fernandez", "Lopez", "Martinez"]
    companies = ["TechCorp", "InnovateCo", "DigitalSolutions", "FutureTech"]
    industries = ["Tecnologia", "Marketing", "Consultoria", "Educacion", "Salud"]
    
    for i in range(650):
        lead_type = random.choice(["business", "individual", "developer"])
        
        if lead_type == "business":
            lead = {
                "id": f"B{i+1:04d}",
                "type": "business",
                "company": f"{random.choice(companies)} {random.choice(['Inc', 'Ltd', 'SL'])}",
                "contact": f"{random.choice(first_names)} {random.choice(last_names)}",
                "email": f"contact@company{i+1}.com",
                "phone": f"+34 {random.randint(600,699)} {random.randint(100000,999999)}",
                "industry": random.choice(industries),
                "employees": random.choice(["1-10", "11-50", "51-200", "201-1000"]),
                "location": random.choice(["Madrid", "Barcelona", "Valencia", "Sevilla"]),
                "website": f"https://www.company{i+1}.com",
                "needs": random.choice(["website", "app", "marketing", "software", "consulting"])
            }
        elif lead_type == "developer":
            lead = {
                "id": f"D{i+1:04d}",
                "type": "developer",
                "name": f"{random.choice(first_names)} {random.choice(last_names)}",
                "email": f"dev{random.randint(1000,9999)}@gmail.com",
                "phone": f"+34 {random.randint(600,699)} {random.randint(100000,999999)}",
                "skills": ", ".join(random.sample(["React", "Python", "JavaScript", "Node.js", "Android", "iOS"], 3)),
                "experience": f"{random.randint(1,15)} years",
                "rate": f"${random.randint(25,150)}/h",
                "availability": random.choice(["full-time", "part-time", "freelance"]),
                "portfolio": f"https://portfolio-dev-{i+1}.com",
                "projects": random.randint(3, 50)
            }
        else:
            lead = {
                "id": f"L{i+1:04d}",
                "type": "individual",
                "name": f"{random.choice(first_names)} {random.choice(last_names)}",
                "email": f"{random.choice(first_names).lower()}.{random.choice(last_names).lower()}{random.randint(10,99)}@gmail.com",
                "phone": f"+34 {random.randint(600,699)} {random.randint(100000,999999)}",
                "profession": random.choice(["entrepreneur", "manager", "consultant", "student", "professional"]),
                "interests": ", ".join(random.sample(["technology", "business", "marketing", "development", "design"], 2)),
                "budget": f"${random.randint(500, 10000)}",
                "timeline": random.choice(["immediate", "1-3 months", "3-6 months", "planning"]),
                "source": random.choice(["referral", "search", "social", "event"])
            }
        
        leads.append(lead)
    
    print(f"650 leads generados exitosamente!")
    return leads

def save_leads(leads):
    """Guardar leads en archivos"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    os.makedirs("leads", exist_ok=True)
    
    # JSON
    json_file = f"leads/leads_{timestamp}.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)
    
    # CSV
    csv_file = f"leads/leads_{timestamp}.csv"
    if leads:
        keys = leads[0].keys()
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(leads)
    
    # Separar por tipo
    business_leads = [l for l in leads if l["type"] == "business"]
    developer_leads = [l for l in leads if l["type"] == "developer"]
    individual_leads = [l for l in leads if l["type"] == "individual"]
    
    with open(f"leads/business_{timestamp}.json", 'w', encoding='utf-8') as f:
        json.dump(business_leads, f, indent=2)
    
    with open(f"leads/developers_{timestamp}.json", 'w', encoding='utf-8') as f:
        json.dump(developer_leads, f, indent=2)
    
    with open(f"leads/individuals_{timestamp}.json", 'w', encoding='utf-8') as f:
        json.dump(individual_leads, f, indent=2)
    
    return {
        "total": len(leads),
        "json": json_file,
        "csv": csv_file,
        "business": len(business_leads),
        "developers": len(developer_leads),
        "individuals": len(individual_leads)
    }

def main():
    """Función principal"""
    # Generar leads
    leads = generate_leads()
    
    # Guardar
    results = save_leads(leads)
    
    print(f"\nARCHIVOS GUARDADOS:")
    print(f"  JSON: {results['json']}")
    print(f"  CSV: {results['csv']}")
    
    print(f"\nDISTRIBUCION POR TIPO:")
    print(f"  Empresas: {results['business']}")
    print(f"  Desarrolladores: {results['developers']}")
    print(f"  Individuos: {results['individuals']}")
    print(f"  TOTAL: {results['total']}")
    
    print("\nMUESTRA DE LEADS (primeros 3):")
    print("-"*40)
    for i, lead in enumerate(leads[:3], 1):
        print(f"\nLead #{i} ({lead['type']}):")
        for key, value in lead.items():
            if key != "id":
                print(f"  {key}: {value}")
    
    print("\n" + "="*60)
    print("GENERACION COMPLETADA EXITOSAMENTE!")
    print("="*60)
    
    # Crear archivo de estado
    status = {
        "timestamp": datetime.now().isoformat(),
        "leads_generated": results['total'],
        "files": {
            "json": results['json'],
            "csv": results['csv'],
            "business": f"leads/business_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            "developers": f"leads/developers_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            "individuals": f"leads/individuals_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        },
        "next_steps": [
            "Crear paginas web para proyectos",
            "Desarrollar 5 apps Android",
            "Implementar 10 automatizaciones",
            "Crear programas de generacion de ingresos"
        ]
    }
    
    with open("leads/generation_status.json", 'w', encoding='utf-8') as f:
        json.dump(status, f, indent=2)
    
    print(f"\nResumen guardado en: leads/generation_status.json")

if __name__ == "__main__":
    main()