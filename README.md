# Sauce Demo - Automatización E2E con Playwright y Cucumber

[![E2E Tests](https://github.com/JhosepSteeven-Software-Engineer/saucedemo-playwright-cucumber/actions/workflows/e2e.yml/badge.svg)](https://github.com/JhosepSteeven-Software-Engineer/saucedemo-playwright-cucumber/actions/workflows/e2e.yml)

Suite de pruebas automatizadas para [Sauce Demo](https://www.saucedemo.com/) desarrollada con
**Playwright**, **Cucumber** y **TypeScript**, aplicando **Page Object Model (POM)**, hooks,
World y datos de prueba externalizados.

El proyecto cubre el flujo principal de un cliente: iniciar sesión, agregar productos al carrito y
completar una compra. Incluye escenarios para el usuario estándar, el usuario bloqueado y
credenciales inválidas.

## Stack

| Componente              | Tecnología                              |
| ----------------------- | --------------------------------------- |
| Automatización de UI    | Playwright 1.64                         |
| BDD                     | Cucumber 13 (`@cucumber/cucumber`)      |
| Lenguaje                | TypeScript                              |
| Ejecución de TypeScript | `tsx`                                   |
| Patrón de diseño        | Page Object Model + `BasePage`          |
| Gestión de estado       | World + hooks de Cucumber               |
| CI/CD                   | GitHub Actions                          |
| Reportes                | HTML, JSON, JUnit, screenshots y traces |

## Requisitos

- Linux, macOS o Windows con WSL.
- Node.js 22 o superior. El proyecto fue validado con Node 26 en local y Node 24 en CI.
- npm.
- Git.
- Chromium de Playwright.

En Linux Mint o Ubuntu, si faltan dependencias del sistema:

```bash
sudo apt update
sudo apt install -y build-essential
```

## Instalación

```bash
git clone https://github.com/JhosepSteeven-Software-Engineer/saucedemo-playwright-cucumber.git
cd saucedemo-playwright-cucumber
npm install
npx playwright install chromium
cp .env.example .env
```

Si Playwright reporta librerías faltantes, ejecuta:

```bash
npx playwright install --with-deps chromium
```

Ese comando puede solicitar `sudo` para instalar dependencias del sistema.

## Configuración

El archivo `.env` es opcional porque el proyecto tiene valores por defecto. Variables disponibles:

| Variable          | Valor por defecto           | Descripción                                      |
| ----------------- | --------------------------- | ------------------------------------------------ |
| `BASE_URL`        | `https://www.saucedemo.com` | URL base de la aplicación                        |
| `HEADLESS`        | `true`                      | Ejecuta Chromium en modo headless                |
| `DEFAULT_TIMEOUT` | `15000`                     | Timeout de acciones y navegación en milisegundos |

## Ejecución

```bash
# Suite completa
npm test

# Solo escenarios @smoke
npm run test:smoke

# Solo escenarios @regression
npm run test:regression

# Modo visible para depurar
npm run test:headed

# Ejecución usada por CI
npm run test:ci

# Verificación de tipos
npm run typecheck

# Formato
npm run format:check

# Abrir el reporte HTML
npm run report:open
```

También puedes filtrar por tags directamente:

```bash
npx cucumber-js --tags "@checkout"
npx cucumber-js --tags "@login and not @smoke"
```

## Estructura del proyecto

```text
saucedemo-playwright-cucumber/
├── .github/workflows/e2e.yml
├── features/
│   ├── login.feature
│   ├── cart.feature
│   └── checkout.feature
├── src/
│   ├── config/env.ts
│   ├── data/users.ts
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutStepOnePage.ts
│   │   ├── CheckoutStepTwoPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── steps/
│   │   ├── login.steps.ts
│   │   ├── cart.steps.ts
│   │   └── checkout.steps.ts
│   └── support/
│       ├── browser.ts
│       ├── hooks.ts
│       └── world.ts
├── docs/strategy.md
├── reports/                 # generado en cada ejecución
├── cucumber.cjs
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

## Estrategia de automatización

### Page Object Model

Cada pantalla tiene una clase que encapsula sus localizadores y acciones. Los steps no conocen
selectores: solo llaman a métodos de negocio como `login()`, `addProduct()` o `finish()`.

`BasePage` centraliza el comportamiento común de navegación y espera. Las páginas concretas heredan
de ella y exponen únicamente las acciones que necesita el negocio.

### World y hooks

Cucumber no tiene fixtures como Playwright Test. El equivalente se implementa con:

- **World:** mantiene el navegador, el contexto, la página y las instancias de los Page Objects
  durante un escenario.
- **Before:** crea un contexto nuevo, una página y comienza el trace.
- **After:** guarda screenshot y trace si el escenario falla, y cierra el contexto.
- **BeforeAll / AfterAll:** reutilizan una sola instancia de Chromium para toda la ejecución.

Cada escenario usa un contexto aislado, por lo que no comparte cookies ni sesión con los demás.

### Gherkin

- Un feature por capacidad de negocio: login, carrito y checkout.
- `Scenario Outline` para credenciales inválidas y campos vacíos.
- `DataTable` para listas de productos y datos de checkout.
- Tags `@smoke`, `@regression`, `@login`, `@cart` y `@checkout`.
- Sin `sleep()`: las esperas son implícitas y basadas en aserciones de Playwright.

## Cobertura funcional

| Criterio de aceptación           | Escenario                                                         |
| -------------------------------- | ----------------------------------------------------------------- |
| Login con credenciales válidas   | `Login with valid credentials`                                    |
| Login con credenciales inválidas | `Login with an invalid password` y `Login with empty credentials` |
| Usuario bloqueado                | `Login with a locked out user`                                    |
| Agregar un producto              | `Add a single product to the cart`                                |
| Ver productos en el carrito      | `Add multiple products to the cart`                               |
| Completar la compra              | `Complete a purchase successfully`                                |
| Validación del checkout          | `Checkout requires a postal code`                                 |
| Eliminar productos               | `Remove a product from the cart`                                  |

Credenciales utilizadas:

- `standard_user / secret_sauce`
- `locked_out_user / secret_sauce`
- Contraseña inválida para el escenario negativo: `wrong_password`

## Reportes y evidencias

Cada ejecución genera:

- `reports/cucumber-report.html`: reporte legible en el navegador.
- `reports/cucumber-report.json`: resultado estructurado.
- `reports/junit.xml`: formato para integraciones CI.
- `reports/screenshots/`: captura de pantalla de cada escenario fallido.
- `reports/traces/`: trace de Playwright para inspeccionar el fallo paso a paso.

Para abrir un trace:

```bash
npx playwright show-trace reports/traces/<archivo>.zip
```

## Integración continua

El workflow `.github/workflows/e2e.yml` se ejecuta en cada `push` a `main`, en cada pull request y
de forma manual. Instala dependencias, verifica tipos, ejecuta la suite y publica los reportes como
artefacto de GitHub Actions.

## Rendimiento en equipos modestos

La configuración está pensada para funcionar en equipos con pocos núcleos:

- Solo Chromium.
- Modo headless por defecto.
- Un worker de Cucumber.
- Sin video.
- Trace y screenshot solo se conservan cuando hay fallos.
- Una sola instancia de navegador para toda la suite.

La suite completa tarda aproximadamente 13 segundos en un equipo de 2 núcleos.

## Decisiones y limitaciones

- Sauce Demo es una aplicación de demostración: no tiene API ni base de datos propia. Por eso el
  alcance del reto es exclusivamente frontend.
- Los selectores usan atributos `data-test`, que son más estables que clases o textos. Sauce Demo
  usa `data-test` en camelCase para los campos del checkout (`firstName`, `lastName`,
  `postalCode`), detalle que está centralizado en los Page Objects.
- No se automatizan escenarios de `performance_glitch_user` ni `problem_user` porque no forman
  parte de los criterios de aceptación del reto.
- La suite está diseñada para ejecutarse con un worker. Aumentar el paralelismo requeriría revisar
  el uso de una sola instancia de navegador por proceso.

## Autor

**Jhosep Steeven Huamani Garcia**

Ingeniero de Sistemas con experiencia en QA, pruebas funcionales, regresión y automatización.
