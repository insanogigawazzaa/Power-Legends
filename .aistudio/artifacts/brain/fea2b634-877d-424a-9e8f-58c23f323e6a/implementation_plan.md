# Plan de Implementación: Vista Previa de Sprites tipo Dokkan Battle (Chibi Dinámico)

## 1. Visión General del Proyecto
Crear una demostración conceptual y visual interactiva de sprites de combate estilo **Dragon Ball Z: Dokkan Battle** (chibi estilizado, poses de acción dinámicas, auras llameantes de energía y efectos de ataque ki) para los personajes destacados del simulador (*APC3 Yasaida*, *Nick Super Kaioken*, *Fhai Nube Voladora*, *Dino Super Saiyajin*, *Beith* y *Dex*).

> **Aislamiento total:** Como solicitó el usuario, esta característica será un **Visor de Laboratorio / Muestra Conceptual independiente** y no se integrará a la lógica de invocaciones, estadísticas ni al juego principal. Se accederá mediante un botón discreto de laboratorio/preview en el pie de página o menú de utilidades para inspeccionar el concepto.

---

## 2. Decisiones de Diseño y Dirección Visual (Frontend & Dokkan Style)

* **Estética Sprite Dokkan Battle:**
  * Proporciones chibi de combate (cabeza ligeramente sobredimensionada, expresiones de determinación extrema, manos enguantadas pronunciadas y sombras cel shading duras de alto contraste anime).
  * Auras elementales animadas con gradientes CSS y destellos de partículas ki correspondientes al elemento del personaje:
    * **RED**: Aura llameante escarlata y rojiza (Super Kaioken).
    * **BLU**: Resplandor cósmico azul cian (Plasma Estelar Yasaida).
    * **GRN**: Remolino esmeralda de energía pura.
    * **YEL**: Resplandor eléctrico dorado saiyajin.
    * **PUR**: Energía arcana oscura y mística.
* **Muestrario de Estados de Animación:**
  * **Idle / En Espera**: Animación de respiración/flotación continua (`animate-bounce` suave con pulsación de aura).
  * **Carga de Ki / Potenciación**: Aceleración del pulso de partículas y aumento de escala del aura.
  * **Pose de Ataque / Ráfaga**: Sacudida e impacto de energía característico de Dokkan.
* **Componente Visor de Laboratorio (`SpriteLaboratoryModal.tsx`)**:
  * Modal oscuro de alta tecnología con aspecto de consola de desarrollo / laboratorio de animación.
  * Selector de personajes destacados con miniatura y código original.
  * Escenario de combate tipo Dokkan Battle con fondo de suelo agrietado, cielo dinámico y selector de zoom/rotación.
  * Panel de controles de inspección:
    * Alternar Aura Ki (Encendida / Apagada / Carga Máxima).
    * Alternar animación de movimiento (Idle / Ataque / Ki Burst).
    * Comparativa en paralelo: Ilustración Original DBL vs. Sprite Dokkan Chibi.

---

## 3. Plan de Tareas por Fases

### Fase 1: Creación y Preparación de Assets de Sprites
1. Diseñar y generar los sprites estilo chibi dinámico Dokkan Battle para los guerreros destacados:
   * **Nick (Super Kaioken x20)**: Pose de guardia ofensiva con aura doble rojiza carmesí y relámpagos.
   * **APC3 (Yasaida)**: Pose mítica con esfera de plasma cósmico azul en mano.
   * **Dino (Super Saiyajin)**: Cabello dorado erizado en pose de choque frontal con aura de chispas.
   * **Fhai (Nube Voladora)**: Montado en la nube voladora dorada con su báculo y pose aérea acrobática.
   * **Dex (Forma Final)**: Flotando con los brazos cruzados y mirada intimidante con orbe supernova.
2. Almacenar los assets optimizados en formato PNG transparente para visualización nítida sobre fondos oscuros.

### Fase 2: Componente Visor de Laboratorio (`SpriteLaboratoryModal.tsx`)
1. Desarrollar el componente de modal de exhibición en `src/components/SpriteLaboratoryModal.tsx`.
2. Implementar los toggles de estado (Aura encendida/apagada, modo de animación Idle vs Blast).
3. Añadir selector horizontal tipo carrusel con fichas técnicas rápidas (nombre, código, rareza, elemento y descripción de técnica sprite).

### Fase 3: Integración de Acceso Discreto y Seguro
1. Añadir un botón discreto en el pie de página de la aplicación o en la cabecera:
   * Etiqueta: `[ LAB: Sprites Dokkan (Preview) ]`
   * Sin interferir con el flujo de invocaciones ni con los balances de Cronocristales.
2. Pruebas de interacción, fluidez a 60 FPS y responsividad en pantallas móviles y de escritorio.

---

## 4. Criterios de Aceptación
* El modal se abre y se cierra limpiamente sin afectar ningún dato del jugador ni del simulador.
* Los sprites muestran la estética chibi con poses de combate y auras características de Dokkan Battle.
* Cada personaje destacado cuenta con su ficha comparativa y controles de inspección interactivos.
* Compilación limpia mediante `compile_applet` y `lint_applet` con cero errores de TypeScript.
