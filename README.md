# Verdant — Smart Irrigation Intelligence

A responsive React + Vite prototype for an IoT-based precision irrigation project. It combines an editorial, scroll-led landing page with a working **simulated** sensor dashboard.

## Features

- Responsive navigation and layouts for desktop/mobile
- Framer Motion entrance reveals, scroll progress, animated hero, hover states, dashboard recommendation transitions, and accordion
- Interactive sensor simulator: soil moisture, temperature, humidity and crop selection
- Recommendation state updates from soil-moisture thresholds
- Selectable sample field zones
- Contact/enquiry form with browser-local storage
- Reduced-motion accessibility support
- Clear labels distinguishing simulated values from real hardware data

## Run locally

Requires Node.js LTS and an internet connection for the first dependency installation.

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Important prototype boundaries

This is a **frontend prototype**, not a deployed IoT backend. The dashboard values and zone readings are illustrative and simulated. The recommendation currently uses simple demo moisture thresholds; it is **not** a trained Random Forest inference. FAO-56 is described in the project narrative but evapotranspiration calculations are not implemented in this frontend. The enquiry form saves in the current browser only; it does not send email or call a server. This site does not control a physical pump.

For a real deployment, connect ESP32/LoRa telemetry to an API or gateway, validate sensor calibration, implement FAO-56 calculations with appropriate weather/crop-stage inputs, train and validate the ML model, and add safe actuator control (rated switching hardware, manual override, dry-run protection, timeouts and fail-safe behaviour).

## Animation inspiration

The interaction style uses common contemporary patterns—subtle scroll reveals, a scroll-progress indicator, layered hero imagery, staggered content, restrained motion and interactive dashboard transitions—rather than copying another website. For inspiration, see [Framer's scroll-reveal component](https://framer.elliotli.dev/component/scroll-reveal-hero) and this [Awwwards-style motion overview](https://thanor.ai/blog/awwwards-style-website).

## Visual refresh included

This version adds an immersive, image-led field-story section using the bundled crop, root-zone and tractor-field photographs. It includes scroll-triggered entrance motion, hover zoom and lift, animated capability ticker, interactive field-zone hover treatments, and a moving highlight effect on dashboard readings. The design respects `prefers-reduced-motion` and includes responsive layouts for mobile screens.

## Run locally

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run build
```

The sensor and multi-zone readings remain illustrative demo values. Real sensor telemetry, a trained Random Forest model, FAO-56 weather data integration, and pump/valve control require separate hardware/backend integration.

## Motion and media update

- The hero now layers a muted, looping aerial farm video behind the headline, with the existing local `hero-farm.jpg` as its poster/fallback.
- Framer Motion entrance/reveal animations and floating telemetry chips introduce the sensor and decision-engine concepts.
- Lucide React icons (`Orbit`, `Waves`, `Sparkles`, and the existing system icons) support the visual status language.
- The hero video is loaded from Pexels and therefore requires an internet connection; if it cannot load, the local poster image remains visible.
- Reduced-motion preferences disable the moving video and decorative CSS animation.

Video reference: https://www.pexels.com/video/drone-view-of-a-tractor-in-a-farm-field-15365299/


## Crop water library update

The Crop Water Library includes 50 crop profiles, search, seasonal water-use ranges (mm/season), representative Kc values, crop guidance, local save/history, and FAO reference links. The library is initialized in browser `localStorage` as `verdant-crop-library`; selected and saved profiles use `verdant-selected-crop` and `verdant-crop-history`.

**Agronomic note:** FAO seasonal ranges are used for crops where the FAO source publishes them. Remaining entries are explicitly marked as indicative planning ranges rather than verified location-specific requirements. Water demand depends on reference evapotranspiration (ETo), crop coefficient (Kc), growth stage, climate, soil, rainfall and crop duration; use local agronomy/weather inputs for operational irrigation. The site explains the FAO-56 relationship `ETc = Kc × ETo` and links to FAO sources.

Additional UI updates: typewriter hero tagline, decorated animated headings, layered sticky chapter scrolling, animated crop search results, a scrollable 50-crop library, and locally saved crop profiles.
