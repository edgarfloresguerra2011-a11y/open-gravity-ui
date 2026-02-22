#!/usr/bin/env python3
"""
Creación Simple de 5 Apps Android - Estructuras Básicas
"""

import os
import json
from datetime import datetime

# Apps Android a crear
apps = [
    {
        "name": "Finanzas Pro",
        "id": "finanzas_pro",
        "desc": "Gestión financiera personal inteligente",
        "color": "#4CAF50"
    },
    {
        "name": "Salud Diaria",
        "id": "salud_diaria",
        "desc": "Seguimiento de salud y bienestar",
        "color": "#2196F3"
    },
    {
        "name": "Aprende Idiomas",
        "id": "aprende_idiomas",
        "desc": "Aprendizaje de idiomas con IA",
        "color": "#FF9800"
    },
    {
        "name": "Productividad Pro",
        "id": "productividad_pro",
        "desc": "Gestión de tareas y proyectos",
        "color": "#9C27B0"
    },
    {
        "name": "Creatividad App",
        "id": "creatividad_app",
        "desc": "Herramientas de diseño móvil",
        "color": "#E91E63"
    }
]

def create_app_structure(app):
    """Crear estructura básica de app"""
    app_dir = f"android_apps/{app['id']}"
    
    # Crear directorios básicos
    os.makedirs(f"{app_dir}/src/main/java/com/{app['id']}", exist_ok=True)
    os.makedirs(f"{app_dir}/src/main/res/layout", exist_ok=True)
    os.makedirs(f"{app_dir}/src/main/res/values", exist_ok=True)
    os.makedirs(f"{app_dir}/gradle", exist_ok=True)
    
    # 1. Crear build.gradle
    build_gradle = f'''plugins {{
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}}

android {{
    namespace 'com.{app["id"]}'
    compileSdk 34

    defaultConfig {{
        applicationId "com.{app["id"]}"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }}

    buildTypes {{
        release {{
            minifyEnabled false
        }}
    }}
}}

dependencies {{
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
}}'''
    
    with open(f"{app_dir}/build.gradle", 'w', encoding='utf-8') as f:
        f.write(build_gradle)
    
    # 2. Crear AndroidManifest.xml
    manifest = f'''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:icon="@mipmap/ic_launcher"
        android:label="{app["name"]}">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>'''
    
    with open(f"{app_dir}/src/main/AndroidManifest.xml", 'w', encoding='utf-8') as f:
        f.write(manifest)
    
    # 3. Crear MainActivity.kt
    main_activity = f'''package com.{app["id"]}

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.{app["id"]}.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {{
    
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {{
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Configurar UI
        setupUI()
    }}
    
    private fun setupUI() {{
        binding.appName.text = "{app["name"]}"
        binding.appDescription.text = "{app["desc"]}"
        binding.welcomeText.text = "Bienvenido a {app["name"]}"
        
        // Configurar botones según la app
        when ("{app["id"]}") {{
            "finanzas_pro" -> {{
                binding.button1.text = "Presupuestos"
                binding.button2.text = "Gastos"
                binding.button3.text = "Ahorros"
            }}
            "salud_diaria" -> {{
                binding.button1.text = "Ejercicios"
                binding.button2.text = "Dieta"
                binding.button3.text = "Sueño"
            }}
            "aprende_idiomas" -> {{
                binding.button1.text = "Lecciones"
                binding.button2.text = "Vocabulario"
                binding.button3.text = "Práctica"
            }}
            "productividad_pro" -> {{
                binding.button1.text = "Tareas"
                binding.button2.text = "Proyectos"
                binding.button3.text = "Equipo"
            }}
            "creatividad_app" -> {{
                binding.button1.text = "Dibujar"
                binding.button2.text = "Editar"
                binding.button3.text = "Compartir"
            }}
        }}
    }}
}}'''
    
    with open(f"{app_dir}/src/main/java/com/{app['id']}/MainActivity.kt", 'w', encoding='utf-8') as f:
        f.write(main_activity)
    
    # 4. Crear activity_main.xml
    activity_main = f'''<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@color/background">
    
    <TextView
        android:id="@+id/appName"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="24sp"
        android:textStyle="bold"
        android:textColor="{app["color"]}"
        android:layout_marginBottom="8dp"/>
    
    <TextView
        android:id="@+id/appDescription"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="16sp"
        android:layout_marginBottom="24dp"/>
    
    <TextView
        android:id="@+id/welcomeText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="20sp"
        android:layout_marginBottom="32dp"/>
    
    <Button
        android:id="@+id/button1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:backgroundTint="{app["color"]}"
        android:textColor="@android:color/white"/>
    
    <Button
        android:id="@+id/button2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:backgroundTint="{app["color"]}"
        android:textColor="@android:color/white"/>
    
    <Button
        android:id="@+id/button3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="32dp"
        android:backgroundTint="{app["color"]}"
        android:textColor="@android:color/white"/>
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="© 2024 {app["name"]}"
        android:textSize="12sp"
        android:layout_gravity="center"/>
    
</LinearLayout>'''
    
    with open(f"{app_dir}/src/main/res/layout/activity_main.xml", 'w', encoding='utf-8') as f:
        f.write(activity_main)
    
    # 5. Crear strings.xml
    strings = f'''<resources>
    <string name="app_name">{app["name"]}</string>
    <string name="app_description">{app["desc"]}</string>
</resources>'''
    
    with open(f"{app_dir}/src/main/res/values/strings.xml", 'w', encoding='utf-8') as f:
        f.write(strings)
    
    # 6. Crear colors.xml
    colors = f'''<resources>
    <color name="primary">{app["color"]}</color>
    <color name="background">#FAFAFA</color>
</resources>'''
    
    with open(f"{app_dir}/src/main/res/values/colors.xml", 'w', encoding='utf-8') as f:
        f.write(colors)
    
    # 7. Crear README.md
    readme = f'''# {app["name"]}

## Descripción
{app["desc"]}

## Estructura del Proyecto
- `src/main/java/com/{app["id"]}/` - Código fuente Kotlin
- `src/main/res/layout/` - Layouts XML
- `src/main/res/values/` - Recursos (strings, colors)
- `build.gradle` - Configuración de build

## Características Principales
1. Interfaz moderna y responsive
2. Diseño con Material Design
3. Arquitectura limpia y mantenible
4. Lista para desarrollo adicional

## Cómo Ejecutar
1. Abrir en Android Studio
2. Sincronizar proyecto con Gradle
3. Ejecutar en emulador o dispositivo físico

## Próximos Pasos
- Implementar lógica de negocio
- Agregar base de datos local
- Integrar APIs externas
- Publicar en Google Play Store

---
Generado automáticamente el {datetime.now().strftime("%Y-%m-%d %H:%M")}'''
    
    with open(f"{app_dir}/README.md", 'w', encoding='utf-8') as f:
        f.write(readme)
    
    # 8. Crear archivo de configuración
    config = {
        "app_name": app["name"],
        "package_name": f"com.{app['id']}",
        "description": app["desc"],
        "color_scheme": app["color"],
        "created_date": datetime.now().isoformat(),
        "min_sdk": 21,
        "target_sdk": 34,
        "files_created": [
            "build.gradle",
            "src/main/AndroidManifest.xml",
            "src/main/java/com/{app['id']}/MainActivity.kt",
            "src/main/res/layout/activity_main.xml",
            "src/main/res/values/strings.xml",
            "src/main/res/values/colors.xml",
            "README.md"
        ]
    }
    
    with open(f"{app_dir}/app_config.json", 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)
    
    return config

