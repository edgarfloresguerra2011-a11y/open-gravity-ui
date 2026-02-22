#!/usr/bin/env python3
"""
Creación de 5 Aplicaciones Android - Estructuras Básicas
"""

import os
import json
from datetime import datetime

# Definir las 5 apps Android
android_apps = [
    {
        "name": "Finanzas Personales Pro",
        "package": "com.finanzaspro.app",
        "description": "App de gestión financiera personal con presupuestos y seguimiento",
        "features": ["Presupuestos", "Gastos", "Ahorros", "Inversiones", "Reportes"],
        "min_sdk": 21,
        "target_sdk": 34
    },
    {
        "name": "Salud y Bienestar Diario",
        "package": "com.saludbienestar.daily",
        "description": "Seguimiento de salud, ejercicio, alimentación y mindfulness",
        "features": ["Ejercicios", "Dieta", "Meditación", "Sueño", "Métricas"],
        "min_sdk": 23,
        "target_sdk": 34
    },
    {
        "name": "Aprendizaje de Idiomas AI",
        "package": "com.idiomas.ai.learn",
        "description": "Aprende idiomas con IA y reconocimiento de voz",
        "features": ["Lecciones", "Pronunciación", "Vocabulario", "Gramática", "Chatbot IA"],
        "min_sdk": 24,
        "target_sdk": 34
    },
    {
        "name": "Productividad Empresarial",
        "package": "com.productividad.empresa",
        "description": "Gestión de tareas, proyectos y equipo para empresas",
        "features": ["Tareas", "Proyectos", "Equipo", "Chat", "Documentos"],
        "min_sdk": 21,
        "target_sdk": 34
    },
    {
        "name": "Creatividad y Diseño",
        "package": "com.creatividad.design",
        "description": "Herramientas de diseño y creatividad móvil",
        "features": ["Dibujo", "Edición", "Plantillas", "Exportar", "Compartir"],
        "min_sdk": 24,
        "target_sdk": 34
    }
]

