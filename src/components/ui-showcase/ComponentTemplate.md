# 📋 Plantilla para Crear Nuevos Componentes

Esta plantilla te guía paso a paso para crear un nuevo componente para la página de showcase.

## 🎯 ¿Qué necesitas hacer?

### ✅ Lo que SÍ necesitas hacer:
1. Crear tu archivo del componente con el contenido interactivo
2. Exportar la configuración `showcaseConfig` con el color/imagen de fondo
3. Importar y usar el componente en `components.astro`

### ❌ Lo que NO necesitas hacer:
- **NO** necesitas crear el contenedor manualmente - `ComponentShowcase.astro` lo hace automáticamente
- **NO** necesitas agregar el header (título, fecha) - Se pasa como props
- **NO** necesitas agregar la descripción - También se pasa como props

---

## 📝 PASO 1: Crear el archivo del componente

Crea un archivo: `src/components/ui-showcase/MiComponente.astro`

### Estructura básica (copia esto):

```astro
---
// ============================================
// SECCIÓN 1: CONFIGURACIÓN (OBLIGATORIO)
// ============================================
// Define el color de fondo o imagen para este componente
export const showcaseConfig = {
  // OPCIÓN A: Usa un color de fondo
  backgroundColor: '#1a1a1a', // ⬅️ REEMPLAZA con tu color en formato #XXXXXX
  
  // OPCIÓN B: O usa una imagen de fondo (comenta backgroundColor si usas esto)
  // backgroundImage: '/tu-imagen.jpg', // ⬅️ REEMPLAZA con la ruta a tu imagen en /public
  
  // 💡 Solo usa UNO: backgroundColor O backgroundImage, no ambos
};
---

<!-- ============================================ -->
<!-- SECCIÓN 2: HTML DEL COMPONENTE (OBLIGATORIO) -->
<!-- ============================================ -->
<!-- Aquí va TODO el contenido visual de tu componente -->
<!-- Usa clases CSS con el nombre de tu componente para evitar conflictos -->

<div class="miComponente-container">
  {/* ⬅️ REEMPLAZA "miComponente" con el nombre de tu componente */}
  
  <!-- Ejemplo de contenido -->
  <div class="miComponente-card">
    <h3>Título de ejemplo</h3>
    <p>Contenido de ejemplo</p>
  </div>
  
  <!-- Añade todo tu HTML aquí -->
</div>

<!-- ============================================ -->
<!-- SECCIÓN 3: ESTILOS CSS (OBLIGATORIO) -->
<!-- ============================================ -->
<style>
  /* 💡 IMPORTANTE: Usa prefijos únicos para tus clases CSS */
  /* Ejemplo: .miComponente-container, .miComponente-card, etc. */
  /* Esto evita conflictos con otros componentes */
  
  .miComponente-container {
    /* ⬅️ REEMPLAZA "miComponente" con el nombre de tu componente */
    width: 100%;
    max-width: 60ch;
    position: relative;
  }
  
  .miComponente-card {
    /* ⬅️ REEMPLAZA "miComponente" con el nombre de tu componente */
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
  }
  
  /* Añade todos tus estilos aquí */
  
  /* Estilos responsive (recomendado) */
  @media (max-width: 640px) {
    .miComponente-container {
      /* Estilos para móvil */
    }
  }
</style>

<!-- ============================================ -->
<!-- SECCIÓN 4: JAVASCRIPT (OPCIONAL) -->
<!-- ============================================ -->
<!-- Solo incluye esto si tu componente necesita interactividad -->
<script>
  // Tu código JavaScript aquí
  const elemento = document.getElementById('miComponente');
  
  if (elemento) {
    // Tu lógica aquí
  }
</script>
```

---

## 📝 PASO 2: Registrar en components.astro

Abre `src/pages/human-interface/components.astro` y:

### A) Importar tu componente

Busca la sección de imports al inicio y añade:

```astro
---
// ... otros imports ...
import MiComponente, { showcaseConfig as miComponenteConfig } from '@/components/ui-showcase/MiComponente.astro';
// ⬆️ REEMPLAZA "MiComponente" con el nombre de tu componente
// ⬆️ REEMPLAZA "miComponenteConfig" con un nombre descriptivo
---
```

