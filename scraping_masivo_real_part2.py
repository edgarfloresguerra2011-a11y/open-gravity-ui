# Continuación del scraping masivo

        # 1. Guardar en JSON
        json_file = f"{self.scraped_leads_dir}/leads_masivo_{session_id}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(leads, f, indent=2, ensure_ascii=False)
        
        # 2. Guardar en CSV
        csv_file = f"{self.scraped_leads_dir}/leads_masivo_{session_id}.csv"
        self.guardar_como_csv(leads, csv_file)
        
        # 3. Guardar por categorías
        self.guardar_por_categorias(leads, session_id)
        
        # 4. Generar reporte
        reporte = self.generar_reporte_scraping(leads, session_id)
        
        print(f"\n💾 RESULTADOS GUARDADOS:")
        print(f"   📄 JSON: {json_file}")
        print(f"   📊 CSV: {csv_file}")
        print(f"   📈 Reporte: {self.scraped_leads_dir}/reporte_{session_id}.json")
        print(f"   👥 Total leads: {len(leads)}")
        print(f"   📧 Emails únicos: {len(set(lead['email'] for lead in leads))}")
        
        return reporte
    
    def guardar_como_csv(self, leads, filename):
        """Guardar leads en CSV"""
        if not leads:
            return
        
        # Encabezados
        campos = leads[0].keys()
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=campos)
            writer.writeheader()
            writer.writerows(leads)
    
    def guardar_por_categorias(self, leads, session_id):
        """Guardar leads por categorías"""
        categorias_dir = f"{self.scraped_leads_dir}/categorias_{session_id}"
        os.makedirs(categorias_dir, exist_ok=True)
        
        # Agrupar por industria
        por_industria = {}
        for lead in leads:
            industria = lead.get('industria', 'General')
            if industria not in por_industria:
                por_industria[industria] = []
            por_industria[industria].append(lead)
        
        # Guardar cada categoría
        for industria, leads_industria in por_industria.items():
            # Limpiar nombre de archivo
            nombre_archivo = industria.lower().replace(' ', '_').replace('/', '_')
            archivo = f"{categorias_dir}/{nombre_archivo}.json"
            
            with open(archivo, 'w', encoding='utf-8') as f:
                json.dump(leads_industria, f, indent=2, ensure_ascii=False)
            
            print(f"   📁 {industria}: {len(leads_industria)} leads")
    
    def generar_reporte_scraping(self, leads, session_id):
        """Generar reporte DETALLADO del scraping"""
        print("\n📊 GENERANDO REPORTE DETALLADO...")
        
        reporte = {
            "session_id": session_id,
            "fecha_hora": datetime.now().isoformat(),
            "total_leads": len(leads),
            "emails_unicos": len(set(lead['email'] for lead in leads)),
            "fuentes_utilizadas": list(self.sources.keys()),
            "analisis_detallado": {
                "por_fuente": {},
                "por_industria": {},
                "por_pais": {},
                "por_tamano_empresa": {},
                "por_score_validez": {
                    "alto_90+": 0,
                    "medio_80-89": 0,
                    "bajo_70-79": 0
                }
            },
            "metricas_calidad": {
                "promedio_score": 0,
                "leads_con_telefono": 0,
                "leads_con_website": 0,
                "leads_con_empresa": 0
            },
            "proyectos_recomendados": {},
            "leads_calidad_alta": []
        }
        
        # Análisis detallado
        scores = []
        for lead in leads:
            # Por fuente
            fuente = lead.get('fuente', 'desconocida')
            reporte["analisis_detallado"]["por_fuente"][fuente] = \
                reporte["analisis_detallado"]["por_fuente"].get(fuente, 0) + 1
            
            # Por industria
            industria = lead.get('industria', 'General')
            reporte["analisis_detallado"]["por_industria"][industria] = \
                reporte["analisis_detallado"]["por_industria"].get(industria, 0) + 1
            
            # Por país
            pais = lead.get('pais', 'Desconocido')
            reporte["analisis_detallado"]["por_pais"][pais] = \
                reporte["analisis_detallado"]["por_pais"].get(pais, 0) + 1
            
            # Por tamaño empresa
            tamano = lead.get('tamano_empresa', 'Desconocido')
            reporte["analisis_detallado"]["por_tamano_empresa"][tamano] = \
                reporte["analisis_detallado"]["por_tamano_empresa"].get(tamano, 0) + 1
            
            # Por score
            score = lead.get('score_validez', 0)
            scores.append(score)
            if score >= 90:
                reporte["analisis_detallado"]["por_score_validez"]["alto_90+"] += 1
            elif score >= 80:
                reporte["analisis_detallado"]["por_score_validez"]["medio_80-89"] += 1
            else:
                reporte["analisis_detallado"]["por_score_validez"]["bajo_70-79"] += 1
            
            # Métricas de calidad
            if lead.get('telefono'):
                reporte["metricas_calidad"]["leads_con_telefono"] += 1
            if lead.get('website'):
                reporte["metricas_calidad"]["leads_con_website"] += 1
            if lead.get('empresa'):
                reporte["metricas_calidad"]["leads_con_empresa"] += 1
            
            # Proyectos recomendados
            proyectos = lead.get('proyectos_recomendados', [])
            for proyecto in proyectos:
                reporte["proyectos_recomendados"][proyecto] = \
                    reporte["proyectos_recomendados"].get(proyecto, 0) + 1
            
            # Leads de alta calidad (score > 85)
            if score > 85:
                reporte["leads_calidad_alta"].append({
                    "email": lead.get('email'),
                    "nombre": lead.get('nombre'),
                    "empresa": lead.get('empresa'),
                    "industria": lead.get('industria'),
                    "score": score
                })
        
        # Calcular promedios
        if scores:
            reporte["metricas_calidad"]["promedio_score"] = sum(scores) / len(scores)
        
        # Calcular porcentajes
        total = len(leads)
        if total > 0:
            reporte["metricas_calidad"]["porcentaje_con_telefono"] = \
                (reporte["metricas_calidad"]["leads_con_telefono"] / total) * 100
            reporte["metricas_calidad"]["porcentaje_con_website"] = \
                (reporte["metricas_calidad"]["leads_con_website"] / total) * 100
            reporte["metricas_calidad"]["porcentaje_con_empresa"] = \
                (reporte["metricas_calidad"]["leads_con_empresa"] / total) * 100
        
        # Ordenar proyectos por recomendación
        reporte["proyectos_recomendados"] = dict(
            sorted(reporte["proyectos_recomendados"].items(), 
                  key=lambda x: x[1], reverse=True)[:10]
        )
        
        # Guardar reporte
        reporte_file = f"{self.scraped_leads_dir}/reporte_{session_id}.json"
        with open(reporte_file, 'w', encoding='utf-8') as f:
            json.dump(reporte, f, indent=2, ensure_ascii=False)
        
        # Mostrar resumen ejecutivo
        print(f"\n{'='*70}")
        print("📈 RESUMEN EJECUTIVO DEL SCRAPING")
        print(f"{'='*70}")
        print(f"👥 TOTAL LEADS: {reporte['total_leads']}")
        print(f"📧 EMAILS ÚNICOS: {reporte['emails_unicos']}")
        print(f"⭐ SCORE PROMEDIO: {reporte['metricas_calidad']['promedio_score']:.1f}/100")
        print(f"🏆 LEADS ALTA CALIDAD: {len(reporte['leads_calidad_alta'])}")
        print(f"📞 CON TELÉFONO: {reporte['metricas_calidad']['leads_con_telefono']} ({reporte['metricas_calidad'].get('porcentaje_con_telefono', 0):.1f}%)")
        print(f"🌐 CON WEBSITE: {reporte['metricas_calidad']['leads_con_website']} ({reporte['metricas_calidad'].get('porcentaje_con_website', 0):.1f}%)")
        print(f"🏢 CON EMPRESA: {reporte['metricas_calidad']['leads_con_empresa']} ({reporte['metricas_calidad'].get('porcentaje_con_empresa', 0):.1f}%)")
        print(f"\n🎯 TOP 3 PROYECTOS RECOMENDADOS:")
        for i, (proyecto, count) in enumerate(list(reporte["proyectos_recomendados"].items())[:3]):
            print(f"   {i+1}. {proyecto}: {count} leads")
        print(f"{'='*70}")
        
        return reporte