def create_app_structure(app, index):
    """Crear estructura básica de app Android"""
    app_slug = app["name"].lower().replace(" ", "_").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
    app_dir = f"android_apps/{app_slug}"
    
    print(f"Creando app {index}/5: {app['name']}")
    
    # Crear directorios principales
    directories = [
        f"{app_dir}/app/src/main/java/{app['package'].replace('.', '/')}",
        f"{app_dir}/app/src/main/res/layout",
        f"{app_dir}/app/src/main/res/values",
        f"{app_dir}/app/src/main/res/drawable",
        f"{app_dir}/app/src/main/res/mipmap-hdpi",
        f"{app_dir}/app/src/main/res/mipmap-mdpi",
        f"{app_dir}/app/src/main/res/mipmap-xhdpi",
        f"{app_dir}/app/src/main/res/mipmap-xxhdpi",
        f"{app_dir}/app/src/main/res/mipmap-xxxhdpi",
        f"{app_dir}/gradle",
        f"{app_dir}/build"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    
    # 1. Crear build.gradle (app level)
    build_gradle = f'''plugins {{
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}}

android {{
    namespace '{app["package"]}'
    compileSdk {app["target_sdk"]}

    defaultConfig {{
        applicationId "{app["package"]}"
        minSdk {app["min_sdk"]}
        targetSdk {app["target_sdk"]}
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }}

    buildTypes {{
        release {{
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }}
    }}
    compileOptions {{
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }}
    kotlinOptions {{
        jvmTarget = '11'
    }}
    buildFeatures {{
        viewBinding true
    }}
}}

dependencies {{
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.navigation:navigation-fragment-ktx:2.7.6'
    implementation 'androidx.navigation:navigation-ui-ktx:2.7.6'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    
    // Dependencias adicionales según características
    {'implementation "androidx.room:room-runtime:2.6.1"' if 'Reportes' in app['features'] or 'Métricas' in app['features'] else ''}
    {'implementation "com.github.bumptech.glide:glide:4.16.0"' if 'Dibujo' in app['features'] or 'Edición' in app['features'] else ''}
    {'implementation "com.squareup.retrofit2:retrofit:2.9.0"' if 'Chatbot IA' in app['features'] or any(x in app['features'] for x in ['Chat', 'Compartir']) else ''}
}}'''
    
    with open(f"{app_dir}/app/build.gradle", 'w', encoding='utf-8') as f:
        f.write(build_gradle)
    
    # 2. Crear AndroidManifest.xml
    manifest = f'''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    {'<uses-permission android:name="android.permission.RECORD_AUDIO" />' if 'Pronunciación' in app['features'] else ''}
    {'<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />' if any(x in app['features'] for x in ['Exportar', 'Dibujo', 'Edición']) else ''}
    
    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.{app_slug.capitalize()}"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.{app_slug.capitalize()}.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        {'<activity android:name=".DrawingActivity" android:exported="false" />' if 'Dibujo' in app['features'] else ''}
        {'<activity android:name=".ChatActivity" android:exported="false" />' if 'Chat' in app['features'] or 'Chatbot IA' in app['features'] else ''}
        {'<activity android:name=".ReportActivity" android:exported="false" />' if 'Reportes' in app['features'] or 'Métricas' in app['features'] else ''}
        
    </application>

</manifest>'''
    
    with open(f"{app_dir}/app/src/main/AndroidManifest.xml", 'w', encoding='utf-8') as f:
        f.write(manifest)
    
    # 3. Crear MainActivity.kt
    package_path = app["package"].replace('.', '/')
    main_activity = f'''package {app["package"]}

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import android.view.Menu
import android.view.MenuItem
import {app["package"]}.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {{

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {{
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val navController = findNavController(R.id.nav_host_fragment_content_main)
        appBarConfiguration = AppBarConfiguration(navController.graph)
        setupActionBarWithNavController(navController, appBarConfiguration)

        // Inicialización de la app
        initApp()
    }}

    private fun initApp() {{
        // TODO: Inicializar componentes de {app["name"]}
        // Características: {', '.join(app["features"])}
        
        binding.fab.setOnClickListener {{ view ->
            // Acción principal del FAB
            when {{
                {'"Dibujo" in app["features"]' if 'Dibujo' in app["features"] else 'false'} -> {{
                    // Abrir actividad de dibujo
                }}
                {'"Chat" in app["features"]' if 'Chat' in app["features"] else 'false'} -> {{
                    // Abrir chat
                }}
                else -> {{
                    // Acción por defecto
                }}
            }}
        }}
    }}

    override fun onCreateOptionsMenu(menu: Menu): Boolean {{
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }}

    override fun onOptionsItemSelected(item: MenuItem): Boolean {{
        // Handle action bar item clicks here.
        return when (item.itemId) {{
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }}
    }}

    override fun onSupportNavigateUp(): Boolean {{
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration)
                || super.onSupportNavigateUp()
    }}
}}'''
    
    with open(f"{app_dir}/app/src/main/java/{package_path}/MainActivity.kt", 'w', encoding='utf-8') as f:
        f.write(main_activity)
    
    # 4. Crear activity_main.xml (layout)
    activity_main = f'''<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="{app["package"]}.MainActivity">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:theme="@style/Theme.{app_slug.capitalize()}.AppBarOverlay">

        <androidx.appcompat.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="?attr/colorPrimary"
            app:popupTheme="@style/Theme.{app_slug.capitalize()}.PopupOverlay" />

    </com.google.android.material.appbar.AppBarLayout>

    <include layout="@layout/content_main" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="@dimen/fab_margin"
        app:srcCompat="@android:drawable/ic_dialog_email" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>'''
    
    with open(f"{app_dir}/app/src/main/res/layout/activity_main.xml", 'w', encoding='utf-8') as f:
        f.write(activity_main)
    
    # 5. Crear strings.xml
    strings = f'''<resources>
    <string name="app_name">{app["name"]}</string>
    <string name="action_settings">Configuración</string>
    <string name="app_description">{app["description"]}</string>
    
    <!-- Características -->
    {'<string name="feature_budgets">Presupuestos</string>' if 'Presupuestos' in app['features'] else ''}
    {'<string name="feature_expenses">Gastos</string>' if 'Gastos' in app['features'] else ''}
    {'<string name="feature_savings">Ahorros</string>' if 'Ahorros' in app['features'] else ''}
    {'<string name="feature_exercises">Ejercicios</string>' if 'Ejercicios' in app['features'] else ''}
    {'<string name="feature_meditation">Meditación</string>' if 'Meditación' in app['features'] else ''}
    {'<string name="feature_lessons">Lecciones</string>' if 'Lecciones' in app['features'] else ''}
    {'<string name="feature_pronunciation">Pronunciación</string>' if 'Pronunciación' in app['features'] else ''}
    {'<string name="feature_tasks">Tareas</string>' if 'Tareas' in app['features'] else ''}
    {'<string name="feature_projects">Proyectos</string>' if 'Proyectos' in app['features'] else ''}
    {'<string name="feature_drawing">Dibujo</string>' if 'Dibujo' in app['features'] else ''}
    {'<string name="feature_editing">Edición</string>' if 'Edición' in app['features'] else ''}
    
    <!-- Mensajes comunes -->
    <string name="welcome_message">Bienvenido a {app["name"]}</string>
    <string name="loading">Cargando...</string>
    <string name="error_generic">Ha ocurrido un error</string>
    <string name="success">¡Éxito!</string>
</resources>'''
    
    with open(f"{app_dir}/app/src/main/res/values/strings.xml", 'w', encoding='utf-8') as f:
        f.write(strings)
    
    # 6. Crear colors.xml
    colors = '''<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    
    <!-- Colores de la app -->
    <color name="primary">#3F51B5</color>
    <color name="primary_dark">#303F9F</color>
    <color name="accent">#FF4081</color>
    <color name="background">#FAFAFA</color>
    <color name="surface">#FFFFFF</color>
    <color name="text_primary">#212121</color>
    <color name="text_secondary">#757575</color>
    <color name="error">#F44336</color>
    <color name="success">#4CAF50</color>
</resources>'''
    
    with open(f"{app_dir}/app/src/main/res/values/colors.xml", 'w', encoding='utf-8') as f:
        f.write(colors)
    
    # 7. Crear archivo README.md para la app
    readme = f'''# {app["name"]}

## Descripción
{app["description"]}

## Características
{chr(10).join([f"- {feature}" for feature in app["features"]])}

## Especificaciones Técnicas
- **Package Name:** {app["package"]}
- **Min SDK:** {app["min_sdk"]} (Android {{
    "21": "5.0 Lollipop",
    "23": "