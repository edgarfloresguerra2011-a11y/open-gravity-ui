#!/usr/bin/env python3
"""
CONTINUACIÓN - SCRAPING MASIVO AVANZADO
"""

import os
import json
from datetime import datetime

def create_projects_summary(emails):
    """Crear resumen de proyectos con los leads"""
    print("\n" + "=" * 60)
    print("ASIGNACIÓN DE LEADS A PROYECTOS")
    print("=" * 60)
    
    projects = [
        {"name": "Apps Android", "count": 5, "leads_needed": 500, "target": "Developers, Tech Enthusiasts"},
        {"name": "Automatizaciones B8N", "count": 10, "leads_needed": 300, "target": "Business Owners, Marketers"},
        {"name": "Ebooks", "count": 10, "leads_needed": 400, "target": "Authors, Content Creators"},
        {"name": "Dibujos KDP", "count": 10, "leads_needed": 300, "target": "Artists, Designers"},
        {"name": "Podcast Creator", "count": 1, "leads_needed": 200, "target": "Podcasters, Content Creators"},
        {"name": "Landing Pages", "count": 10, "leads_needed": 600, "target": "Entrepreneurs, Business Owners"},
        {"name": "Websites Varios", "count": 10, "leads_needed": 500, "target": "Various Industries"},
        {"name": "Scraping System", "count": 1, "leads_needed": 100, "target": "Data Analysts, Researchers"}
    ]
    
    total_leads_needed = sum(p["leads_needed"] for p in projects)
    available_leads = len(emails)
    
    print(f"📊 Resumen de Leads:")
    print(f"   • Leads disponibles: {available_leads}")
    print(f"   • Leads necesarios: {total_leads_needed}")
    print(f"   • Cobertura: {(available_leads/total_leads_needed*100):.1f}%")
    
    print(f"\n🎯 Distribución por proyecto:")
    for project in projects:
        allocated = min(project["leads_needed"], available_leads // len(projects))
        percentage = (allocated / project["leads_needed"] * 100) if project["leads_needed"] > 0 else 0
        print(f"   • {project['name']}: {allocated}/{project['leads_needed']} leads ({percentage:.1f}%)")
    
    # Crear archivo de asignación
    assignment_dir = "leads_masivos/assignments"
    os.makedirs(assignment_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    assignment_file = os.path.join(assignment_dir, f"project_assignment_{timestamp}.json")
    
    assignment_data = {
        "summary": {
            "total_leads": available_leads,
            "total_projects": len(projects),
            "assignment_date": datetime.now().isoformat()
        },
        "projects": []
    }
    
    # Asignar emails a proyectos
    email_index = 0
    for project in projects:
        project_leads = []
        leads_to_assign = min(project["leads_needed"], len(emails) - email_index)
        
        for i in range(leads_to_assign):
            if email_index < len(emails):
                project_leads.append(emails[email_index])
                email_index += 1
        
        project_data = {
            "name": project["name"],
            "count": project["count"],
            "leads_needed": project["leads_needed"],
            "leads_assigned": len(project_leads),
            "target_audience": project["target"],
            "emails": project_leads
        }
        
        assignment_data["projects"].append(project_data)
        
        # Guardar archivo individual por proyecto
        project_file = os.path.join(assignment_dir, f"{project['name'].replace(' ', '_').lower()}_leads_{timestamp}.txt")
        with open(project_file, 'w', encoding='utf-8') as f:
            f.write(f"# Leads para: {project['name']}\n")
            f.write(f"# Asignados: {len(project_leads)} de {project['leads_needed']} necesarios\n")
            f.write(f"# Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"# Audiencia objetivo: {project['target']}\n")
            f.write("=" * 60 + "\n\n")
            
            for email in project_leads:
                f.write(email + "\n")
        
        print(f"   📁 {project['name']}: {len(project_leads)} leads guardados en {project_file}")
    
    # Guardar asignación completa
    with open(assignment_file, 'w', encoding='utf-8') as f:
        json.dump(assignment_data, f, indent=2)
    
    print(f"\n💾 Archivo de asignación guardado en: {assignment_file}")
    
    # Crear reporte ejecutivo
    create_executive_report(assignment_data, available_leads)
    
    return assignment_data

def create_executive_report(assignment_data, total_leads):
    """Crear reporte ejecutivo"""
    report_dir = "leads_masivos/reports"
    os.makedirs(report_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = os.path.join(report_dir, f"executive_report_{timestamp}.md")
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("# 📊 REPORTE EJECUTIVO - SCRAPING MASIVO\n\n")
        f.write(f"**Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Total de Leads Obtenidos:** {total_leads}\n")
        f.write(f"**Total de Proyectos:** {len(assignment_data['projects'])}\n\n")
        
        f.write("## 🎯 RESUMEN POR PROYECTO\n\n")
        f.write("| Proyecto | Leads Necesarios | Leads Asignados | Cobertura |\n")
        f.write("|----------|------------------|-----------------|-----------|\n")
        
        for project in assignment_data["projects"]:
            coverage = (project["leads_assigned"] / project["leads_needed"] * 100) if project["leads_needed"] > 0 else 0
            f.write(f"| {project['name']} | {project['leads_needed']} | {project['leads_assigned']} | {coverage:.1f}% |\n")
        
        f.write("\n## 📈 ESTADÍSTICAS GENERALES\n\n")
        
        total_needed = sum(p["leads_needed"] for p in assignment_data["projects"])
        total_assigned = sum(p["leads_assigned"] for p in assignment_data["projects"])
        overall_coverage = (total_assigned / total_needed * 100) if total_needed > 0 else 0
        
        f.write(f"- **Leads Totales Necesarios:** {total_needed}\n")
        f.write(f"- **Leads Totales Asignados:** {total_assigned}\n")
        f.write(f"- **Cobertura General:** {overall_coverage:.1f}%\n")
        f.write(f"- **Proyectos con Mayor Necesidad:** \n")
        
        # Identificar proyectos con mayor necesidad
        projects_by_need = sorted(assignment_data["projects"], 
                                 key=lambda x: x["leads_needed"] - x["leads_assigned"], 
                                 reverse=True)
        
        for project in projects_by_need[:3]:
            deficit = project["leads_needed"] - project["leads_assigned"]
            if deficit > 0:
                f.write(f"  - {project['name']}: Necesita {deficit} leads más\n")
        
        f.write("\n## 🚀 PRÓXIMOS PASOS RECOMENDADOS\n\n")
        f.write("1. **Priorizar scraping adicional** para proyectos con déficit\n")
        f.write("2. **Validar calidad de leads** antes de campañas de marketing\n")
        f.write("3. **Segmentar leads** por industria y ubicación\n")
        f.write("4. **Crear secuencias de email** personalizadas por proyecto\n")
        f.write("5. **Monitorear tasas de respuesta** y ajustar estrategias\n")
        f.write("6. **Automatizar seguimiento** con herramientas de CRM\n")
        
        f.write("\n## 📊 POTENCIAL DE CONVERSIÓN\n\n")
        f.write("Basado en promedios de la industria:\n")
        f.write("- **Tasa de apertura de email:** 15-25%\n")
        f.write("- **Tasa de clics:** 2-5%\n")
        f.write("- **Tasa de conversión:** 1-3%\n")
        f.write(f"- **Conversiones esperadas:** {int(total_assigned * 0.02)} - {int(total_assigned * 0.03)}\n")
        
        f.write("\n## 💰 PROYECCIÓN DE INGRESOS\n\n")
        f.write("| Proyecto | Valor por Cliente | Conversiones Esperadas | Ingreso Proyectado |\n")
        f.write("|----------|-------------------|------------------------|--------------------|\n")
        
        # Valores estimados por proyecto
        project_values = {
            "Apps Android": 1000,
            "Automatizaciones B8N": 500,
            "Ebooks": 50,
            "Dibujos KDP": 100,
            "Podcast Creator": 2000,
            "Landing Pages": 500,
            "Websites Varios": 1000,
            "Scraping System": 1500
        }
        
        total_revenue = 0
        for project in assignment_data["projects"]:
            value = project_values.get(project["name"], 100)
            conversions = int(project["leads_assigned"] * 0.02)  # 2% conversion rate
            revenue = conversions * value
            total_revenue += revenue
            
            f.write(f"| {project['name']} | ${value} | {conversions} | ${revenue:,} |\n")
        
        f.write(f"\n**Ingreso Total Proyectado:** **${total_revenue:,}**\n")
        
        f.write("\n## ✅ ACCIONES INMEDIATAS\n\n")
        f.write("1. **Importar leads** a sistema de email marketing\n")
        f.write("2. **Crear plantillas** de email por proyecto\n")
        f.write("3. **Programar campañas** de lanzamiento\n")
        f.write("4. **Configurar analytics** para tracking\n")
        f.write("5. **Asignar recursos** por proyecto\n")
        
        f.write("\n---\n")
        f.write("*Reporte generado automáticamente por el sistema de scraping masivo*\n")
    
    print(f"\n📋 Reporte ejecutivo guardado en: {report_file}")
    
    # Crear checklist de implementación
    create_implementation_checklist(assignment_data)

def create_implementation_checklist(assignment_data):
    """Crear checklist de implementación"""
    checklist_dir = "leads_masivos/checklists"
    os.makedirs(checklist_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    checklist_file = os.path.join(checklist_dir, f"implementation_checklist_{timestamp}.md")
    
    with open(checklist_file, 'w', encoding='utf-8') as f:
        f.write("# ✅ CHECKLIST DE IMPLEMENTACIÓN\n\n")
        f.write(f"**Fecha:** {datetime.now().strftime('%Y-%m-%d')}\n")
        f.write(f"**Total de Proyectos:** {len(assignment_data['projects'])}\n\n")
        
        f.write("## 📋 CHECKLIST GENERAL\n\n")
        
        general_tasks = [
            {"task": "Validar calidad de emails", "status": "pending", "owner": "QA Team"},
            {"task": "Importar a sistema de email", "status": "pending", "owner": "Marketing"},
            {"task": "Configurar segmentación", "status": "pending", "owner": "Marketing"},
            {"task": "Crear plantillas de email", "status": "pending", "owner": "Content"},
            {"task": "Configurar automatizaciones", "status": "pending", "owner": "Tech"},
            {"task": "Establecer KPI's", "status": "pending", "owner": "Analytics"},
            {"task": "Programar campañas", "status": "pending", "owner": "Marketing"},
            {"task": "Monitorear resultados", "status": "pending", "owner": "Analytics"}
        ]
        
        for task in general_tasks:
            status_icon = "⬜" if task["status"] == "pending" else "✅"
            f.write(f"{status_icon} **{task['task']}** (Responsable: {task['owner']})\n")
        
        f.write("\n## 🎯 CHECKLIST POR PROYECTO\n\n")
        
        for project in assignment_data["projects"]:
            f.write(f"### {project['name']}\n")
            f.write(f"Leads asignados: {project['leads_assigned']}\n\n")
            
            project_tasks = [
                f"Crear secuencia de email para {project['name']}",
                f"Diseñar landing page específica",
                f"Preparar materiales de venta",
                f"Configurar tracking de conversiones",
                f"Establecer presupuesto de campaña",
                f"Definir métricas de éxito"
            ]
            
            for i, task in enumerate(project_tasks, 1):
                f.write(f"- [ ] {task}\n")
            
            f.write("\n")
        
        f.write("\n## 📅 CRONOGRAMA RECOMENDADO\n\n")
        f.write("| Día | Actividades |\n")
        f.write("|-----|------------|\n")
        f.write("| D1  | Validación de leads + Importación |\n")
        f.write("| D2  | Creación de plantillas + Segmentación |\n")
        f.write("| D3  | Configuración de automatizaciones |\n")
        f.write("| D4  | Pruebas de envío + Ajustes |\n")
        f.write("| D5  | Lanzamiento campaña piloto |\n")
        f.write("| D6  | Análisis resultados + Optimización |\n")
        f.write("| D7  | Escalamiento campaña completa |\n")
        
        f.write("\n## 🚨 RIESGOS Y MITIGACIÓN\n\n")
        f.write("1. **Riesgo:** Tasa de bounce alta\n")
        f.write("   **Mitigación:** Validación previa + limpieza de lista\n\n")
        f.write("2. **Riesgo:** Baja tasa de apertura\n")
        f.write("   **Mitigación:** A/B testing de subject lines\n\n")
        f.write("3. **Riesgo:** Marcado como spam\n")
        f.write("   **Mitigación:** Warm-up progresivo + contenido relevante\n\n")
        f.write("4. **Riesgo:** Conversiones bajas\n")
        f.write("   **Mitigación:** Optimización de funnel + retargeting\n")
        
        f.write("\n---\n")
        f.write("*Checklist actualizable - Revisar diariamente*\n")
    
    print(f"📝 Checklist de implementación guardado en: {checklist_file}")

def main():
    """Función principal"""
    print("=" * 60)
    print("SISTEMA DE ASIGNACIÓN DE LEADS A PROYECTOS")
    print("=" * 60)
    
    # Simular emails obtenidos (en producción usaría los emails reales)
    print("Cargando emails obtenidos del scraping...")
    
    # Leer emails del archivo de scraping
    try:
        import glob
        latest_leads = sorted(glob.glob("leads_masivos/leads_*.txt"))[-1]
        with open(latest_leads, 'r', encoding='utf-8') as f:
            emails = [line.strip() for line in f if line.strip()]
        print(f"✅ Cargados {len(emails)} emails de {latest_leads}")
    except:
        print("⚠️ No se encontraron archivos de leads, usando datos de ejemplo")
        # Datos de ejemplo para demostración
        emails = [f"user{i}@example.com" for i in range(1000)]
    
    # Crear asignación de proyectos
    assignment_data = create_projects_summary(emails)
    
    print("\n" + "=" * 60)
    print("✅ SISTEMA DE ASIGNACIÓN COMPLETADO")
    print("=" * 60)
    
    return assignment_data

if __name__ == "__main__":
    main()