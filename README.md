# Vite React Amplify Template

# SmartStocker

Plataforma web para ayudar a restaurantes y locales gastronómicos en CABA a predecir ventas y optimizar su inventario.

## 🔐 Módulo de Autenticación

Sistema completo de autenticación SPA (Single Page Application) con navegación sin recargas de página, implementado con React Router v6 y estado global persistente.

### **Funcionalidades**
- ✅ **Registro de usuarios** con validación completa
- ✅ **Inicio de sesión** con credenciales
- ✅ **Recuperación de contraseña** con flujo mock
- ✅ **Gestión de sesión** con localStorage
- ✅ **Navegación SPA** sin recargas de página
- ✅ **Rutas protegidas** y públicas
- ✅ **Validación de formularios** con Zod + React Hook Form
- ✅ **Mensajes de feedback** (éxito/error) accesibles
- ✅ **Rehidratación de sesión** automática al recargar
- ✅ **Redirecciones inteligentes** según estado de autenticación
- ✅ **Iconos modernos** con lucide-react

### **Librerías Agregadas**
- `react-hook-form` - Gestión eficiente de formularios
- `zod` - Validación de esquemas TypeScript-first
- `@hookform/resolvers` - Integración Zod + React Hook Form
- `classnames` - Utilidad para clases CSS condicionales
- `lucide-react` - Iconografía moderna y liviana
- `react-router-dom` - Navegación SPA y gestión de rutas

### **Rutas de Autenticación**
- `/login` - Iniciar sesión
- `/registro` - Crear cuenta nueva
- `/recuperar` - Recuperar contraseña olvidada
- `/dashboard` - Página principal (requiere autenticación)

### **Navegación SPA**
La aplicación utiliza **React Router v6** para navegación instantánea sin recargas de página:
- **BrowserRouter** configurado en `src/main.jsx`
- **AuthProvider** envuelve toda la aplicación para gestión de estado
- **Link/NavLink** y **useNavigate** en lugar de `<a href>` para navegación interna
- **useNavigate** para redirecciones programáticas
- **Rutas protegidas** que redirigen a login si no hay autenticación
- **Rutas públicas** que redirigen a dashboard si ya está autenticado
- **`<base href="/" />`** en index.html para compatibilidad con BrowserRouter
- **Estados de loading** durante verificación de autenticación

### **Arquitectura Implementada**
```
src/
├── main.jsx                     # Punto de entrada con BrowserRouter y AuthProvider
├── contexts/
│   └── AuthContext.jsx          # Contexto global de autenticación
├── services/
│   └── auth.mock.js            # Servicio mock con localStorage
├── routes/
│   └── AppRoutes.jsx           # Configuración de rutas y protección
├── pages/auth/
│   ├── Login.jsx + .module.css # Página de inicio de sesión
│   ├── Register.jsx + .module.css # Página de registro
│   └── Recover.jsx + .module.css # Página de recuperación
├── components/forms/
│   ├── TextField.jsx + .module.css # Input con validación
│   └── PasswordField.jsx + .module.css # Input de contraseña con toggle
├── components/feedback/
    ├── SuccessMessage.jsx + .module.css # Mensajes de éxito
    └── ErrorMessage.jsx + .module.css # Mensajes de error
└── components/icons/
    ├── Icon.jsx                # Wrapper para iconos de lucide-react
    └── [Icono]Icon.jsx        # Componentes de compatibilidad
```

### **Rehidratación de Sesión**
El sistema mantiene la sesión del usuario entre recargas:
1. **AuthContext** lee `localStorage('auth')` al inicializar
2. Si existe una sesión válida, rehidrata el estado del usuario
3. Las rutas protegidas verifican automáticamente la autenticación
4. El header muestra información del usuario o botón de login según el estado

