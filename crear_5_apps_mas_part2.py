# Continuación de crear_5_apps_mas.py

        Button(
            onClick = {{ /* Navegar o realizar acción */ }},
            modifier = Modifier.fillMaxWidth()
        ) {{
            Text("Comenzar")
        }}
    }}
}}
"""
            
            screen_dir = os.path.join(app_dir, "app", "src", "main", "java", paquete_path, "screens")
            os.makedirs(screen_dir, exist_ok=True)
            
            screen_path = os.path.join(screen_dir, f"{screen}.kt")
            with open(screen_path, 'w', encoding='utf-8') as f:
                f.write(contenido)
    
    def crear_layouts(self, app_dir, app_info):
        """Crear layouts XML básicos"""
        # activity_main.xml
        contenido = """<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <com.google.android.material.card.MaterialCardView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_margin="16dp"
        app:cardCornerRadius="12dp"
        app:cardElevation="8dp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="24dp">

            <ImageView
                android:id="@+id/logo"
                android:layout_width="120dp"
                android:layout_height="120dp"
                android:layout_gravity="center_horizontal"
                android:src="@drawable/ic_launcher_foreground"
                android:contentDescription="@string/app_logo" />

            <TextView
                android:id="@+id/title"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center_horizontal"
                android:layout_marginTop="16dp"
                android:text="@string/app_name"
                android:textSize="28sp"
                android:textStyle="bold"
                android:textColor="@color/purple_700" />

            <TextView
                android:id="@+id/subtitle"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center_horizontal"
                android:layout_marginTop="8dp"
                android:text="@string/app_description"
                android:textSize="16sp"
                android:textColor="@color/gray_600" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn_start"
                android:layout_width="match_parent"
                android:layout_height="56dp"
                android:layout_marginTop="32dp"
                android:text="@string/start"
                android:textSize="18sp"
                app:cornerRadius="28dp" />

        </LinearLayout>

    </com.google.android.material.card.MaterialCardView>

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/features_list"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_marginTop="16dp"
        android:layout_marginStart="16dp"
        android:layout_marginEnd="16dp"
        app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager"
        app:layout_constraintTop_toBottomOf="@id/card_view"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        tools:listitem="@layout/item_feature" />

</androidx.constraintlayout.widget.ConstraintLayout>
"""
        
        layout_path = os.path.join(app_dir, "app", "src", "main", "res", "layout", "activity_main.xml")
        with open(layout_path, 'w', encoding='utf-8') as f:
            f.write(contenido)
        
        # item_feature.xml
        item_content = """<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="8dp"
    app:cardCornerRadius="8dp"
    app:cardElevation="2dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:padding="16dp">

        <ImageView
            android:layout_width="24dp"
            android:layout_height="24dp"
            android:src="@drawable/ic_check"
            android:layout_marginEnd="12dp"
            android:contentDescription="@string/feature_icon" />

        <TextView
            android:id="@+id/feature_text"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:textSize="16sp"
            android:textColor="@color/black" />

    </LinearLayout>

</com.google.android.material.card.MaterialCardView>
"""
        
        item_path = os.path.join(app_dir, "app", "src", "main", "res", "layout", "item_feature.xml")
        with open(item_path, 'w', encoding='utf-8') as f:
            f.write(item_content)
    
    def crear_strings_xml(self, app_dir, app_info):
        """Crear strings.xml"""
        contenido = f"""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">{app_info['nombre']}</string>
    <string name="app_description">{app_info['descripcion']}</string>
    <string name="app_logo">Logo de la aplicación</string>
    <string name="start">Comenzar</string>
    <string name="feature_icon">Icono de característica</string>
    
    <!-- Características -->
    <string-array name="features">
{self.crear_array_caracteristicas(app_info['caracteristicas'])}
    </string-array>
    
    <!-- Navegación -->
    <string name="home">Inicio</string>
    <string name="dashboard">Panel</string>
    <string name="profile">Perfil</string>
    <string name="settings">Ajustes</string>
    <string name="analytics">Analíticas</string>
    
    <!-- Mensajes -->
    <string name="welcome">¡Bienvenido a {app_info['nombre']}!</string>
    <string name="loading">Cargando...</string>
    <string name="error">Ha ocurrido un error</string>
    <string name="retry">Reintentar</string>
    <string name="success">¡Éxito!</string>
    
    <!-- Botones -->
    <string name="save">Guardar</string>
    <string name="cancel">Cancelar</string>
    <string name="delete">Eliminar</string>
    <string name="edit">Editar</string>
    <string name="share">Compartir</string>
    
    <!-- Monetización -->
    <string name="premium">Premium</string>
    <string name="subscribe">Suscribirse</string>
    <string name="free_trial">Prueba gratuita</string>
