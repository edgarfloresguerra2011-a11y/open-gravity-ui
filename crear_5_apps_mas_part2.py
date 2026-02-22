#!/usr/bin/env python3
"""
CONTINUACIÓN - CREAR 5 APPS MÁS PARA ANDROID
"""

import os
import json

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
            "Firebase ML Kit"
        ],
        "pantallas": [
            "Selección de idioma",
            "Dashboard de aprendizaje",
            "Lecciones interactivas",
            "Práctica de pronunciación",
            "Juegos educativos",
            "Chat con IA",
            "Progreso y estadísticas",
            "Perfil y logros"
        ]
    }
    
    archivos = {
        "build.gradle": """plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
}

android {
    namespace 'com.lingualearn.languages'
    compileSdk 34

    defaultConfig {
        applicationId "com.lingualearn.languages"
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
    
    // Speech Recognition
    implementation 'androidx.speech:speech-recognition:1.0.0'
    
    // OpenAI API
    implementation 'com.aallam.openai:openai-client:3.5.0'
    
    // Audio/Video
    implementation 'com.google.android.exoplayer:exoplayer:2.19.1'
    
    // Firebase ML Kit
    implementation 'com.google.firebase:firebase-ml-natural-language:22.0.1'
    implementation 'com.google.firebase:firebase-ml-natural-language-translate-model:20.0.9'
    
    // WorkManager
    implementation "androidx.work:work-runtime-ktx:2.9.0"
    
    // Lottie Animations
    implementation 'com.airbnb.android:lottie-compose:6.1.0'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation "androidx.compose.ui:ui-test-junit4:$compose_version"
    debugImplementation "androidx.compose.ui:ui-tooling:$compose_version"
    debugImplementation "androidx.compose.ui:ui-test-manifest:$compose_version"
}""",
        
        "README.md": """# LinguaLearn - Aprende Idiomas

Aplicación Android para aprendizaje interactivo de idiomas.

## Características

- 🌍 Múltiples idiomas
- 🎤 Reconocimiento de voz
- 🎮 Juegos educativos
- 🤖 Chat con IA
- 📚 Flashcards inteligentes
- 📊 Seguimiento de progreso
- 📱 Modo offline
- 🏆 Certificados

## Idiomas Disponibles

- Inglés
- Español
- Francés
- Alemán
- Italiano
- Portugués
- Japonés
- Chino

## Tecnologías

- Kotlin + Jetpack Compose
- Room Database
- Speech Recognition API
- OpenAI API
- ExoPlayer
- Firebase ML Kit

## Estructura

```
lingualearn/
├── app/
│   ├── src/main/
│   │   ├── java/com/lingualearn/languages/
│   │   │   ├── data/
│   │   │   │   ├── local/
│   │   │   │   ├── remote/
│   │   │   │   └── repository/
│   │   │   ├── domain/
│   │   │   │   ├── model/
│   │   │   │   └── usecase/
│   │   │   ├── presentation/
│   │   │   │   ├── screen/
│   │   │   │   │   ├── lessons/
│   │   │   │   │   ├── practice/
│   │   │   │   │   ├── games/
│   │   │   │   │   └── chat/
│   │   │   │   ├── component/
│   │   │   │   └── viewmodel/
│   │   │   ├── feature/
│   │   │   │   ├── speech/
│   │   │   │   ├── translation/
│   │   │   │   └── ai/
│   │   │   └── navigation/
│   │   └── res/
│   └── build.gradle
└── README.md
```

## Configuración API

1. OpenAI API Key
2. Firebase Configuration
3. Speech Recognition permissions

## Licencia

MIT License"""
    }
    
    for nombre, contenido in archivos.items():
        ruta = os.path.join(app_dir, nombre)
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    with open(os.path.join(app_dir, "app_structure.json"), 'w', encoding='utf-8') as f:
        json.dump(estructura, f, indent=2, ensure_ascii=False)
    
    print(f"App 3 creada en: {app_dir}")
    return estructura