### **Sistema de Rutas Protegidas**
- **RutaProtegida**: Componente que verifica autenticación antes de mostrar contenido
- **RutaPublica**: Redirige a dashboard si el usuario ya está autenticado
- **Estados de loading**: Evita parpadeos durante verificación de sesión
- **Redirecciones automáticas**: Login exitoso → dashboard, logout → landing

### **Configuración Técnica**
- **`<base href="/" />`** en `index.html` para compatibilidad con BrowserRouter
- **Providers en orden correcto**: BrowserRouter → AuthProvider → App
- **Variables con nombres descriptivos** (ej: `manejarEnvioFormularioLogin`, `estaEnviando`)
- **Comentarios explicativos** en funciones y bloques importantes
- **Navegación programática** con `useNavigate` en lugar de enlaces directos
- **Estados de loading** y feedback visual durante operaciones

### **Validaciones Implementadas**
- **Email**: Formato válido requerido
- **Contraseña**: Mínimo 6 caracteres, al menos 1 letra y 1 número
- **Nombre**: 2-60 caracteres, solo letras y espacios
- **Confirmación**: Las contraseñas deben coincidir

### **Servicio de Autenticación Mock**
El sistema utiliza `localStorage` para simular un backend completo:
- **Registro**: Verifica emails únicos, guarda usuarios en `localStorage('smartstocker_users')`
- **Login**: Valida credenciales y crea sesión en `localStorage('smartstocker_auth')`
- **Logout**: Limpia sesión del localStorage
- **Recuperación**: Simula envío de email con mensaje genérico de seguridad
- **Rehidratación**: Restaura sesión automáticamente al recargar la aplicación

### **Accesibilidad**
- ✅ Navegación por teclado completa
- ✅ Labels asociados con `htmlFor`
- ✅ Estados `aria-invalid` y `aria-describedby`
- ✅ Mensajes con `aria-live` para screen readers
- ✅ Focus visible en todos los elementos interactivos
- ✅ Navegación semántica con `<main>`, `<header>`, `<nav>`

### **Buenas Prácticas Implementadas**
- ✅ **Nombres descriptivos**: `manejarEnvioFormularioLogin` vs `onSubmit`
- ✅ **Comentarios claros**: Explicaciones breves sobre qué hace cada función
- ✅ **Navegación SPA**: Link/NavLink/useNavigate en lugar de `<a href>`
- ✅ **Estado centralizado**: AuthContext para toda la aplicación
- ✅ **Validación robusta**: Zod + react-hook-form
- ✅ **Código modular**: Componentes pequeños y reutilizables
- ✅ **Imports organizados**: React/librerías primero, componentes internos después
- ✅ **Manejo de errores**: Estados de loading y mensajes de feedback claros

## 🎨 Migración de Iconos

### **Lucide React Integration**
Los iconos han sido migrados de SVG manuales a **lucide-react** para mayor consistencia:

- ✅ **Wrapper unificado**: Componente `<Icon name="..." />` para nuevos iconos
- ✅ **Compatibilidad**: Componentes existentes (`BrainIcon`, `ChartIcon`, etc.) mantienen su API
- ✅ **Fallback robusto**: `HelpCircle` automático si un icono no existe
- ✅ **Props consistentes**: `size`, `color`, `strokeWidth` funcionan igual que antes
- ✅ **Tree-shaking**: Solo se incluyen los iconos utilizados en el bundle

### **Iconos Disponibles**
- `brain` → Inteligencia artificial y predicciones
- `chart` → Gráficos y análisis
- `clock` → Tiempo y horarios
- `inventory` → Gestión de inventario
- `shield` → Seguridad y protección
- `trending-up` → Crecimiento y tendencias

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

## 📱 Especificación de Pantallas y Componentes

### 🟦 **Landing Page**
**Propósito**: Presentar SmartStocker y convertir visitantes en usuarios registrados

**Elementos principales**:
- Hero section con descripción del producto
- Sección de beneficios clave para restaurantes
- Testimonios o casos de éxito
- Call-to-action principal "Iniciar sesión"
- Footer con información de contacto

