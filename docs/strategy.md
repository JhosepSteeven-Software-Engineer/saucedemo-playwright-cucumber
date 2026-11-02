# Estrategia de automatización

## 1. Objetivo

Automatizar los flujos críticos de Sauce Demo relacionados con autenticación, carrito de compras y
checkout, usando Playwright con Cucumber y un patrón de diseño mantenible.

El objetivo no es automatizar la mayor cantidad de casos posible, sino cubrir los criterios de
aceptación con escenarios claros, independientes y fáciles de mantener.

## 2. Alcance

### Incluido

- Login con `standard_user`.
- Login con contraseña inválida.
- Login con `locked_out_user`.
- Validación de campos vacíos en el login.
- Agregar uno o varios productos al carrito.
- Verificar el contenido del carrito.
- Eliminar productos.
- Completar una compra hasta la confirmación.
- Validación del código postal obligatorio en el checkout.

### Excluido

- Pruebas de API, porque Sauce Demo no expone una API pública.
- Validación en base de datos, porque la aplicación no tiene una base de datos accesible.
- Pruebas de rendimiento, seguridad, accesibilidad y visuales.
- Navegadores distintos de Chromium.
- Usuarios `problem_user`, `performance_glitch_user`, `error_user` y `visual_user`, que no forman
  parte de los criterios del reto.

## 3. Enfoque basado en riesgo

| Área          | Riesgo                              | Cobertura                                            |
| ------------- | ----------------------------------- | ---------------------------------------------------- |
| Autenticación | Alto: bloquea todo el flujo         | 5 escenarios, incluyendo usuario bloqueado y errores |
| Carrito       | Medio: afecta la compra             | Agregar, listar y eliminar productos                 |
| Checkout      | Alto: impacto directo en el negocio | Compra completa y validación de campos obligatorios  |

Se prioriza el camino feliz con `@smoke` y se mantiene el resto con `@regression`. Así se puede
obtener una señal rápida antes de ejecutar la suite completa.

## 4. Arquitectura

```text
Feature (Gherkin)
    ↓
Step definitions (lenguaje de negocio + aserciones)
    ↓
Page Objects (localizadores + acciones)
    ↓
Playwright (navegador)
```

### Page Object Model

- `BasePage`: navegación y esperas comunes.
- `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutStepOnePage`, `CheckoutStepTwoPage` y
  `CheckoutCompletePage`: una clase por pantalla.
- Los selectores viven en un solo lugar; los steps no contienen selectores.
- Las aserciones viven en los steps para mantener el Page Object enfocado en la interacción.

### World y hooks

`SauceWorld` extiende `World` y mantiene el estado del escenario: navegador, contexto, página y
Page Objects. Los hooks se encargan del ciclo de vida:

- `BeforeAll`: directorios de reportes, configuración de `data-test` y arranque de Chromium.
- `Before`: contexto aislado, página, timeout y trace.
- `After`: screenshot y trace si falla; cierre del contexto.
- `AfterAll`: cierre del navegador.

Esta separación evita que los steps gestionen infraestructura y facilita reutilizar la suite.

### Datos de prueba

- Usuarios centralizados en `src/data/users.ts`.
- Productos y datos de checkout declarados en las tablas de Gherkin.
- Sin credenciales dispersas en el código.
- Cada escenario parte de un contexto limpio.

## 5. Estrategia BDD

- Un feature por capacidad: `login`, `cart` y `checkout`.
- Escenarios escritos en lenguaje de negocio, sin detalles de implementación.
- `Scenario Outline` para conjuntos de datos: credenciales vacías y usuarios inválidos.
- `DataTable` para productos y datos de checkout.
- Tags para seleccionar subconjuntos: `@smoke`, `@regression`, `@login`, `@cart`, `@checkout`.

La suite tiene 10 escenarios y 71 pasos. Es deliberadamente pequeña: cubre los criterios de
aceptación y demuestra el patrón sin caer en duplicación.

## 6. Ejecución

```bash
npm test                 # suite completa
npm run test:smoke       # camino crítico
npm run test:regression  # cobertura completa
npm run test:ci          # formato para CI
```

La configuración usa Chromium headless y un worker para funcionar en equipos de 2 núcleos. El trace
y el screenshot solo se conservan cuando un escenario falla.

## 7. Integración continua

GitHub Actions ejecuta:

1. `npm ci`.
2. Instalación de Chromium con dependencias.
3. `npm run typecheck`.
4. `npm run test:ci`.
5. Publicación de `reports/` como artefacto, incluso si la suite falla.

Esto permite que cualquier pull request tenga una señal automática de regresión funcional.

## 8. Resultados y métricas

| Métrica                 | Resultado local         |
| ----------------------- | ----------------------- |
| Escenarios              | 10                      |
| Pasos                   | 71                      |
| Smoke                   | 3 escenarios / 24 pasos |
| Duración suite completa | ~13 segundos            |
| Duración smoke          | ~5 segundos             |
| Escenarios fallidos     | 0                       |

## 9. Mejoras futuras

- Añadir pruebas de API con `APIRequestContext` sobre un servicio propio o un mock.
- Incorporar validación de SQL con un contenedor PostgreSQL y datos semilla.
- Ejecutar en Firefox y WebKit si el entorno lo permite.
- Añadir pruebas de accesibilidad con `@axe-core/playwright`.
- Añadir pruebas visuales con `toHaveScreenshot`.
- Integrar reportes con Allure o Xray si la organización lo requiere.
- Aumentar el paralelismo cuando la infraestructura tenga más núcleos.
- Publicar el reporte HTML en GitHub Pages.

## 10. Decisiones técnicas

- **Cucumber oficial en JavaScript/TypeScript:** evita depender de `behave` o `pytest-bdd`, que no
  son implementaciones de Cucumber.
- **TypeScript:** los tipos detectan errores en Page Objects, World y steps antes de ejecutar.
- **`tsx`:** permite ejecutar TypeScript sin un paso de compilación separado.
- **`data-test`:** selectores estables y legibles; Sauce Demo los mantiene para pruebas.
- **Un navegador y un worker:** prioriza estabilidad y consumo bajo sobre velocidad.
