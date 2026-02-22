#!/usr/bin/env python3
"""
CREAR 5 APPS ANDROID MÁS - Apps modernas y funcionales
"""

import os
import json
import shutil
from datetime import datetime

class CreadorAppsAndroid:
    def __init__(self):
        self.apps_dir = "android_apps_mas"
        os.makedirs(self.apps_dir, exist_ok=True)
        
        # Definir 5 apps NUEVAS y modernas
        self.nuevas_apps = [
            {
                "nombre": "AI Finance Pro",
                "paquete": "com.aifinance.pro",
                "descripcion": "Gestión financiera inteligente con IA",
                "caracteristicas": [
                    "Análisis de gastos con IA",
                    "Predicción de ingresos",
                    "Inversiones automatizadas",
                    "Alertas inteligentes",
                    "Dashboard en tiempo real"
                ],
                "tecnologias": ["Kotlin", "Jetpack Compose", "Room DB", "ML Kit"],
                "monetizacion": ["Suscripción premium", "Comisiones", "Anuncios selectivos"]
            },
            {
                "nombre": "Health AI Coach",
                "paquete": "com.healthai.coach",
                "descripcion": "Entrenador de salud personalizado con IA",
                "caracteristicas": [
                    "Plan de ejercicios personalizado",
                    "Seguimiento nutricional",
                    "Monitoreo de sueño",
                    "Análisis de progreso",
                    "Comunidad de apoyo"
                ],
                "tecnologias": ["Kotlin", "Health Connect API", "Firebase", "TensorFlow Lite"],
                "monetizacion": ["Suscripción mensual", "Planes premium", "Productos afiliados"]
            },
            {
                "nombre": "Smart Language AI",
                "paquete": "com.smartlanguage.ai",
                "descripcion": "Aprendizaje de idiomas con IA conversacional",
                "caracteristicas": [
                    "Chatbot conversacional",
                    "Reconocimiento de voz",
                    "Lecciones personalizadas",
                    "Corrección en tiempo real",
                    "Juegos interactivos"
                ],
                "tecnologias": ["Kotlin", "Speech-to-Text", "OpenAI API", "Room DB"],
                "monetizacion": ["Suscripción", "Compra de cursos", "Certificaciones"]
            },
            {
                "nombre": "Eco Track Pro",
                "paquete": "com.ecotrack.pro",
                "descripcion": "Seguimiento de huella ecológica y sostenibilidad",
                "caracteristicas": [
                    "Calculadora de huella de carbono",
                    "Desafíos ecológicos",
                    "Comunidad sostenible",
                    "Recomendaciones personalizadas",
                    "Logro de metas"
                ],
                "tecnologias": ["Kotlin", "Google Maps API", "Firebase", "Charts"],
                "monetizacion": ["Donaciones", "Productos ecológicos", "Patrocinios"]
            },
            {
                "nombre": "Creative AI Studio",
                "paquete": "com.creativeai.studio",
                "descripcion": "Estudio creativo con herramientas de IA",
                "caracteristicas": [
                    "Generación de imágenes con IA",
                    "Edición de fotos inteligente",
                    "Diseño de logos",
                    "Creación de contenido",
                    "Exportación profesional"
                ],
                "tecnologias": ["Kotlin", "Canvas API", "ML Kit", "CameraX"],
                "monetizacion": ["Compra de créditos", "Suscripción pro", "Venta de diseños"]
            }
        ]
    
    def crear_estructura_app(self, app_info):
        """Crear estructura completa de una app"""
        nombre_app = app_info["nombre"].replace(" ", "_").lower()
        app_dir = os.path.join(self.apps_dir, nombre_app)
        
        # Crear directorios principales
        directorios = [
            "",
            "app/src/main/java/" + app_info["paquete"].replace(".", "/"),
            "app/src/main/res/layout",
            "app/src/main/res/drawable",
            "app/src/main/res/values",
            "app/src/main/res/mipmap-anydpi-v26",
            "gradle/wrapper"
        ]
        
        for directorio in directorios:
            os.makedirs(os.path.join(app_dir, directorio), exist_ok=True)
        
        # Crear archivos esenciales
        self.crear_build_gradle(app_dir, app_info)
        self.crear_manifest(app_dir, app_info)
        self.crear_main_activity(app_dir, app_info)
        self.crear_layouts(app_dir, app_info)
        self.crear_strings_xml(app_dir, app_info)
        self.crear_colors_xml(app_dir, app_info)
        self.crear_gradle_wrapper(app_dir)
        self.crear_readme(app_dir, app_info)
        
        print(f"✅ App creada: {app_info['nombre']}")
        return app_dir
    
    def crear_build_gradle(self, app_dir, app_info):
        """Crear build.gradle moderno"""
        contenido = f"""plugins {{
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}}

android {{
    namespace '{app_info["paquete"]}'
    compileSdk 34

    defaultConfig {{
        applicationId "{app_info["paquete"]}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {{
            useSupportLibrary true
        }}
    }}

    buildTypes {{
        release {{
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }}
        debug {{
            debuggable true
        }}
    }}
    
    compileOptions {{
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }}
    
    kotlinOptions {{
        jvmTarget = '17'
    }}
    
    buildFeatures {{
        compose true
        viewBinding true
    }}
    
    composeOptions {{
        kotlinCompilerExtensionVersion '1.5.4'
    }}
    
    packagingOptions {{
        resources {{
            excludes += '/META-INF/{{AL2.0,LGPL2.1}}'
        }}
    }}
}}

dependencies {{
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
    implementation 'androidx.activity:activity-compose:1.8.2'
    implementation platform('androidx.compose:compose-bom:2023.10.01')
    implementation 'androidx.compose.ui:ui'
    implementation 'androidx.compose.ui:ui-graphics'
    implementation 'androidx.compose.ui:ui-tooling-preview'
    implementation 'androidx.compose.material3:material3'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Jetpack Compose
    implementation 'androidx.compose.material:material-icons-extended:1.5.4'
    
    // ViewModel
    implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0'
    
    // Navigation
    implementation 'androidx.navigation:navigation-compose:2.7.5'
    
    // Room Database
    implementation 'androidx.room:room-runtime:2.6.1'
    implementation 'androidx.room:room-ktx:2.6.1'
    kapt 'androidx.room:room-compiler:2.6.1'
    
    // Retrofit para APIs
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // Coil para imágenes
    implementation 'io.coil-kt:coil-compose:2.5.0'
    
    // Charts
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-analytics'
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
    
    // ML Kit para {app_info['nombre']}
    implementation 'com.google.mlkit:vision-common:17.3.0'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation platform('androidx.compose:compose-bom:2023.10.01')
    androidTestImplementation 'androidx.compose.ui:ui-test-junit4'
    debugImplementation 'androidx.compose.ui:ui-tooling'
    debugImplementation 'androidx.compose.ui:ui-test-manifest'
}}
"""
        
        with open(os.path.join(app_dir, "app", "build.gradle"), 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    def crear_manifest(self, app_dir, app_info):
        """Crear AndroidManifest.xml"""
        contenido = f"""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Permisos específicos para {app_info['nombre']} -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.{app_info['nombre'].replace(' ', '')}"
        tools:targetApi="31">
        
        <activity
            android:name=".{app_info['nombre'].replace(' ', '')}MainActivity"
            android:exported="true"
            android:theme="@style/Theme.{app_info['nombre'].replace(' ', '')}">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Servicios y receptores -->
        <service
            android:name=".services.NotificationService"
            android:exported="false" />
            
        <receiver android:name=".receivers.AlarmReceiver"
            android:exported="false" />
            
        <!-- Meta-data para Firebase -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@drawable/ic_notification" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/purple_500" />
            
    </application>

</manifest>
"""
        
        with open(os.path.join(app_dir, "app", "src", "main", "AndroidManifest.xml"), 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    def crear_main_activity(self, app_dir, app_info):
        """Crear MainActivity.kt moderna con Jetpack Compose"""
        nombre_clase = app_info['nombre'].replace(' ', '') + 'MainActivity'
        paquete_path = app_info['paquete'].replace('.', '/')
        
        contenido = f"""package {app_info['paquete']}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import {app_info['paquete']}.ui.theme.{app_info['nombre'].replace(' ', '')}Theme

class {nombre_clase} : ComponentActivity() {{
    override fun onCreate(savedInstanceState: Bundle?) {{
        super.onCreate(savedInstanceState)
        setContent {{
            {app_info['nombre'].replace(' ', '')}Theme {{
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {{
                    val navController = rememberNavController()
                    AppNavigation(navController = navController)
                }}
            }}
        }}
    }}
}}
"""
        
        activity_path = os.path.join(app_dir, "app", "src", "main", "java", paquete_path, f"{nombre_clase}.kt")
        with open(activity_path, 'w', encoding='utf-8') as f:
            f.write(contenido)
        
        # Crear también AppNavigation
        self.crear_app_navigation(app_dir, app_info, paquete_path)
    
    def crear_app_navigation(self, app_dir, app_info, paquete_path):
        """Crear sistema de navegación"""
        contenido = f"""package {app_info['paquete']}

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import {app_info['paquete']}.screens.*

@Composable
fun AppNavigation(navController: androidx.navigation.NavHostController = rememberNavController()) {{
    NavHost(
        navController = navController,
        startDestination = Screens.Home.route
    ) {{
        composable(Screens.Home.route) {{
            HomeScreen(navController = navController)
        }}
        composable(Screens.Dashboard.route) {{
            DashboardScreen(navController = navController)
        }}
        composable(Screens.Profile.route) {{
            ProfileScreen(navController = navController)
        }}
        composable(Screens.Settings.route) {{
            SettingsScreen(navController = navController)
        }}
        composable(Screens.Analytics.route) {{
            AnalyticsScreen(navController = navController)
        }}
    }}
}}

sealed class Screens(val route: String) {{
    object Home : Screens("home")
    object Dashboard : Screens("dashboard")
    object Profile : Screens("profile")
    object Settings : Screens("settings")
    object Analytics : Screens("analytics")
}}
"""
        
        nav_path = os.path.join(app_dir, "app", "src", "main", "java", paquete_path, "AppNavigation.kt")
        with open(nav_path, 'w', encoding='utf-8') as f:
            f.write(contenido)
        
        # Crear screens básicas
        self.crear_screens(app_dir, app_info, paquete_path)
    
    def crear_screens(self, app_dir, app_info, paquete_path):
        """Crear pantallas básicas de la app"""
        screens = ["HomeScreen", "DashboardScreen", "ProfileScreen", "SettingsScreen", "AnalyticsScreen"]
        
        for screen in screens:
            contenido = f"""package {app_info['paquete']}.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController

@Composable
fun {screen}(navController: NavHostController) {{
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {{
        Text(
            text = "{screen.replace('Screen', '')}",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Text(
            text = "Bienvenido a {app_info['nombre']}",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