**Componentes React**:
```jsx
<LandingPage>
  <Header />
  <HeroSection />
  <BeneficiosSection />
  <TestimoniosSection />
  <CTASection />
  <Footer />
</LandingPage>
```

---

### 🟧 **Inicio de Sesión**
**Propósito**: Autenticar usuarios existentes en la plataforma

**Elementos principales**:
- Formulario con campos email y contraseña
- Botón "Iniciar sesión"
- Enlace "¿Olvidaste tu contraseña?"
- Enlace "Crear cuenta nueva"
- Validaciones en tiempo real
- Mensajes de error claros

**Componentes React**:
```jsx
<Login>
  <FormularioLogin>
    <Input type="email" />
    <Input type="password" />
    <Button variant="primary" />
    <ErrorMessage />
  </FormularioLogin>
</Login>
```

---

### 🟩 **Dashboard**
**Propósito**: Vista principal con métricas y resumen de rendimiento del restaurante

**Elementos principales**:
- Gráfico de ventas de las últimas 4 semanas
- Tarjetas con métricas clave (ventas totales, plato más vendido, tendencia)
- Accesos rápidos a funciones principales
- Alertas de stock bajo o recomendaciones

**Componentes React**:
```jsx
<Dashboard>
  <Layout>
    <Header />
    <Sidebar />
    <main>
      <MetricasResumen>
        <Card title="Ventas Totales" />
        <Card title="Plato Más Vendido" />
        <Card title="Tendencia Semanal" />
      </MetricasResumen>
      <GraficoVentas periodo="4semanas" />
      <AccesosRapidos />
      <AlertasStock />
    </main>
  </Layout>
</Dashboard>
```

---

### 🟪 **Gestión de Productos**
**Propósito**: Crear y administrar el catálogo de platos del restaurante

**Elementos principales**:
- Lista de platos existentes con opciones de editar/eliminar
- Formulario para crear nuevo plato
- Selector múltiple de ingredientes
- Campo de precio y descripción
- Categorización de platos (entrada, principal, postre, etc.)

**Componentes React**:
```jsx
<GestionProductos>
  <Layout>
    <Header />
    <Sidebar />
    <main>
      <TituloSeccion title="Gestión de Productos" />
      <Button onClick={abrirModal}>+ Nuevo Plato</Button>
      <TablaProductos>
        <FilaProducto />
      </TablaProductos>
      <Modal isOpen={modalAbierto}>
        <FormularioProducto>
          <Input name="nombre" />
          <Input name="precio" />
          <Select name="categoria" />
          <MultiSelect name="ingredientes" />
          <Button type="submit" />
        </FormularioProducto>
      </Modal>
    </main>
  </Layout>
</GestionProductos>
```

---

### 🟨 **Carga de Datos Históricos**
**Propósito**: Importar datos de ventas pasadas para entrenar el modelo de predicción

**Elementos principales**:
- Zona de drag & drop para archivos
- Botón para seleccionar archivo (.csv o .xlsx)
- Especificaciones del formato requerido
- Barra de progreso durante la carga
- Mensajes de confirmación o error
- Vista previa de datos cargados

**Componentes React**:
```jsx
<CargaDatos>
  <Layout>
    <Header />
    <Sidebar />
    <main>
      <TituloSeccion title="Carga de Datos Históricos" />
      <InstruccionesFormato>
        <p>Formato requerido: fecha, plato, cantidadVendida, turno</p>
      </InstruccionesFormato>
      <ZonaCarga>
        <FileUpload 
          accept=".csv,.xlsx"
          onUpload={procesarArchivo}
        />
        <ProgressBar visible={cargando} />
      </ZonaCarga>
      <MensajeEstado tipo={tipoMensaje} />
      <VistaPreviadatos datos={datosImportados} />
    </main>
  </Layout>
</CargaDatos>
```

---

### 🟫 **Pantalla de Predicción**
**Propósito**: Generar predicciones de ventas basadas en datos históricos y parámetros seleccionados