### B) Usar tu componente

Busca la sección donde están los demás componentes y añade:

```astro
<!-- Mi Nuevo Componente -->
<ComponentShowcase
  id="mi-componente"              {/* ⬅️ REEMPLAZA: ID único (en kebab-case) */}
  title="Mi Componente"           {/* ⬅️ REEMPLAZA: Título visible */}
  date="Nov 2, 2025"              {/* ⬅️ REEMPLAZA: Fecha de creación */}
  description="Descripción breve de lo que hace tu componente y sus características principales."
  {/* ⬆️ REEMPLAZA: Descripción del componente */}
  {...miComponenteConfig}         {/* ⬅️ REEMPLAZA: El config que importaste */}
>
  <MiComponente />                {/* ⬅️ REEMPLAZA: Tu componente */}
</ComponentShowcase>
```

### C) Añadir al menú lateral (opcional)

Busca el `<aside>` con clase `hidden lg:block` y añade:

```astro
<a href="#mi-componente" class="nav-item block text-[14px] text-gray-400 transition-all duration-300">
  Mi Componente  {/* ⬅️ REEMPLAZA: Nombre del componente */}
</a>
```

---

## 🎯 Ejemplo Real: FeatureCards

Veamos cómo está estructurado `FeatureCards.astro`:

### SECCIÓN 1: Configuración
```astro
---
export const showcaseConfig = {
  backgroundColor: '#000000',
};
---
```

### SECCIÓN 2: HTML
```astro
<div class="featureCards-container">
  <ul class="featureCards-grid" id="featureCards-grid">
    <li>
      <article>
        <!-- Contenido de la tarjeta -->
      </article>
    </li>
  </ul>
</div>
```

### SECCIÓN 3: CSS
```astro
<style>
  .featureCards-container {
    width: 100%;
    max-width: 60ch;
    position: relative;
  }
  
  .featureCards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* ... más estilos ... */
  }
</style>
```

### SECCIÓN 4: JavaScript
```astro
<script>
  const grid = document.getElementById('featureCards-grid');
  if (grid) {
    // Lógica del componente
  }
</script>
```

### Importado en components.astro:
```astro
import FeatureCards, { showcaseConfig as featureCardsConfig } from '@/components/ui-showcase/FeatureCards.astro';

<!-- Luego usado así: -->
<ComponentShowcase
  id="feature-cards"
  title="Feature Cards"
  date="Nov 2, 2025"
  description="Interactive cards with dynamic hover effects."
  {...featureCardsConfig}
>
  <FeatureCards />
</ComponentShowcase>
```

---

## ✅ Checklist antes de terminar

- [ ] He exportado `showcaseConfig` con `backgroundColor` O `backgroundImage`
- [ ] Todas mis clases CSS tienen un prefijo único (nombre del componente)
- [ ] He importado el componente y su config en `components.astro`
- [ ] He usado `<ComponentShowcase>` con todas las props requeridas
- [ ] He probado el componente en la página
- [ ] (Opcional) He añadido el link en el menú lateral

---

## ❓ Preguntas Frecuentes

### ¿Necesito crear el contenedor manualmente?
**NO.** `ComponentShowcase.astro` crea automáticamente:
- El contenedor con el color/imagen de fondo
- El header (título + fecha)
- La descripción
- El padding y estilos básicos

Tú solo creas el contenido interactivo.

### ¿Qué pasa si no exporto showcaseConfig?
El componente usará el color por defecto (`#000000` negro). Pero es mejor siempre definirlo.

### ¿Puedo usar librerías externas?
Sí, pero asegúrate de importarlas correctamente en tu componente.

### ¿Cómo nombro mis clases CSS?
Usa el nombre de tu componente como prefijo: `.miComponente-container`, `.miComponente-grid`, etc.
Esto evita conflictos con otros componentes.

---

## 🚀 ¡Listo para crear tu componente!

Copia la estructura básica del PASO 1, reemplaza lo marcado con ⬅️, y sigue los pasos 2 y 3.

Si tienes dudas, revisa los componentes existentes como ejemplo:
- `GlassyButton.astro` - Ejemplo con imagen de fondo
- `FeatureCards.astro` - Ejemplo con color de fondo e interactividad

