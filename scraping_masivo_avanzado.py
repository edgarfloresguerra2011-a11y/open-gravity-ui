#!/usr/bin/env python3
"""
SCRAPING MASIVO AVANZADO PARA LEADS REALES
Extrae cientos de correos reales de múltiples fuentes
"""

import requests
import re
import time
import csv
import json
import os
import random
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from datetime import datetime

class AdvancedScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        self.output_dir = "leads_masivos"
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Fuentes masivas para scraping
        self.sources = self._load_sources()
        
        # Patrones de email
        self.email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        
        # Estadísticas
        self.stats = {
            "total_emails": 0,
            "unique_emails": 0,
            "sources_scraped": 0,
            "errors": 0,
            "start_time": datetime.now()
        }
    
    def _load_sources(self):
        """Cargar fuentes de scraping"""
        return [
            # Directorios de negocios
            {"url": "https://www.yellowpages.com/search?search_terms=business&geo_location_terms=New+York%2C+NY", "type": "business"},
            {"url": "https://www.yellowpages.com/search?search_terms=restaurant&geo_location_terms=Los+Angeles%2C+CA", "type": "business"},
            {"url": "https://www.yellowpages.com/search?search_terms=lawyer&geo_location_terms=Chicago%2C+IL", "type": "professional"},
            
            # Directorios de empresas
            {"url": "https://www.manta.com/search?search=small+business", "type": "business"},
            {"url": "https://www.business.com/categories/", "type": "business"},
            
            # Directorios de startups
            {"url": "https://angel.co/companies", "type": "startup"},
            {"url": "https://www.startupblink.com/startups", "type": "startup"},
            
            # Directorios de freelancers
            {"url": "https://www.upwork.com/freelancers/", "type": "freelancer"},
            {"url": "https://www.fiverr.com/categories", "type": "freelancer"},
            
            # Directorios de ecommerce
            {"url": "https://www.shopify.com/plus/customers", "type": "ecommerce"},
            {"url": "https://www.etsy.com/sellers", "type": "ecommerce"},
            
            # Directorios de servicios
            {"url": "https://www.thumbtack.com/categories", "type": "service"},
            {"url": "https://www.homeadvisor.com/categories.html", "type": "service"},
            
            # Directorios de salud
            {"url": "https://www.healthgrades.com/find-a-doctor", "type": "health"},
            {"url": "https://www.zocdoc.com/doctors", "type": "health"},
            
            # Directorios de bienes raíces
            {"url": "https://www.realtor.com/realestateagents", "type": "realestate"},
            {"url": "https://www.zillow.com/professionals/", "type": "realestate"},
            
            # Directorios de abogados
            {"url": "https://www.avvo.com/find-a-lawyer", "type": "legal"},
            {"url": "https://www.martindale.com/", "type": "legal"},
            
            # Directorios de educación
            {"url": "https://www.coursera.org/instructors", "type": "education"},
            {"url": "https://www.udemy.com/courses/development/", "type": "education"},
            
            # Directorios de tecnología
            {"url": "https://www.producthunt.com/makers", "type": "tech"},
            {"url": "https://www.behance.net/search/users", "type": "creative"},
            {"url": "https://dribbble.com/designers", "type": "creative"},
            
            # Directorios de medios
            {"url": "https://www.muckrack.com/media-outlets", "type": "media"},
            {"url": "https://www.issuu.com/explore", "type": "media"},
            
            # Directorios de podcasts
            {"url": "https://www.podchaser.com/podcasts", "type": "podcast"},
            {"url": "https://www.listennotes.com/podcasts/", "type": "podcast"},
            
            # Directorios de YouTube
            {"url": "https://www.youtube.com/channels", "type": "youtube"},
            
            # Directorios de influencers
            {"url": "https://www.influence.co/explore", "type": "influencer"},
            {"url": "https://www.tribe.com/creators", "type": "influencer"},
            
            # Directorios de afiliados
            {"url": "https://www.shareasale.com/merchants/", "type": "affiliate"},
            {"url": "https://www.cj.com/publisher", "type": "affiliate"},
            
            # Directorios de fabricantes
            {"url": "https://www.thomasnet.com/products/", "type": "manufacturer"},
            {"url": "https://www.mfg.com/", "type": "manufacturer"},
            
            # Directorios de retail
            {"url": "https://www.retailmenot.com/view/store", "type": "retail"},
            {"url": "https://www.coupons.com/stores/", "type": "retail"},
            
            # Directorios de franquicias
            {"url": "https://www.franchise.org/franchise-opportunities", "type": "franchise"},
            {"url": "https://www.franchisedirect.com/", "type": "franchise"},
            
            # Directorios de software
            {"url": "https://www.capterra.com/", "type": "software"},
            {"url": "https://www.g2.com/products", "type": "software"},
            
            # Directorios de apps
            {"url": "https://play.google.com/store/apps", "type": "apps"},
            
            # Directorios de blockchain
            {"url": "https://www.coinmarketcap.com/", "type": "crypto"},
            {"url": "https://www.dappradar.com/", "type": "crypto"},
            
            # Directorios de AI
            {"url": "https://www.aitoolkit.org/", "type": "ai"},
            {"url": "https://www.futuretools.io/", "type": "ai"},
            
            # Directorios de consultoría
            {"url": "https://www.consulting.com/directory", "type": "consulting"},
            {"url": "https://www.consultancy.org/consultants", "type": "consulting"},
            
            # Directorios de outsourcing
            {"url": "https://www.outsourcing-philippines.com/directory/", "type": "outsourcing"},
            {"url": "https://www.clutch.co/bpo", "type": "outsourcing"},
        ]
    
    def scrape_source(self, source):
        """Scrape una fuente individual"""
        try:
            print(f"  Scraping: {source['url'][:50]}...")
            
            response = requests.get(source['url'], headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extraer emails del texto
            text = soup.get_text()
            emails = re.findall(self.email_pattern, text)
            
            # Extraer emails de enlaces
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href']
                if 'mailto:' in href:
                    email = href.replace('mailto:', '').split('?')[0]
                    if re.match(self.email_pattern, email):
                        emails.append(email)
            
            # Filtrar y limpiar emails
            valid_emails = []
            for email in emails:
                email = email.lower().strip()
                if (re.match(self.email_pattern, email) and 
                    not email.endswith(('.png', '.jpg', '.gif', '.svg', '.css', '.js')) and
                    'example' not in email and 
                    'test' not in email and
                    'noreply' not in email):
                    valid_emails.append(email)
            
            # Estadísticas
            self.stats["total_emails"] += len(valid_emails)
            self.stats["sources_scraped"] += 1
            
            time.sleep(random.uniform(2, 4))  # Espera aleatoria
            
            return {
                "source": source['url'],
                "type": source['type'],
                "emails": valid_emails,
                "count": len(valid_emails),
                "success": True
            }
            
        except Exception as e:
            self.stats["errors"] += 1
            print(f"  Error scraping {source['url'][:50]}: {str(e)[:50]}")
            return {
                "source": source['url'],
                "type": source['type'],
                "emails": [],
                "count": 0,
                "success": False,
                "error": str(e)
            }
    
    def scrape_all_sources(self, max_workers=5):
        """Scrape todas las fuentes en paralelo"""
        print(f"Iniciando scraping masivo de {len(self.sources)} fuentes...")
        
        all_emails = []
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_source = {executor.submit(self.scrape_source, source): source for source in self.sources}
            
            for future in as_completed(future_to_source):
                source = future_to_source[future]
                try:
                    result = future.result()
                    results.append(result)
                    
                    if result["success"] and result["emails"]:
                        all_emails.extend(result["emails"])
                        print(f"  ✓ {source['url'][:40]}...: {result['count']} emails")
                    
                except Exception as e:
                    print(f"  ✗ Error procesando {source['url'][:40]}: {str(e)[:50]}")
        
        # Eliminar duplicados
        unique_emails = list(set(all_emails))
        self.stats["unique_emails"] = len(unique_emails)
        
        return unique_emails, results
    
    def save_results(self, emails, results):
        """Guardar resultados"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Guardar emails en CSV
        csv_file = os.path.join(self.output_dir, f"leads_{timestamp}.csv")
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Email', 'Source', 'Type', 'Date'])
            
            for result in results:
                for email in result['emails']:
                    writer.writerow([email, result['source'], result['type'], datetime.now().strftime('%Y-%m-%d')])
        
        # Guardar emails en TXT
        txt_file = os.path.join(self.output_dir, f"leads_{timestamp}.txt")
        with open(txt_file, 'w', encoding='utf-8') as f:
            for email in emails:
                f.write(email + '\n')
        
        # Guardar resultados detallados
        json_file = os.path.join(self.output_dir, f"results_{timestamp}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                "stats": self.stats,
                "total_sources": len(self.sources),
                "scraped_sources": self.stats["sources_scraped"],
                "total_emails_found": self.stats["total_emails"],
                "unique_emails": self.stats["unique_emails"],
                "results": results
            }, f, indent=2)
        
        # Guardar estadísticas
        stats_file = os.path.join(self.output_dir, f"stats_{timestamp}.txt")
        with open(stats_file, 'w', encoding='utf-8') as f:
            f.write("=" * 60 + "\n")
            f.write("ESTADÍSTICAS DE SCRAPING MASIVO\n")
            f.write("=" * 60 + "\n")
            f.write(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Fuentes totales: {len(self.sources)}\n")
            f.write(f"Fuentes scrapeadas: {self.stats['sources_scraped']}\n")
            f.write(f"Emails encontrados: {self.stats['total_emails']}\n")
            f.write(f"Emails únicos: {self.stats['unique_emails']}\n")
            f.write(f"Errores: {self.stats['errors']}\n")
            f.write(f"Tiempo total: {(datetime.now() - self.stats['start_time']).total_seconds():.2f} segundos\n")
            f.write("=" * 60 + "\n")
            
            # Estadísticas por tipo
            type_stats = {}
            for result in results:
                if result['success']:
                    type_stats[result['type']] = type_stats.get(result['type'], 0) + result['count']
            
            f.write("\nESTADÍSTICAS POR TIPO:\n")
            for type_name, count in type_stats.items():
                f.write(f"  {type_name}: {count} emails\n")
        
        return csv_file, txt_file, json_file, stats_file
    
    def run(self):
        """Ejecutar scraping completo"""
        print("=" * 60)
        print("SCRAPING MASIVO AVANZADO PARA LEADS REALES")
        print("=" * 60)
        
        # Scrapear todas las fuentes
        emails, results = self.scrape_all_sources(max_workers=10)
        
        # Guardar resultados
        csv_file, txt_file, json_file, stats_file = self.save_results(emails, results)
        
        # Mostrar resumen
        print("\n" + "=" * 60)
        print("SCRAPING COMPLETADO")
        print("=" * 60)
        print(f"📊 Estadísticas:")
        print(f"   • Fuentes procesadas: {self.stats['sources_scraped']}/{len(self.sources)}")
        print(f"   • Emails encontrados: {self.stats['total_emails']}")
        print(f"   • Emails únicos: {self.stats['unique_emails']}")
        print(f"   • Errores: {self.stats['errors']}")
        print(f"   • Tiempo: {(datetime.now() - self.stats['start_time']).total_seconds():.2f} segundos")
        print(f"\n💾 Archivos guardados:")
        print(f"   • CSV: {csv_file}")
        print(f"   • TXT: {txt_file}")
        print(f"   • JSON: {json_file}")
        print(f"   • Stats: {stats_file}")
        
        # Mostrar algunos emails de ejemplo
        if emails:
            print(f"\n📧 Ejemplos de emails obtenidos:")
            for i, email in enumerate(emails[:10], 1):
                print(f"   {i}. {email}")
        
        print("\n" + "=" * 60)
        print("✅ SCRAPING MASIVO COMPLETADO EXITOSAMENTE")
        print("=" * 60)
        
        return emails

def main():
    """Función principal"""
    scraper = AdvancedScraper()
    emails = scraper.run()
    
    # Crear resumen para proyectos
    create_projects_summary(emails)
    
    return emails

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
        {"name": "Landing