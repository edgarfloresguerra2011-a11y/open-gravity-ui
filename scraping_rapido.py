#!/usr/bin/env python3
"""
SCRAPING RÁPIDO PARA LEADS REALES
Extrae correos reales de directorios públicos
"""

import requests
import re
import time
import csv
import os
from bs4 import BeautifulSoup

def scrape_yellow_pages():
    """Scrape Yellow Pages for business emails"""
    print("Scraping Yellow Pages...")
    emails = []
    
    # URLs de Yellow Pages para diferentes categorías
    urls = [
        "https://www.yellowpages.com/search?search_terms=restaurant&geo_location_terms=New+York%2C+NY",
        "https://www.yellowpages.com/search?search_terms=lawyer&geo_location_terms=Los+Angeles%2C+CA",
        "https://www.yellowpages.com/search?search_terms=doctor&geo_location_terms=Chicago%2C+IL",
        "https://www.yellowpages.com/search?search_terms=plumber&geo_location_terms=Houston%2C+TX",
        "https://www.yellowpages.com/search?search_terms=electrician&geo_location_terms=Phoenix%2C+AZ",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for url in urls:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Buscar emails en la página
            text = soup.get_text()
            found_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            
            for email in found_emails:
                if email not in emails and not email.endswith(('.png', '.jpg', '.gif')):
                    emails.append(email)
                    print(f"  Encontrado: {email}")
            
            time.sleep(2)  # Esperar entre requests
            
        except Exception as e:
            print(f"  Error en {url}: {e}")
    
    return emails

def scrape_crunchbase():
    """Scrape Crunchbase for startup emails"""
    print("Scraping Crunchbase...")
    emails = []
    
    # URLs de Crunchbase
    urls = [
        "https://www.crunchbase.com/search/organizations/field/organizations/categories/software",
        "https://www.crunchbase.com/search/organizations/field/organizations/categories/fintech",
        "https://www.crunchbase.com/search/organizations/field/organizations/categories/healthcare",
        "https://www.crunchbase.com/search/organizations/field/organizations/categories/education",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for url in urls:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Buscar emails
            text = soup.get_text()
            found_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            
            for email in found_emails:
                if email not in emails and not email.endswith(('.png', '.jpg', '.gif')):
                    emails.append(email)
                    print(f"  Encontrado: {email}")
            
            time.sleep(3)
            
        except Exception as e:
            print(f"  Error en {url}: {e}")
    
    return emails

def scrape_github_users():
    """Scrape GitHub for developer emails"""
    print("Scraping GitHub...")
    emails = []
    
    # URLs de GitHub (usuarios populares)
    urls = [
        "https://github.com/trending/developers",
        "https://github.com/search?q=type%3Auser&s=followers&type=Users",
        "https://github.com/search?q=location%3AUnited+States&type=Users",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for url in urls:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Buscar emails en perfiles
            links = soup.find_all('a', href=True)
            profile_links = [link['href'] for link in links if '/search?' not in link['href'] and link['href'].startswith('/')]
            
            for profile in profile_links[:10]:  # Limitar a 10 perfiles
                try:
                    profile_url = f"https://github.com{profile}"
                    profile_response = requests.get(profile_url, headers=headers, timeout=10)
                    profile_soup = BeautifulSoup(profile_response.text, 'html.parser')
                    
                    # Buscar email en el perfil
                    profile_text = profile_soup.get_text()
                    found_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', profile_text)
                    
                    for email in found_emails:
                        if email not in emails and not email.endswith(('.png', '.jpg', '.gif')):
                            emails.append(email)
                            print(f"  Encontrado en GitHub: {email}")
                    
                    time.sleep(2)
                    
                except Exception as e:
                    continue
            
        except Exception as e:
            print(f"  Error en {url}: {e}")
    
    return emails

def scrape_linkedin_profiles():
    """Scrape LinkedIn public profiles"""
    print("Scraping LinkedIn...")
    emails = []
    
    # URLs de LinkedIn (búsquedas públicas)
    urls = [
        "https://www.linkedin.com/pub/dir/?first=John&last=Smith",
        "https://www.linkedin.com/pub/dir/?first=Jane&last=Doe",
        "https://www.linkedin.com/pub/dir/?first=Michael&last=Johnson",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for url in urls:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Buscar emails
            text = soup.get_text()
            found_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            
            for email in found_emails:
                if email not in emails and not email.endswith(('.png', '.jpg', '.gif')):
                    emails.append(email)
                    print(f"  Encontrado en LinkedIn: {email}")
            
            time.sleep(4)  # LinkedIn es sensible, esperar más
            
        except Exception as e:
            print(f"  Error en {url}: {e}")
    
    return emails

def scrape_public_directories():
    """Scrape directorios públicos"""
    print("Scraping directorios públicos...")
    emails = []
    
    # Directorios públicos con información de contacto
    directories = [
        "https://www.whitepages.com/",
        "https://www.spokeo.com/",
        "https://www.truepeoplesearch.com/",
        "https://www.instantcheckmate.com/",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for directory in directories:
        try:
            response = requests.get(directory, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Buscar emails
            text = soup.get_text()
            found_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            
            for email in found_emails:
                if email not in emails and not email.endswith(('.png', '.jpg', '.gif')):
                    emails.append(email)
                    print(f"  Encontrado en directorio: {email}")
            
            time.sleep(3)
            
        except Exception as e:
            print(f"  Error en {directory}: {e}")
    
    return emails

def save_emails(emails, filename="leads_reales.csv"):
    """Guardar emails en CSV"""
    print(f"\nGuardando {len(emails)} emails en {filename}...")
    
    os.makedirs("leads", exist_ok=True)
    filepath = os.path.join("leads", filename)
    
    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Email', 'Source', 'Date'])
        
        for email in emails:
            writer.writerow([email, 'Scraping', time.strftime('%Y-%m-%d')])
    
    # También guardar en TXT
    txt_path = os.path.join("leads", "leads_reales.txt")
    with open(txt_path, 'w', encoding='utf-8') as txtfile:
        for email in emails:
            txtfile.write(email + '\n')
    
    print(f"Emails guardados en {filepath}")
    print(f"Total de leads obtenidos: {len(emails)}")

def main():
    """Función principal"""
    print("=" * 60)
    print("SISTEMA DE SCRAPING RÁPIDO PARA LEADS REALES")
    print("=" * 60)
    
    all_emails = []
    
    # Ejecutar todos los scrapers
    all_emails.extend(scrape_yellow_pages())
    all_emails.extend(scrape_crunchbase())
    all_emails.extend(scrape_github_users())
    all_emails.extend(scrape_linkedin_profiles())
    all_emails.extend(scrape_public_directories())
    
    # Eliminar duplicados
    unique_emails = list(set(all_emails))
    
    # Guardar resultados
    save_emails(unique_emails)
    
    print("\n" + "=" * 60)
    print("SCRAPING COMPLETADO")
    print(f"Total de emails únicos obtenidos: {len(unique_emails)}")
    print("=" * 60)
    
    # Mostrar algunos ejemplos
    if unique_emails:
        print("\nEjemplos de emails obtenidos:")
        for i, email in enumerate(unique_emails[:10], 1):
            print(f"  {i}. {email}")
    
    return unique_emails

if __name__ == "__main__":
    main()