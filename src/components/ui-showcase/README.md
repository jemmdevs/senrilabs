# UI Showcase Components

Este directorio contiene los componentes de demostración para la página de Human Interface.

## 📁 Estructura

```
ui-showcase/
├── ComponentShowcase.astro    # Wrapper para todos los componentes
├── GlassyButton.astro         # Componente: Botones con efecto cristal
├── FeatureCards.astro         # Componente: Tarjetas con spotlight effect
└── README.md                  # Este archivo
```

## 🎨 Configurar el color/imagen de fondo

Cada componente puede definir su propio color de fondo o imagen. Esto se hace dentro del propio archivo del componente usando `showcaseConfig`.

### Ejemplo 1: Usar un color sólido

```astro
---
// MiComponente.astro

// CONFIGURACIÓN DEL SHOWCASE
export const showcaseConfig = {
  backgroundColor: '#1a1a1a', // Tu color en formato hexadecimal
};
---

<!-- Tu contenido del componente aquí -->
<div class="mi-componente">
  <!-- ... -->
</div>
```

### Ejemplo 2: Usar una imagen de fondo

```astro
---
// MiComponente.astro

// CONFIGURACIÓN DEL SHOWCASE
export const showcaseConfig = {
  backgroundImage: '/mi-imagen.jpg', // Ruta a tu imagen en /public
};
---

<!-- Tu contenido del componente aquí -->
<div class="mi-componente">
  <!-- ... -->
</div>
```

### Ejemplo 3: Usar ambos (la imagen tiene prioridad)

```astro
---
// MiComponente.astro

// CONFIGURACIÓN DEL SHOWCASE
export const showcaseConfig = {
  backgroundColor: '#1a1a1a',      // Fallback si la imagen no carga
  backgroundImage: '/mi-imagen.jpg', // Se mostrará esta imagen
};
---

<!-- Tu contenido del componente aquí -->
<div class="mi-componente">
  <!-- ... -->
</div>
```

## 📝 Cómo añadir un nuevo componente

### Paso 1: Crear el archivo del componente

Crea un nuevo archivo en `src/components/ui-showcase/MiComponente.astro`:

```astro
---
// MiComponente.astro

// CONFIGURACIÓN DEL SHOWCASE
export const showcaseConfig = {
  backgroundColor: '#f5f5f5', // O backgroundImage: '/imagen.jpg'
};
---

<!-- Tu componente aquí -->
<div class="mi-componente">
  <h3>Mi Componente Increíble</h3>
  <p>Descripción del componente</p>
</div>

<style>
  .mi-componente {
    /* Tus estilos aquí */
  }
</style>

<script>
  // Tu JavaScript aquí (opcional)
</script>
```

### Paso 2: Importarlo en components.astro

Abre `src/pages/human-interface/components.astro` y añade:

```astro
---
// ... otros imports
import MiComponente, { showcaseConfig as miComponenteConfig } from '@/components/ui-showcase/MiComponente.astro';
---

<!-- ... otro contenido ... -->

<!-- Tu Nuevo Componente -->
<ComponentShowcase
  id="mi-componente"
  title="Mi Componente"
  date="Nov 2, 2025"
  description="Descripción breve de lo que hace tu componente."
  {...miComponenteConfig}
>
  <MiComponente />
</ComponentShowcase>
```

### Paso 3: Añadir al menú de navegación (opcional)

En el mismo archivo `components.astro`, busca el `<aside>` con la navegación y añade:

```astro
<a href="#mi-componente" class="nav-item block text-[14px] text-gray-400 transition-all duration-300">
  Mi Componente
</a>
```

## 🎯 Ventajas de este sistema

✅ **Autónomo**: Cada componente define su propio estilo de fondo  
✅ **Flexible**: Puedes usar colores o imágenes según necesites  
✅ **Escalable**: Fácil añadir nuevos componentes sin modificar código existente  
✅ **Organizado**: Toda la configuración está en un solo lugar por componente  

## 📚 Componentes disponibles

| Componente | Fondo | Descripción |
|------------|-------|-------------|
| `GlassyButton` | Imagen (`/applebg.jpeg`) | Botones con efecto de vidrio líquido |
| `FeatureCards` | Color (`#1a1a1a`) | Tarjetas con efecto spotlight hover |

## 🔧 Personalización avanzada

Si necesitas más control sobre el contenedor, puedes modificar `ComponentShowcase.astro` para aceptar más props como:
- `minHeight`: Altura mínima del contenedor
- `padding`: Espaciado interno
- `borderRadius`: Radio de las esquinas
- Etc.

