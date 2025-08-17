# Vite React Amplify Template

# SmartStocker

Plataforma web para ayudar a restaurantes y locales gastronómicos en CABA a predecir ventas y optimizar su inventario.

## 🎨 Design System

### Filosofía de Diseño
SmartStocker transmite **profesionalismo, confianza y modernidad**. El diseño inspira seguridad en la toma de decisiones empresariales, con una estética limpia que facilita la lectura de datos y métricas importantes.

### 🎯 Paleta de Colores

#### Colores Principales
- **Azul Corporativo**: `#1E40AF` (Blue-700) - Headers, botones primarios, enlaces importantes
- **Azul Claro**: `#3B82F6` (Blue-500) - Hover states y elementos secundarios

#### Colores Secundarios
- **Verde Éxito**: `#10B981` (Emerald-500) - Indicadores positivos, ganancias, stock suficiente
- **Naranja Advertencia**: `#F59E0B` (Amber-500) - Alertas, stock bajo, atención requerida
- **Rojo Crítico**: `#EF4444` (Red-500) - Errores, stock agotado, pérdidas

#### Colores de Apoyo
- **Gris Oscuro**: `#1F2937` (Gray-800) - Textos principales
- **Gris Medio**: `#6B7280` (Gray-500) - Textos secundarios
- **Gris Claro**: `#F3F4F6` (Gray-100) - Fondos, separadores
- **Blanco**: `#FFFFFF` - Fondos de tarjetas, modales
- **Azul Muy Claro**: `#EFF6FF` (Blue-50) - Fondos sutiles, highlights

### 📝 Tipografías

#### Poppins (Títulos y Headers)
- **Pesos**: 400 (Regular), 600 (SemiBold), 700 (Bold)
- **Uso**: H1, H2, H3, nombres de secciones, botones importantes

#### Roboto (Texto Corrido)
- **Pesos**: 300 (Light), 400 (Regular), 500 (Medium)
- **Uso**: Párrafos, descripciones, labels, texto de tablas

#### Jerarquía Tipográfica
- **H1**: Poppins 700, 32px - Títulos principales de página
- **H2**: Poppins 600, 24px - Títulos de sección
- **H3**: Poppins 600, 20px - Subtítulos
- **Body Large**: Roboto 400, 16px - Texto principal
- **Body**: Roboto 400, 14px - Texto secundario
- **Caption**: Roboto 300, 12px - Texto auxiliar, fechas

### 🔘 Componentes Base

#### Botones
- **Primario**: Fondo azul corporativo, texto blanco, border-radius 8px
- **Secundario**: Borde azul, texto azul, fondo transparente
- **Terciario**: Solo texto azul, sin bordes
- **Tamaños**: Small (32px), Medium (40px), Large (48px)

#### Tarjetas (Cards)
- **Fondo**: Blanco con sombra sutil
- **Border-radius**: 12px
- **Padding**: 24px

### ✨ Animaciones y Microinteracciones

#### Navegación
- **Header**: Transición suave de transparente a blanco sólido al hacer scroll
- **Sidebar**: Slide-in/out con easing suave (300ms)

#### Botones y Enlaces
- **Hover**: Transición de color y sombra (200ms ease-out)
- **Click**: Ligera escala (transform: scale(0.98)) por 100ms

### 📐 Sistema de Espaciado
Múltiplos de 8px:
- **XS**: 4px - **SM**: 8px - **MD**: 16px - **LG**: 24px - **XL**: 32px - **XXL**: 48px

---

## 🚀 Desarrollo

## Pasos para usar

1. Instalar dependencias:
```bash
npm ci
```

2. Ejecutar localmente:
```bash
npm run dev
```

3. Conectar el repo en Amplify Console y desplegar.

4. (Opcional) Configurar variable `VITE_API_URL` en Amplify.
