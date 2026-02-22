#!/usr/bin/env python3
"""
CREAR 5 APPS MÁS PARA ANDROID
Aplicaciones modernas y funcionales
"""

import os
import json
import shutil
from datetime import datetime

def crear_app_1_finanzas_personales():
    """App 1: Gestor de Finanzas Personales"""
    print("Creando App 1: Gestor de Finanzas Personales...")
    
    app_dir = "apps/android/finanzas_personales"
    os.makedirs(app_dir, exist_ok=True)
    
    estructura = {
        "nombre": "MoneyFlow - Gestor Financiero",
        "paquete": "com.moneyflow.finanzas",
        "version": "1.0.0",
        "min_sdk": 21,
        "target_sdk": 34,
        "caracteristicas": [
            "Seguimiento de ingresos y gastos",
            "Presupuestos mensuales",
            "Gráficos y estadísticas",
            "Recordatorios de pagos",
            "Exportación a Excel/PDF",
            "Sincronización en la nube",
            "Modo oscuro",
            "Backup automático"
        ],
        "tecnologias": [
            "Kotlin",
            "Jetpack Compose",
            "Room Database",
            "Firebase Auth",
            "Firebase Firestore",
            "MPAndroidChart",
            "WorkManager",
            "Hilt DI"
        ],
        "pantallas": [
            "Login/Registro",
            "Dashboard principal",
            "Agregar transacción",
            "Lista de transacciones",
            "Estadísticas",
            "Presupuestos",
            "Configuración",
            "Perfil de usuario"
        ]
    }
    
    # Crear archivos principales
    archivos = {
        "build.gradle": """plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
    id 'dagger.hilt.android.plugin'
}

android {
    namespace 'com.moneyflow.finanzas'
    compileSdk 34

    defaultConfig {
        applicationId "com.moneyflow.finanzas"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary true
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
    buildFeatures {
        compose true
    }
    composeOptions {
        kotlinCompilerExtensionVersion '1.5.3'
    }
    packagingOptions {
        resources {
            excludes += '/META-INF/{AL2.0,LGPL2.1}'
        }
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
    implementation 'androidx.activity:activity-compose:1.8.0'
    implementation "androidx.compose.ui:ui:$compose_version"
    implementation "androidx.compose.ui:ui-tooling-preview:$compose_version"
    implementation 'androidx.compose.material3:material3:1.1.2'
    
    // Room Database
    implementation "androidx.room:room-runtime:2.6.0"
    implementation "androidx.room:room-ktx:2.6.0"
    kapt "androidx.room:room-compiler:2.6.0"
    
    // Hilt
    implementation "com.google.dagger:hilt-android:2.48"
    kapt "com.google.dagger:hilt-compiler:2.48"
    implementation 'androidx.hilt:hilt-navigation-compose:1.1.0'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.5.0')
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
    
    // Charts
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
    
    // WorkManager
    implementation "androidx.work:work-runtime-ktx:2.9.0"
    
    // Navigation
    implementation "androidx.navigation:navigation-compose:2.7.5"
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation "androidx.compose.ui:ui-test-junit4:$compose_version"
    debugImplementation "androidx.compose.ui:ui-tooling:$compose_version"
    debugImplementation "androidx.compose.ui:ui-test-manifest:$compose_version"
}""",
        
        "MainActivity.kt": """package com.moneyflow.finanzas

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.moneyflow.finanzas.navigation.AppNavigation
import com.moneyflow.finanzas.ui.theme.MoneyFlowTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MoneyFlowTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    AppNavigation(navController = navController)
                }
            }
        }
    }
}""",
        
        "README.md": """# MoneyFlow - Gestor de Finanzas Personales

Aplicación Android moderna para gestión de finanzas personales.

## Características

- 📊 Seguimiento de ingresos y gastos
- 💰 Presupuestos mensuales
- 📈 Gráficos y estadísticas
- 🔔 Recordatorios de pagos
- ☁️ Sincronización en la nube
- 🌙 Modo oscuro
- 📤 Exportación de datos

## Tecnologías

- Kotlin
- Jetpack Compose
- Room Database
- Firebase
- Hilt DI
- MPAndroidChart

## Estructura del Proyecto

```
finanzas_personales/
├── app/
│   ├── src/main/
│   │   ├── java/com/moneyflow/finanzas/
│   │   │   ├── data/
│   │   │   │   ├── database/
│   │   │   │   ├── repository/
│   │   │   │   └── model/
│   │   │   ├── domain/
│   │   │   │   ├── usecase/
│   │   │   │   └── model/
│   │   │   ├── presentation/
│   │   │   │   ├── screen/
│   │   │   │   ├── component/
│   │   │   │   └── viewmodel/
│   │   │   ├── navigation/
│   │   │   └── ui/theme/
│   │   └── res/
│   └── build.gradle
└── README.md
```

## Instalación

1. Clonar el repositorio
2. Abrir en Android Studio
3. Configurar Firebase
4. Ejecutar en dispositivo/emulador

## Configuración de Firebase

1. Crear proyecto en Firebase Console
2. Agregar aplicación Android
3. Descargar google-services.json
4. Colocar en app/

## Licencia

MIT License"""
    }
    
    for nombre, contenido in archivos.items():
        ruta = os.path.join(app_dir, nombre)
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    # Guardar estructura JSON
    with open(os.path.join(app_dir, "app_structure.json"), 'w', encoding='utf-8') as f:
        json.dump(estructura, f, indent=2, ensure_ascii=False)
    
    print(f"App 1 creada en: {app_dir}")
    return estructura