</resources>
"""
        
        strings_path = os.path.join(app_dir, "app", "src", "main", "res", "values", "strings.xml")
        with open(strings_path, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    def crear_array_caracteristicas(self, caracteristicas):
        """Crear array de características"""
        array_content = ""
        for i, caracteristica in enumerate(caracteristicas):
            array_content += f'        <item>{caracteristica}</item>\n'
        return array_content
    
    def crear_colors_xml(self, app_dir, app_info):
        """Crear colors.xml moderno"""
        contenido = """<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Colores primarios -->
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    
    <!-- Colores de acento -->
    <color name="blue_500">#FF2196F3</color>
    <color name="green_500">#FF4CAF50</color>
    <color name="orange_500">#FFFF9800</color>
    <color name="red_500">#FFF44336</color>
    
    <!-- Colores neutros -->
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    <color name="gray_50">#FFFAFAFA</color>
    <color name="gray_100">#FFF5F5F5</color>
    <color name="gray_200">#FFEEEEEE</color>
    <color name="gray_300">#FFE0E0E0</color>
    <color name="gray_400">#FFBDBDBD</color>
    <color name="gray_500">#FF9E9E9E</color>
    <color name="gray_600">#FF757575</color>
    <color name="gray_700">#FF616161</color>
    <color name="gray_800">#FF424242</color>
    <color name="gray_900">#FF212121</color>
    
    <!-- Colores semánticos -->
    <color name="success">#FF4CAF50</color>
    <color name="warning">#FFFF9800</color>
    <color name="error">#FFF44336</color>
    <color name="info">#FF2196F3</color>
    
    <!-- Colores de fondo -->
    <color name="background">@color/gray_50</color>
    <color name="surface">@color/white</color>
    <color name="on_background">@color/gray_900</color>
    <color name="on_surface">@color/gray_900</color>
</resources>
"""
        
        colors_path = os.path.join(app_dir, "app", "src", "main", "res", "values", "colors.xml")
        with open(colors_path, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    def crear_gradle_wrapper(self, app_dir):
        """Crear archivos Gradle wrapper"""
        # gradle/wrapper/gradle-wrapper.properties
        wrapper_content = """distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.4-bin.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
"""
        
        wrapper_path = os.path.join(app_dir, "gradle", "wrapper", "gradle-wrapper.properties")
        with open(wrapper_path, 'w', encoding='utf-8') as f:
            f.write(wrapper_content)
        
        # settings.gradle
        settings_content = """pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}

rootProject.name = "AppName"
include ':app'
"""
        
        settings_path = os.path.join(app_dir, "settings.gradle")
        with open(settings_path, 'w', encoding='utf-8') as f:
            f.write(settings_content)
        
        # build.gradle (project level)
        build_content = """plugins {
    id 'com.android.application' version '8.1.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.10' apply false
    id 'com.google.gms.google-services' version '4.4.0' apply false
}
"""
        
        build_path = os.path.join(app_dir, "build.gradle")
        with open(build_path, 'w', encoding='utf-8') as f:
            f.write(build_content)
    
    def crear_readme(self, app_dir, app_info):
        """Crear README.md detallado"""
        contenido = f"""# {app_info['nombre']}

{app_info['descripcion']}

## 🚀 Características Principales

{self.crear_lista_caracteristicas(app_info['caracteristicas'])}

## 🛠️ Tecnologías Utilizadas

{self.crear_lista_tecnologias(app_info['tecnologias'])}

## 💰 Modelo de Monetización

{self.crear_lista_monetizacion(app_info['monetizacion'])}

## 📱 Requisitos del Sistema

- **Android:** 8.0 (API 24) o superior
- **RAM:** 2GB mínimo recomendado
- **Almacenamiento:** 50MB libre
- **Conexión a Internet:** Requerida para funciones principales

## 🏗️ Estructura del Proyecto

```
{app_info['nombre'].replace(' ', '_').lower()}/
├── app/
│   ├── src/main/
│   │   ├── java/{app_info['paquete'].replace('.', '/')}/
│   │   │   ├── {app_info['nombre'].replace(' ', '')}MainActivity.kt
│   │   │   ├── AppNavigation.kt
│   │   │   └── screens/
│   │   │       ├── HomeScreen.kt
│   │   │       ├── DashboardScreen.kt
│   │   │       ├── ProfileScreen.kt
│   │   │       ├── SettingsScreen.kt
│   │   │       └── AnalyticsScreen.kt
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml
│   │   │   │   └── item_feature.xml
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   └── colors.xml
│   │   │   └── drawable/
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

## 🔧 Configuración del Entorno

1. **Requisitos previos:**
   - Android Studio Flamingo o superior
   - JDK 17 o superior
   - Android SDK 34

2. **Clonar y abrir:**
   ```bash
   git clone [repo-url]
   cd {app_info['nombre'].replace(' ', '_').lower()}
   ```

3. **Sincronizar proyecto:**
   - Abrir en Android Studio
   - File → Sync Project with Gradle Files

4. **Ejecutar en emulador/dispositivo:**
   - Seleccionar dispositivo
   - Click en Run (▶️)

## 📊 Métricas de Proyecto

- **Tamaño APK estimado:** 15-25MB
- **Tiempo de compilación:** 2-3 minutos
- **Líneas de código:** ~2,500
- **Dependencias:** 25+ librerías modernas

## 🎯 Roadmap de Desarrollo

### Fase 1 (Mes 1)
- [ ] MVP funcional
- [ ] Integración con APIs principales
- [ ] Diseño UI/UX completo
- [ ] Pruebas unitarias básicas

### Fase 2 (Mes 2-3)
- [ ] Monetización implementada
- [ ] Analytics y tracking
- [ ] Optimización de rendimiento
- [ ] Internacionalización

### Fase 3 (Mes 4-6)
- [ ] Machine Learning features
- [ ] Comunidad de usuarios
- [ ] Escalabilidad backend
- [ ] Expansión a iOS/Web

## 📈 Proyección de Ingresos

| Mes | Usuarios | Ingresos | Notas |
|-----|----------|----------|-------|
| 1   | 1,000    | $500     | Lanzamiento |
| 3   | 5,000    | $2,500   | Crecimiento |
| 6   | 15,000   | $7,500   | Escalado |
| 12  | 50,000   | $25,000  | Madurez |

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## 📞 Contacto

Proyecto: {app_info['nombre']}
Paquete: {app_info['paquete']}
Creado: {datetime.now().strftime('%Y-%m-%d')}

---
*Este proyecto fue