def main():
    """Crear las 5 apps Android"""
    print("Creando 5 aplicaciones Android...")
    print("="*60)
    
    os.makedirs("android_apps", exist_ok=True)
    
    results = []
    
    for i, app in enumerate(apps, 1):
        print(f"Creando app {i}/5: {app['name']}")
        config = create_app_structure(app)
        results.append(config)
    
    # Crear índice de proyectos
    print("\nCreando índice de proyectos Android...")
    
    index_html = '''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyectos Android Generados</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .app-card {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .app-card h3 {
            margin-top: 0;
            border-left: 4px solid;
            padding-left: 1rem;
        }
        .app-info {
            margin: 1rem 0;
        }
        .files-list {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
            font-family: monospace;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📱 Proyectos Android Generados</h1>
        <p>5 aplicaciones Android listas para desarrollo</p>
    </div>
    
    <div class="apps-grid">'''
    
    for app in results:
        index_html += f'''
        <div class="app-card">
            <h3 style="border-color: {app['color_scheme']}">{app['app_name']}</h3>
            <div class="app-info">
                <p><strong>Package:</strong> {app['package_name']}</p>
                <p><strong>Descripción:</strong> {app['description']}</p>
                <p><strong>SDK:</strong> Min {app['min_sdk']} | Target {app['target_sdk']}</p>
                <p><strong>Color:</strong> <span style="color:{app['color_scheme']}">● {app['color_scheme']}</span></p>
            </div>
            <div class="files-list">
                <strong>Archivos creados:</strong><br>
                {chr(10).join([f"• {file}" for file in app['files_created'][:3]])}<br>
                • ... y {len(app['files_created']) - 3} más
            </div>
        </div>'''
    
    index_html += '''
    </div>
    
    <div style="text-align:center; margin-top:3rem; padding:2rem; background:#333; color:white;">
        <p>Total: 5 aplicaciones Android generadas</p>
        <p>Estado: ✅ Estructuras básicas completas</p>
        <p>Próximo paso: Implementar lógica y funcionalidades</p>
    </div>
</body>
</html>'''
    
    with open("android_apps/index.html", 'w', encoding='utf-8') as f:
        f.write(index_html)
    
    print(f"\n✅ 5 aplicaciones Android creadas exitosamente!")
    print(f"📁 Directorio: android_apps/")
    print(f"📄 Índice: android_apps/index.html")
    
    # Resumen
    print("\n" + "="*60)
    print("RESUMEN DE APPS CREADAS:")
    print("="*60)
    for i, app in enumerate(results, 1):
        print(f"{i}. {app['app_name']} ({app['package_name']})")
    
    print("\n" + "="*60)
    print("¡FASE 3 COMPLETADA! Apps Android listas.")
    print("="*60)

if __name__ == "__main__":
    main()