def crear_app_2_entrenamiento_fitness():
    """App 2: Entrenamiento y Fitness"""
    print("\nCreando App 2: FitTrack - Entrenamiento Personalizado...")
    
    app_dir = "apps/android/fittrack"
    os.makedirs(app_dir, exist_ok=True)
    
    estructura = {
        "nombre": "FitTrack - Tu Entrenador Personal",
        "paquete": "com.fittrack.workout",
        "version": "1.0.0",
        "min_sdk": 23,
        "target_sdk": 34,
        "caracteristicas": [
            "Rutinas de entrenamiento personalizadas",
            "Seguimiento de progreso",
            "Contador de calorías",
            "Planificación de dietas",
            "Integración con wearables",
            "Comunidad y retos",
            "Recordatorios de entrenamiento",
            "Estadísticas detalladas"
        ],
        "tecnologias": [
            "Kotlin",
            "Jetpack Compose",
            "Room Database",
            "Health Connect API",
            "CameraX",
            "ML Kit (pose detection)",
            "WorkManager",
            "Retrofit"
        ],
        "pantallas": [
            "Onboarding",
            "Dashboard",
            "Rutinas de entrenamiento",
            "Ejercicios con video",
            "Seguimiento de calorías",
            "Progreso y estadísticas",
            "Comunidad",
            "Perfil y configuración"
        ]
    }
    
    archivos = {
        "build.gradle": """plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
}

android {
    namespace 'com.fittrack.workout'
    compileSdk 34

    defaultConfig {
        applicationId "com.fittrack.workout"
        minSdk 23
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary true
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
    buildFeatures {
        compose true
        viewBinding true
    }
    composeOptions {
        kotlinCompilerExtensionVersion '1.5.3'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
    implementation 'androidx.activity:activity-compose:1.8.0'
    implementation "androidx.compose.ui:ui:$compose_version"
    implementation "androidx.compose.ui:ui-tooling-preview:$compose_version"
    implementation 'androidx.compose.material3:material3:1.1.2'
    
    // Navigation
    implementation "androidx.navigation:navigation-compose:2.7.5"
    
    // Room Database
    implementation "androidx.room:room-runtime:2.6.0"
    implementation "androidx.room:room-ktx:2.6.0"
    kapt "androidx.room:room-compiler:2.6.0"
    
    // Health Connect
    implementation "androidx.health.connect:connect-client:1.1.0"
    
    // CameraX
    implementation "androidx.camera:camera-camera2:1.3.0"
    implementation "androidx.camera:camera-lifecycle:1.3.0"
    implementation "androidx.camera:camera-view:1.3.0"
    
    // ML Kit
    implementation 'com.google.mlkit:pose-detection:18.0.0-beta3'
    
    // Retrofit
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    
    // Charts
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
    
    // WorkManager
    implementation "androidx.work:work-runtime-ktx:2.9.0"
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation "androidx.compose.ui:ui-test-junit4:$compose_version"
    debugImplementation "androidx.compose.ui:ui-tooling:$compose_version"
    debugImplementation "androidx.compose.ui:ui-test-manifest:$compose_version"
}""",
        
        "README.md": """# FitTrack - Entrenamiento Personalizado

Aplicación Android para entrenamiento físico y seguimiento de fitness.

## Características

- 🏋️‍♂️ Rutinas personalizadas
- 📊 Seguimiento de progreso
- 🔥 Contador de calorías
- 🥗 Planificación de dietas
- ⌚ Integración con wearables
- 👥 Comunidad y retos
- ⏰ Recordatorios
- 📈 Estadísticas avanzadas

## Tecnologías

- Kotlin
- Jetpack Compose
- Room Database
- Health Connect API
- CameraX
- ML Kit
- Retrofit

## Estructura

```
fittrack/
├── app/
│   ├── src/main/
│   │   ├── java/com/fittrack/workout/
│   │   │   ├── data/
│   │   │   │   ├── local/
│   │   │   │   ├── remote/
│   │   │   │   └── repository/
│   │   │   ├── domain/
│   │   │   │   ├── model/
│   │   │   │   └── usecase/
│   │   │   ├── presentation/
│   │   │   │   ├── screen/
│   │   │   │   │   ├── workout/
│   │   │   │   │   ├── nutrition/
│   │   │   │   │   ├── progress/
│   │   │   │   │   └── community/
│   │   │   │   ├── component/
│   │   │   │   └── viewmodel/
│   │   │   ├── feature/
│   │   │   │   ├── camera/
│   │   │   │   ├── pose/
│   │   │   │   └── health/
│   │   │   └── navigation/
│   │   └── res/
│   └── build.gradle
└── README.md
```

## Instalación

1. Clonar repositorio
2. Abrir en Android Studio
3. Configurar API keys
4. Ejecutar aplicación

## API Keys Necesarias

- Health Connect permissions
- Firebase (opcional)
- Nutrition API key

## Licencia

MIT License"""
    }
    
    for nombre, contenido in archivos.items():
        ruta = os.path.join(app_dir, nombre)
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    with open(os.path.join(app_dir, "app_structure.json"), 'w', encoding='utf-8') as f:
        json.dump(estructura, f, indent=2, ensure_ascii=False)
    
    print(f"App 2 creada en: {app_dir}")
    return estructura

def crear_app_3_aprendizaje_idiomas():
    """App 3: Aprendizaje de Idiomas"""
    print("\nCreando App 3: LinguaLearn - Aprende Idiomas...")
    
    app_dir = "apps/android/lingualearn"
    os.makedirs(app_dir, exist_ok=True)
    
    estructura = {
        "nombre": "LinguaLearn - Aprende Idiomas",
        "paquete": "com.lingualearn.languages",
        "version": "1.0.0",
        "min_sdk": 21,
        "target_sdk": 34,
        "caracteristicas": [
            "Cursos interactivos de idiomas",
            "Reconocimiento de voz para pronunciación",
            "Juegos de aprendizaje",
            "Chat con IA para práctica",
            "Flashcards inteligentes",
            "Seguimiento de progreso",
            "Modo offline",
            "Certificados de progreso"
        ],
        "tecnologias": [
            "Kotlin",
            "Jetpack Compose",
            "Room Database",
            "Speech Recognition API",
            "OpenAI API",
            "ExoPlayer (audio/video)",
            "WorkManager",
            "Firebase ML Kit