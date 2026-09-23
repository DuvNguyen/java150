---
version: alpha
name: Financial Times
description: Salmon-pink paper. Claret ink. Market authority.
colors:
  primary: "#33302E"
  secondary: "#807973"
  tertiary: "#990F3D"
  neutral: "#FFF1E5"
  surface: "#FFF9F4"
  on-primary: "#FFFFFF"
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 4.25rem
    fontWeight: 500
    letterSpacing: "-0.015em"
  h1:
    fontFamily: Playfair Display
    fontSize: 2.5rem
    fontWeight: 500
  body:
    fontFamily: Source Serif 4
    fontSize: 1.02rem
    lineHeight: 1.6
  label:
    fontFamily: IBM Plex Sans
    fontSize: 0.72rem
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  sm: 0px
  md: 2px
  lg: 4px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 24px
---

## Overview

Financial Times: the pink broadsheet — a warm salmon page, charcoal serif body, and a claret accent reserved for the one thing worth clicking. Numbers set in tabular figures.

## Colors

The palette is built around high-contrast neutrals and a single accent that drives interaction.

- **Primary (`#33302E`):** Headlines and core text.
- **Secondary (`#807973`):** Borders, captions, and metadata.
- **Tertiary (`#990F3D`):** The sole driver for interaction. Reserve it.
- **Neutral (`#FFF1E5`):** The page foundation.

## Typography

- **display:** Playfair Display 4.25rem
- **h1:** Playfair Display 2.5rem
- **body:** Source Serif 4 1.02rem
- **label:** IBM Plex Sans 0.72rem

## Do's and Don'ts

- **Do** use Tertiary for exactly one action per screen.
- **Do** let Neutral carry the composition — negative space is a feature.
- **Do** keep button dimensions and text fixed during interaction — avoid changing button labels to transient states (e.g. "Đang kích hoạt...") if it causes layout shift or button resizing.
- **Do** ensure form controls (text inputs, time/date pickers, dropdowns) and their adjacent action buttons share the exact same height (e.g. 32px), box-sizing, and vertical alignment.
- **Don't** introduce gradients. This system is flat on purpose.
- **Don't** mix Tertiary with alternate accents; the single-accent rule is load-bearing.
- **Don't** use icons — anywhere. No emoji, no icon fonts, no SVG icon libraries. Labels and text carry the full communicative load. Buttons, actions, and states are expressed through typography and color only.
- **Don't** add arbitrary status alert boxes/banners (e.g. success banners) for actions that already trigger natural system feedback or where state is obvious.

