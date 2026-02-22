#!/usr/bin/env python3
"""
SISTEMA DE SCRAPING REAL PARA LEADS REALES
Extrae cientos de correos reales de personas reales
"""

import requests
import re
import time
import random
import csv
import json
import os
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urljoin, urlparse

class RealScrapingSystem:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Directorios de salida
        self.output_dir = "leads_reales"
        self.backup_dir = os.path.join(self.output_dir, "backup")
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.backup_dir, exist_ok=True)
        
        # Archivos de resultados
        self.csv_file = os.path.join(self.output_dir, "leads_reales.csv")
        self.json_file = os.path.join(self.output_dir, "leads_reales.json")
        self.txt_file = os.path.join(self.output_dir, "leads_reales.txt")
        
        # Fuentes reales para scraping
        self.sources = [
            # Directorios de empresas
            "https://www.yellowpages.com/search?search_terms=small+business&geo_location_terms=United+States",
            "https://www.manta.com/search?search=small+business",
            "https://www.business.com/categories/",
            
            # Directorios de profesionales
            "https://www.linkedin.com/directory/companies/",
            "https://www.crunchbase.com/search/organizations",
            
            # Directorios de startups
            "https://angel.co/companies",
            "https://www.startupblink.com/startups",
            
            # Directorios de freelancers
            "https://www.upwork.com/freelancers/",
            "https://www.fiverr.com/categories",
            
            # Directorios de ecommerce
            "https://www.shopify.com/plus/customers",
            "https://www.etsy.com/sellers",
            
            # Directorios de servicios locales
            "https://www.thumbtack.com/categories",
            "https://www.homeadvisor.com/categories.html",
            
            # Directorios de restaurantes
            "https://www.opentable.com/restaurant-directory",
            "https://www.yelp.com/search?find_desc=Restaurants",
            
            # Directorios de consultores
            "https://www.clutch.co/directory",
            "https://www.g2.com/categories",
            
            # Directorios de educación
            "https://www.coursera.org/instructors",
            "https://www.udemy.com/courses/development/",
            
            # Directorios de salud
            "https://www.healthgrades.com/find-a-doctor",
            "https://www.zocdoc.com/doctors",
            
            # Directorios de bienes raíces
            "https://www.realtor.com/realestateagents",
            "https://www.zillow.com/professionals/",
            
            # Directorios de abogados
            "https://www.avvo.com/find-a-lawyer",
            "https://www.martindale.com/",
            
            # Directorios de contadores
            "https://www.accountingtoday.com/directory",
            "https://www.cpa.com/",
            
            # Directorios de marketing
            "https://www.marketingprofs.com/directory",
            "https://www.hubspot.com/agencies",
            
            # Directorios de tecnología
            "https://www.techcrunch.com/startup-directory",
            "https://www.producthunt.com/makers",
            
            # Directorios de diseño
            "https://www.behance.net/search/users",
            "https://dribbble.com/designers",
            
            # Directorios de escritores
            "https://www.contently.com/creators",
            "https://www.medium.com/top-writers",
            
            # Directorios de fotógrafos
            "https://www.500px.com/popular",
            "https://www.instagram.com/explore/tags/photographer/",
            
            # Directorios de músicos
            "https://www.soundcloud.com/people",
            "https://www.bandcamp.com/artists",
            
            # Directorios de artistas
            "https://www.artsy.net/artists",
            "https://www.saatchiart.com/artists",
            
            # Directorios de coaches
            "https://www.noomii.com/coaches",
            "https://www.coach.me/coaches",
            
            # Directorios de terapeutas
            "https://www.psychologytoday.com/us/therapists",
            "https://www.talkspace.com/therapists",
            
            # Directorios de fitness
            "https://www.mindbodyonline.com/explore",
            "https://www.classpass.com/studios",
            
            # Directorios de viajes
            "https://www.tripadvisor.com/Attractions",
            "https://www.airbnb.com/hosts",
            
            # Directorios de eventos
            "https://www.eventbrite.com/directory",
            "https://www.meetup.com/find/events/",
            
            # Directorios de organizaciones sin fines de lucro
            "https://www.guidestar.org/NonprofitDirectory.aspx",
            "https://www.charitynavigator.org/",
            
            # Directorios de gobierno
            "https://www.usa.gov/agency-index",
            "https://www.data.gov/organizations",
            
            # Directorios de investigación
            "https://www.researchgate.net/institutions",
            "https://scholar.google.com/citations?view_op=view_org",
            
            # Directorios de medios
            "https://www.muckrack.com/media-outlets",
            "https://www.mediabistro.com/joblistings/",
            
            # Directorios de publicaciones
            "https://www.issuu.com/explore",
            "https://www.slideshare.net/popular",
            
            # Directorios de podcasts
            "https://www.podchaser.com/podcasts",
            "https://www.listennotes.com/podcasts/",
            
            # Directorios de YouTube
            "https://www.youtube.com/channels",
            "https://www.tubebuddy.com/channels",
            
            # Directorios de Twitch
            "https://www.twitch.tv/directory",
            "https://www.streamlabs.com/dashboard",
            
            # Directorios de TikTok
            "https://www.tiktok.com/tag/creator",
            "https://www.tiktok.com/business/en/creators",
            
            # Directorios de influencers
            "https://www.influence.co/explore",
            "https://www.tribe.com/creators",
            
            # Directorios de afiliados
            "https://www.shareasale.com/merchants/",
            "https://www.cj.com/publisher",
            
            # Directorios de dropshipping
            "https://www.salehoo.com/directory",
            "https://www.worldwidebrands.com/",
            
            # Directorios de import/export
            "https://www.alibaba.com/countrysearch/",
            "https://www.globalsources.com/",
            
            # Directorios de fabricantes
            "https://www.thomasnet.com/products/",
            "https://www.mfg.com/",
            
            # Directorios de distribuidores
            "https://www.distributorcentral.com/",
            "https://www.wholesalecentral.com/",
            
            # Directorios de retail
            "https://www.retailmenot.com/view/store",
            "https://www.coupons.com/stores/",
            
            # Directorios de franquicias
            "https://www.franchise.org/franchise-opportunities",
            "https://www.franchisedirect.com/",
            
            # Directorios de inversores
            "https://www.gust.com/investors",
            "https://www.f6s.com/investors",
            
            # Directorios de aceleradoras
            "https://www.ycombinator.com/companies",
            "https://www.techstars.com/portfolio",
            
            # Directorios de incubadoras
            "https://www.incubatorlist.com/",
            "https://www.startupgenome.com/ecosystems",
            
            # Directorios de coworking
            "https://www.coworker.com/directory",
            "https://www.wework.com/locations",
            
            # Directorios de conferencias
            "https://www.eventbrite.com/d/conferences--business/",
            "https://www.lanyrd.com/conferences/",
            
            # Directorios de asociaciones
            "https://www.associationdirectory.com/",
            "https://www.asae.com/resources/online-directories",
            
            # Directorios de certificaciones
            "https://www.iso.org/certification.html",
            "https://www.pmi.org/certifications",
            
            # Directorios de consultoría
            "https://www.consulting.com/directory",
            "https://www.consultancy.org/consultants",
            
            # Directorios de outsourcing
            "https://www.outsourcing-philippines.com/directory/",
            "https://www.clutch.co/bpo",
            
            # Directorios de software
            "https://www.capterra.com/",
            "https://www.g2.com/products",
            
            # Directorios de apps
            "https://www.apple.com/app-store/",
            "https://play.google.com/store/apps",
            
            # Directorios de juegos
            "https://www.steampowered.com/",
            "https://www.epicgames.com/store/",
            
            # Directorios de blockchain
            "https://www.coinmarketcap.com/",
            "https://www.dappradar.com/",
            
            # Directorios de AI
            "https://www.aitoolkit.org/",
            "https://www.futuretools.io/",
            
            # Directorios de IoT
            "https://www.iotone.com/directory",
            "https://www.postscapes.com/iot-directory/",
            
            # Directorios de robótica
            "https://www.roboticsbusinessreview.com/directory/",
            "https://www.robots.com/robots",
            
            # Directorios de drones
            "https://www.dronedirectory.com/",
            "https://www.dronebase.com/pilots",
            
            # Directorios de VR/AR
            "https://www.vrroom.buzz/directory",
            "https://www.arvrtoday.com/directory/",
            
            # Directorios de 3D printing
            "https://www.3dhubs.com/",
            "https://www.shapeways.com/marketplace",
            
            # Directorios de energías renovables
            "https://www.renewableenergyworld.com/directory/",
            "https://www.cleanenergywire.org/directory",
            
            # Directorios de vehículos eléctricos
            "https://www.electricautonomy.ca/directory/",
            "https://www.plugshare.com/",
            
            # Directorios de biotecnología
            "https://www.biotechgate.com/",
            "https://www.bio.org/members",
            
            # Directorios de farmacéutica
            "https://www.pharmalive.com/directory/",
            "https://www.pharmaceutical-technology.com/companies/",
            
            # Directorios de médica
            "https://www.medicaldevicedirectory.com/",
            "https://www.medtechdive.com/directory/",
            
            # Directorios de dental
            "https://www.dentalproductsreport.com/directory",
            "https://www.dentaleconomics.com/directory",
            
            # Directorios de veterinaria
            "https://www.veterinarypracticenews.com/directory/",
            "https://www.vetstreet.com/veterinarians",
            
            # Directorios de agricultura
            "https://www.agriculture.com/directory",
            "https://www.farmprogress.com/directory",
            
            # Directorios de alimentos
            "https://www.foodbusinessnews.net/directory/",
            "https://www.foodengineeringmag.com/directory",
            
            # Directorios de bebidas
            "https://www.bevindustry.com/directory",
            "https://www.beveragedaily.com/directory",
            
            # Directorios de moda
            "https://www.fashionista.com/directory",
            "https://www.businessoffashion.com/directory",
            
            # Directorios de belleza
            "https://www.beautypackaging.com/directory",
            "https://www.cosmeticsdesign.com/directory",
            
            # Directorios de joyería
            "https://www.jckonline.com/directory/",
            "https://www.nationaljeweler.com/directory",
            
            # Directorios de relojes
            "https://www.watchtime.com/directory/",
            "https://www.hodinkee.com/brands",
            
            # Directorios de arte
            "https://www.artnews.com/directory/",
            "https://www.artforum.com/directory",
            
            # Directorios de antigüedades
            "https://www.antiquetrader.com/directory",
            "https://www.liveauctioneers.com/directory/",
            
            # Directorios de coleccionables
            "https://www.collectorsweekly.com/directory",
            "https://www.worthpoint.com/directory",
            
            # Directorios de deportes
            "https://www.sportsbusinessjournal.com/Directory/",
            "https://www.sporttechie.com/directory",
            
            # Directorios de fitness
            "https://www.ihrsa.org/directory/",
            "https://www.acefitness.org/find-a-pro/",
            
            # Directorios de outdoors
            "https://www.outdoorindustry.org/directory/",
            "https://www.rei.com/stores",
            
            # Directorios de viajes
            "https://www.travelweekly.com/Directory/",
            "https://www.travelagentcentral.com/directory",
            
            # Directorios de hoteles
            "https://www.hotelnewsresource.com/directory/",
            "https://www.hospitalitynet.org/directory/",
            
            # Directorios de restaurantes
            "https://www.restaurantbusinessonline.com/directory",
            "https://www.nrn.com/directory",
            
            # Directorios de catering
            "https://www.cateringmagazine.com/directory/",
            "https://www.specialevents.com/directory",
            
            # Directorios de eventos
            "https://www.bizbash.com/directory",
            "https://www.eventmarketer.com/directory/",
            
            # Directorios de wedding
            "https://www.theknot.com/vendors",
            "https://www.weddingwire.com/vendors",
            
            # Directorios de funeral
            "https://www.funeralwise.com/directory/",
            "https://www.nfda.org/find-a-funeral-home",
            
            # Directorios de seguros
            "https://www.insurancejournal.com/directory/",
            "https://www.insurancenewsnet.com/directory",
            
            # Directorios de bancos
            "https://www.americanbanker.com/directory",
            "https://www.bankdirector.com/directory/",
            
            # Directorios de fintech
            "https://www.fintechfutures.com/directory/",
            "https://www.fintechweekly.com/directory",
            
            # Directorios de cripto
            "https://www.coindesk.com/directory/",
            "https://www.cryptoslate.com/companies/",
            
            # Directorios de trading
            "https://www.tradersmagazine.com/directory/",
            "https://www.financemagnates.com/directory/",
            
            # Directorios de bienes raíces
            "https://www.realtormag.com/directory/",
            "https://www.housingwire.com/directory/",
            
            # Directorios de construcción
            "https://www.construction.com/directory/",
            "https://www.enr.com/directory",
            
            # Directorios de arquitectura
            "https://www.architectmagazine.com/directory",
            "https://www.archdaily.com/offices",
            
            # Directorios de diseño interior
            "https://www.interiordesign.net/directory/",
            "https://www.dezeen.com/interiors/",
            
            # Directorios de paisajismo
            "https://www.landscapemanagement.net/directory/",
            "https://www.landscapeonline.com/directory/",
            
            # Directorios de limpieza
            "https://www.cleanlink.com/directory/",
            "https://www.issa.com/directory",
            
            # Directorios de seguridad
            "https://www.securitymagazine.com/directory",
            "https://www.sdmmag.com/directory",
            
            # Directorios de logística
            "https://www.logisticsmgmt.com/directory/",
            "https://www.supplychain247.com/directory",
            
            # Directorios de transporte
            "https://www.ttnews.com/directory",
            "https://www.fleetowner.com/d