def crear_app_4_meditacion_sueno():
    """App 4: Meditación y Sueño"""
    print("\nCreando App 4: ZenSpace - Meditación y Sueño...")
    
    app_dir = "apps/android/zenspace"
    os.makedirs(app_dir, exist_ok=True)
    
    estructura = {
        "nombre": "ZenSpace - Meditación y Sueño",
        "paquete": "com.zenspace.meditation",
        "version": "1.0.0",
        "min_sdk": 21,
        "target_sdk": 34,
        "caracteristicas": [
            "Sesiones de meditación guiada",
            "Sonidos relajantes para dormir",
            "Seguimiento del sueño",
            "Respiración guiada",
            "Estadísticas de bienestar",
            "Recordatorios diarios",
            "Modo sin distracciones",
            "Integración con wearables"
        ],
        "tecnologias": [
            "Kotlin",
            "Jetpack Compose",
            "Room Database",
            "ExoPlayer (audio)",
            "Health Connect API",
            "WorkManager",
            "Firebase Analytics",
            "Lottie Animations"
        ],
        "pantallas": [
            "Onboarding de bienestar",
            "Dashboard principal",
            "Meditaciones guiadas",
            "Sonidos para dormir",
            "Seguimiento de sueño",
            "Ejercicios de respiración",
            "Estadísticas",
            "Configuración y perfil"
        ]
    }
    
    archivos = {
        "build.gradle": """plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
}

android {
    namespace 'com.zenspace.meditation'
    compileSdk 34

    defaultConfig {
        applicationId "com.zenspace.meditation"
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
    
    // Audio Player
    implementation 'com.google.android.exoplayer:exoplayer:2.19.1'
    
    // Health Connect
    implementation "androidx.health.connect:connect-client:1.1.0"
    
    // WorkManager
    implementation "androidx.work:work-runtime-ktx:2.9.0"
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.5.0')
    implementation 'com.google.firebase:firebase-analytics'
    
    // Lottie Animations
    implementation 'com.airbnb.android:lottie-compose:6.1.0'
    
    // Charts
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation "androidx.compose.ui:ui-test-junit4:$compose_version"
    debugImplementation "androidx.compose.ui:ui-tooling:$compose_version"
    debugImplementation "androidx.compose.ui:ui-test-manifest:$compose_version"
}""",
        
        "README.md": """# ZenSpace - Meditación y Sueño

Aplicación Android para meditación, relajación y seguimiento del sueño.

## Características

- 🧘‍♀️ Meditaciones guiadas
- 🌙 Sonidos para dormir
- 📊 Seguimiento de sueño
- 🌬️ Respiración guiada
- 📈 Estadísticas de bienestar
- ⏰ Recordatorios
- 🔕 Modo sin distracciones
- ⌚ Integración con wearables

## Contenido

### Meditaciones
- Mindfulness
- Reducción de estrés
- Enfoque y concentración
- Autocompasión
- Meditaciones cortas (5 min)

### Sonidos
- Lluvia
- Olas del mar
- Bosque
- Blanco/rosa/marrón
- Frecuencias binaurales

### Sueño
- Seguimiento de patrones
- Calidad del sueño
- Recomendaciones
- Rutinas pre-sueño

## Tecnologías

- Kotlin + Jetpack Compose
- Room Database
- ExoPlayer (audio)
- Health Connect API
- Firebase Analytics

## Estructura

```
zenspace/
├── app/
│   ├── src/main/
│   │   ├── java/com/zenspace/meditation/
│   │   │   ├── data/
│   │   │   │   ├── local/
│   │   │   │   ├── repository/
│   │   │   │   └── model/
│   │   │   ├── domain/
│   │   │   │   ├── model/
│   │   │   │   └── usecase/
│   │   │   ├── presentation/
│   │   │   │   ├── screen/
│   │   │   │   │   ├── meditation/
│   │   │   │   │   ├── sleep/
│   │   │   │   │   ├── breathing/
│   │   │   │   │   └── stats/
│   │   │   │   ├── component/
│   │   │   │   └── viewmodel/
│   │   │   ├── feature/
│   │   │   │   ├── audio/
│   │   │   │   ├── health/
│   │   │   │   └── notification/
│   │   │   └── navigation/
│   │   └── res/
│   └── build.gradle
└── README.md
```

## Permisos Necesarios

- Health Connect (sueño)
- Notificaciones
- Almacenamiento (audio offline)

## Licencia

MIT License"""
    }
    
    for nombre, contenido in archivos.items():
        ruta = os.path.join(app_dir, nombre)
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    with open(os.path.join(app_dir, "app_structure.json"), 'w', encoding='utf-8') as f:
        json.dump(estructura, f, indent=2, ensure_ascii=False)
    
    print(f"App 4 creada en: {app_dir}")
    return estructura

def crear_app_5_productividad_tareas():
    """App 5: Productividad y Gestión de Tareas"""
    print("\nCreando App 5: TaskFlow - Gestión de Productividad...")
    
    app_dir = "apps/android/taskflow"
    os.makedirs(app_dir, exist_ok=True)
    
    estructura = {
        "nombre": "TaskFlow - Gestión de Productividad",
        "paquete": "com.taskflow.productivity",
        "version": "1.0.0",
        "min_sdk": 21,
        "target_sdk": 34,
        "caracteristicas": [
            "Gestión de tareas con Kanban",
            "Pomodoro timer integrado",
            "Sincronización multiplataforma",
            "Recordatorios inteligentes",
            "Estadísticas de productividad",
            "Colaboración en equipo",
            "Integración con calendario",
            "Modo enfoque"
        ],
        "tecnologias": [
            "Kotlin",
            "Jetpack Compose",
            "Room Database",
            "Firebase Firestore",
            "WorkManager",
            "Calendar API",
            "Retrofit",
            "Hilt DI"
        ],
        "pantallas": [
            "Dashboard de productividad",
            "Tablero Kanban",
            "Timer Pomodoro",
            "Calendario de tareas",
            "Estadísticas y reportes",
            "Colaboración en equipo",
            "Configuración",
            "Perfil de usuario"
        ]
    }
    
    archivos = {
        "build.gradle": """plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
    id 'dagger.hilt.android.plugin'
}

android {