**Elementos principales**:
- Filtros de predicción (turno, producto específico)
- Botón "Generar predicción"
- Indicador de carga "Analizando..."
- Visualización de resultados (gráfico + valores numéricos)
- Recomendaciones de stock sugerido
- Opciones para exportar o guardar predicción

**Componentes React**:
```jsx
<PrediccionVentas>
  <Layout>
    <Header />
    <Sidebar />
    <main>
      <TituloSeccion title="Predicción de Ventas" />
      <FormularioPrediccion>
        <Select name="turno" options={turnos} />
        <Select name="producto" options={productos} />
        <Button onClick={generarPrediccion}>
          Generar Predicción
        </Button>
      </FormularioPrediccion>
      
      {cargando && <Loading mensaje="Analizando datos..." />}
      
      {resultado && (
        <ResultadosPrediccion>
          <GraficoPrediccion datos={resultado} />
          <MetricasPrediccion>
            <Card title="Ventas Estimadas" />
            <Card title="Stock Recomendado" />
            <Card title="Confianza del Modelo" />
          </MetricasPrediccion>
          <RecomendacionesStock />
        </ResultadosPrediccion>
      )}
    </main>
  </Layout>
</PrediccionVentas>
```

---

### ⚪ **Pantallas Adicionales Sugeridas**

#### **🔧 Configuración del Restaurante**
**Propósito**: Gestionar información básica del establecimiento y preferencias de la aplicación

**Elementos principales**:
- Datos del restaurante (nombre, dirección, tipo de cocina)
- Configuración de turnos y horarios
- Gestión de ingredientes base
- Configuración de notificaciones
- Preferencias de la aplicación

**Componentes React**:
```jsx
<Configuracion>
  <Layout>
    <TabsConfiguracion>
      <Tab title="Restaurante">
        <FormularioRestaurante />
      </Tab>
      <Tab title="Turnos">
        <ConfiguracionTurnos />
      </Tab>
      <Tab title="Ingredientes">
        <GestionIngredientes />
      </Tab>
      <Tab title="Notificaciones">
        <PreferenciasNotificaciones />
      </Tab>
    </TabsConfiguracion>
  </Layout>
</Configuracion>
```

#### **📊 Reportes y Análisis**
**Propósito**: Generar reportes detallados y análisis avanzados de rendimiento

**Elementos principales**:
- Filtros de fecha y período
- Diferentes tipos de reportes (ventas, productos, tendencias)
- Gráficos interactivos
- Exportación a PDF/Excel
- Comparativas período a período

**Componentes React**:
```jsx
<Reportes>
  <Layout>
    <FiltrosReporte>
      <DateRangePicker />
      <Select name="tipoReporte" />
    </FiltrosReporte>
    <ContenidoReporte>
      <GraficosInteractivos />
      <TablaDetallada />
      <ResumenEjecutivo />
    </ContenidoReporte>
    <AccionesReporte>
      <Button>Exportar PDF</Button>
      <Button>Exportar Excel</Button>
    </AccionesReporte>
  </Layout>
</Reportes>
```

#### **📦 Gestión de Inventario**
**Propósito**: Monitorear stock actual y recibir alertas de reposición

**Elementos principales**:
- Lista de ingredientes con stock actual
- Alertas de stock bajo
- Registro de entradas y salidas
- Cálculo automático de necesidades basado en predicciones
- Proveedores y precios

**Componentes React**:
```jsx
<GestionInventario>
  <Layout>
    <AlertasStock />
    <TablaInventario>
      <FilaIngrediente />
    </TablaInventario>
    <Modal title="Actualizar Stock">
      <FormularioStock />
    </Modal>
    <RecomendacionesCompra />
  </Layout>
</GestionInventario>
```

#### **👤 Registro de Usuario**
**Propósito**: Permitir que nuevos restaurantes se registren en la plataforma

