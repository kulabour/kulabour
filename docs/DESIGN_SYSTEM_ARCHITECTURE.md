# Kulabour Enterprise Design System Architecture (IEDSA)

**Version:** 1.0.0
**Status:** DRAFT
**Author:** Principal Product Architect

---

## 1. Executive Summary
This document establishes the architectural foundation for the Kulabour Design System ("KDS"). It dictates the strict standards required to achieve an enterprise-level user experience comparable to Microsoft Fluent or Salesforce Lightning. The goal is **Scalability**, **Consistency**, and **Inclusivity**.

## 2. Design Token Taxonomy
We move away from "Hardcoded Hex Values" to a 3-tier token architecture.

### **Tier 1: Global Tokens (Primitive)**
*Raw values. Context-agnostic.*
- `Blue-500`: `#1A3B5D`
- `Orange-500`: `#FF6B35`
- `Neutral-900`: `#0F172A`
- `Spacing-4`: `16px`

### **Tier 2: Alias Tokens (Semantic)**
*Describes intent. The layer where "Theming" happens.*
- `color-brand-primary`: `{Blue-500}`
- `color-action-primary-hover`: `{Blue-600}`
- `color-surface-base`: `{Neutral-0}`
- `color-text-primary`: `{Neutral-900}`

### **Tier 3: Component Tokens (Specific)**
*Mapped to explicit UI elements.*
- `button-primary-bg`: `{color-brand-primary}`
- `input-border-error`: `{color-feedback-error}`

> **Implementation Rule:** Developers MUST NEVER use raw hex codes or strict pixel values in components. Always import from the `theme` object.

---

## 3. Spatial System & Layout

### **The 8pt Grid (Hard Constraint)**
All padding, margins, and sizing must align to an 8px grid (0.5rem).
- `xs`: 4px (Icon spacing)
- `sm`: 8px (Component stacking)
- `md`: 16px (Card padding)
- `lg`: 24px (Section gap)
- `xl`: 32px (Container gap)

### **Z-Index Registry**
Prevent "Z-Index Wars" by defining strict layers:
- `layer-toast`: 9000 (Notifications)
- `layer-modal`: 8000 (Dialogs)
- `layer-overlay`: 7000 (Backdrops)
- `layer-dropdown`: 6000 (Popovers)
- `layer-sticky`: 100 (Sticky Headers)
- `layer-base`: 0 (Content)

---

## 4. Interaction Physics (Motion)**
Enterprise apps feel "solid" yet "responsive". We reject linear animations.
*   **Duration:** Quick (100ms-300ms).
*   **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (Standard "Spring-like" feel).
*   **Reduced Motion:** All animations must respect `prefers-reduced-motion`.

---

## 5. Accessibility (a11y) Standards - WCAG 2.1 AA
**Mandatory for MVP:**
1.  **Focus Rings:** Visible, high-contrast focus rings (3px solid Blue-500) on ALL interactive elements.
2.  **Touch Targets:** Minimum **44x44dp** on mobile. Exceptions require Principal approval.
3.  **Text Scaling:** UI must not break at **200%** text zoom.
4.  **Semantic HTML/JSX:**
    - Buttons are `<button>` (or `Pressable role="button"`), not `<div>`.
    - Headings follow `h1` -> `h6` hierarchy.

---

## 6. Internationalization (i18n) Readiness
*   **RTL Support:** Use logic properties (`marginStart` instead of `marginLeft`).
*   **String Expansion:** Design UI with 30% buffer space for longer languages (e.g., German/Hindi).

---

## 7. Component Lifecycle States
Every interactive component must explicitly define styles for these 6 states:
1.  **Rest/Default**
2.  **Hover** (Desktop only)
3.  **Active/Pressed** (Scale 0.98, darkened background)
4.  **Focus** (Keyboard navigation)
5.  **Disabled** (Opacity 0.4, `not-allowed` cursor, no pointer events)
6.  **Loading** (Skeleton or Spinner overlay - never shift layout)

---

## 8. File Structure Recommendation
To support this architecture, the `mobile-app` folder should evolve:
```
mobile-app/
├── components/
│   ├── primitives/    # (Atoms: Box, Text, Icon)
│   ├── design-system/ # (Molecules: Button, Input, Card)
│   └── business/      # (Organisms: BookingCard, UserProfile)
├── theme/
│   ├── tokens.ts      # The source of truth
│   └── index.ts       # NativeWind config
└── utils/
    └── a11y.ts        # Accessibility helpers
```