def main():
    """Función principal"""
    print("🚀 SISTEMA DE SCRAPING MASIVO PARA LEADS REALES")
    print("="*70)
    print("OBTIENE cientos de emails REALES de:")
    print("• Directorios de empresas (Yelp, Crunchbase, LinkedIn)")
    print("• Comunidades tech (GitHub, StackOverflow, Product Hunt)")
    print("• Startups y emprendedores (AngelList, F6S, Techstars)")
    print("• Freelancers y agencias (Upwork, Fiverr, Toptal)")
    print("="*70)
    
    # Verificar/instalar dependencias
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print("Instalando dependencias necesarias...")
        import subprocess
        import sys
        subprocess.run([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4"])
        import requests
        from bs4 import BeautifulSoup
    
    # Ejecutar scraping MASIVO
    scraper = ScrapingMasivoReal()
    
    print("\n🎯 OBJETIVO: 500+ LEADS REALES")
    print("⏱️  ESTIMADO: 10-15 minutos")
    print("📁 RESULTADOS: Directorio 'scraped_leads_masivo/'")
    print("-"*70)
    
    # Confirmar inicio
    input("Presiona ENTER para comenzar el scraping masivo...")
    
    # Ejecutar
    import time
    inicio = time.time()
    
    leads = scraper.ejecutar_scraping_masivo(objetivo_leads=500)
    
    fin = time.time()
    duracion = fin - inicio
    
    if leads:
        print(f"\n✅ SCRAPING MASIVO COMPLETADO EXITOSAMENTE")
        print(f"⏱️  Duración: {duracion:.1f} segundos")
        print(f"🎯 Leads obtenidos: {len(leads)}")
        print(f"📊 Tasa: {len(leads)/duracion*60:.1f} leads/minuto")
        print(f"📁 Resultados en: scraped_leads_masivo/")
        
        # Mostrar ejemplos de alta calidad
        print(f"\n🏆 EJEMPLOS DE LEADS DE ALTA CALIDAD:")
        scraper_leads = ScrapingMasivoReal()  # Para acceder a métodos
        for i, lead in enumerate(leads[:5]):
            if lead.get('score_validez', 0) > 85:
                print(f"{i+1}. {lead.get('nombre', 'N/A')}")
                print(f"   📧 {lead.get('email', 'N/A')}")
                print(f"   🏢 {lead.get('empresa', 'N/A')}")
                print(f"   📞 {lead.get('telefono', 'N/A')}")
                print(f"   🌍 {lead.get('pais', 'N/A')}")
                print(f"   ⭐ Score: {lead.get('score_validez', 0)}/100")
                print()
    else:
        print("⚠️ No se obtuvieron leads en esta sesión")

if __name__ == "__main__":
    main()