**Elementos principales**:
- Formulario de registro con datos del restaurante
- Validación de email
- Términos y condiciones
- Proceso de verificación
- Onboarding inicial

**Componentes React**:
```jsx
<Registro>
  <FormularioRegistro>
    <PasosDatos>
      <Input name="nombreRestaurante" />
      <Input name="email" />
      <Input name="password" />
      <Input name="telefono" />
    </PasosDatos>
    <PasosVerificacion>
      <VerificacionEmail />
    </PasosVerificacion>
    <PasosOnboarding>
      <ConfiguracionInicial />
    </PasosOnboarding>
  </FormularioRegistro>
</Registro>
```

---

### 🔄 **Componentes Transversales**

Estos componentes se utilizan en múltiples pantallas:

- **`<Layout>`**: Estructura base con header, sidebar y contenido principal
- **`<Header>`**: Navegación superior con logo, usuario y notificaciones
- **`<Sidebar>`**: Menú lateral de navegación
- **`<Loading>`**: Indicadores de carga con diferentes estilos
- **`<ErrorMessage>`**: Mensajes de error consistentes
- **`<Modal>`**: Ventanas modales reutilizables
- **`<Button>`**: Botones con diferentes variantes y estados
- **`<Input>`**: Campos de entrada con validación
- **`<Select>`**: Selectores simples y múltiples
- **`<Card>`**: Tarjetas para mostrar información
- **`<Table>`**: Tablas de datos con paginación y filtros
- **`<Chart>`**: Gráficos reutilizables (líneas, barras, torta)

---

## 🚀 Desarrollo

### **Instalación y Configuración**

1. **Clonar el repositorio**:
```bash
git clone [url-del-repositorio]
cd smartstocker
```

2. **Instalar dependencias**:
```bash
npm ci
```

3. **Ejecutar en desarrollo**:
```bash
npm run dev
```

4. **Compilar para producción**:
```bash
npm run build
```

### **Estructura del Proyecto**
```
src/
├── main.jsx                 # Punto de entrada con providers
├── App.jsx                  # Componente raíz
├── routes/
│   └── AppRoutes.jsx       # Configuración de rutas
├── contexts/
│   └── AuthContext.jsx     # Estado global de autenticación
├── services/
│   └── auth.mock.js        # Servicios de autenticación mock
├── pages/
│   ├── LandingPage.jsx     # Página principal
│   └── auth/               # Páginas de autenticación
├── components/
│   ├── layout/             # Header, Footer, Layout
│   ├── forms/              # TextField, PasswordField
│   ├── feedback/           # Success/Error messages
│   ├── common/             # Button, Card, etc.
│   └── icons/              # Iconos con lucide-react
└── assets/
    └── styles/             # CSS global y variables
```

### **Tecnologías Utilizadas**
- **React 18** - Librería principal
- **React Router v6** - Navegación SPA
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconografía moderna
- **CSS Modules** - Estilos modulares
- **Vite** - Build tool y dev server

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

### **Comandos Disponibles**
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de build de producción
- `npm run lint` - Verificar código con ESLint

### **Variables de Entorno**
- `VITE_API_URL` - URL de la API (opcional para desarrollo)

### **Navegación y Estado**
La aplicación funciona como una **Single Page Application (SPA)**:
- ✅ **Sin recargas**: Toda la navegación es instantánea
- ✅ **Estado persistente**: La sesión se mantiene entre recargas
- ✅ **Rutas protegidas**: Redirección automática según autenticación
- ✅ **Experiencia fluida**: Transiciones suaves entre páginas

### **Desarrollo Local**
Para trabajar en el proyecto:
1. Todas las rutas funcionan sin servidor backend
2. Los datos se almacenan en `localStorage` del navegador
3. La autenticación es completamente funcional en modo mock
4. Hot reload automático durante desarrollo

---

**Nota**: Este proyecto utiliza servicios mock para desarrollo. En producción, los servicios de `auth.mock.js` deberían reemplazarse por llamadas a una API real.