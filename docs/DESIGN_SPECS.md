# Kulabour Enterprise Design Specifications & Prompts

This document outlines the visual identity, AI generation prompts, and implementation requirements to achieve an **Enterprise-Grade** user interface for the Kulabour platform.

## 1. Visual Identity System

### **Core Aesthetic: "Techno-Organic Minimalism"**
A seamless blend of clean, structural layouts (Bento Grids) with organic, fluid interactive elements (Glassmorphism, 3D micro-interactions).

*   **Primary Color Palette (Premium Trust):**
    *   **Deep Royal Blue:** `#1A3B5D` (Trust, Corporate, Stability) - Used for primary actions, headers.
    *   **Vibrant Accent Orange:** `#FF6B35` (Energy, Speed, Service) - Used for CTAs, notifications, highlights.
    *   **Surface White:** `#FFFFFF` (Clarity) - Main background.
    *   **Surface Off-White:** `#F8F9FC` (Depth) - Secondary backgrounds.

*   **Typography:**
    *   **Headings:** `Plus Jakarta Sans` or `Outfit` (Modern, Geometric, Approachable).
    *   **Body:** `Inter` or `Roboto` (Highly legible at small sizes).
    *   **Scale:** Follows strict 4px grid (e.g., H1=32px, H2=24px, Body=16px).

*   **Depth & Texture:**
    *   **Glassmorphism:** `backdrop-blur-md bg-white/70 border border-white/20` (Used for floating cards, bottom sheets).
    *   **Shadows:** Soft, diffused shadows `shadow-lg shadow-indigo-500/10` (No harsh black shadows).

---

## 2. The Master "Enterprise-Level" Prompt

**Use this prompt in tools like Midjourney v6, DALL-E 3, or UIzard to generate the initial concept boards.**

> **PROMPT:**
> "High-fidelity UI/UX design for an enterprise-grade hyper-local service marketplace mobile app called 'Kulabour'. The interface should look extremely premium, rivaling Uber and Airbnb.
>
> **Style:** Modern Swiss Minimalist mixed with soft Glassmorphism.
> **Layout:** Use a 'Bento Box' grid layout for the dashboard widgets.
> **Colors:** Dominant deep royal blue (#1A3B5D) and crisp white, with vibrant orange (#FF6B35) gradient accents for 'Book Now' buttons.
> **Key Visuals:**
> 1.  **Home Screen:** A full-screen interactive map background with live 3D worker pins. A floating glass-effect search bar at the top or bottom. 3D isometric icons (clay style) for service categories like Plumbing, Cleaning, Electrician.
> 2.  **Typography:** Large, bold sans-serif headings (Inter/Jakarta Sans).
> 3.  **Lighting:** Soft, studio-quality lighting on UI elements. subtle drop shadows to create depth layers.
> **Atmosphere:** Professional, trustworthy, fast, and tech-forward. High detailed, 8k resolution, UI design masterpiece."

---

## 3. Screen-Specific Prompts (Figma/AI)

### **A. Customer Mobile App (React Native)**
*   **Context:** Instant gratification, ease of use.
*   **Prompt:**
    > "Mobile app service booking flow. Clean white card floating on a blurred map background. The card displays a worker's profile with a high-res circular photo, a '4.8 Star' rating badge in gold, and a bold 'Arriving in 10 mins' status indicator. Bottom action bar contains a slide-to-confirm button with haptic feedback visual cues. The overall vibe is clean, spacious, and reassuring."

### **B. Worker/Partner App (React Native)**
*   **Context:** High readability outdoors, quick actions.
*   **Prompt:**
    > "Worker companion app dashboard designed for outdoor visibility (High Contrast Mode). Dark mode UI foundation. Large, tappable cards for 'New Job Request' with green check and red 'x' buttons. A prominent 'Earnings Today' card at the top with a neon green sparkline chart. oversized typography for numbers. simplified navigation tabs at the bottom."

### **C. Super Admin Dashboard (Web/React)**
*   **Context:** Data density, management, analytics.
*   **Prompt:**
    > "SaaS Admin Dashboard UI for service management. Sidebar navigation with collapsible menus. The main area features a modular dashboard grid.
    > *   **Widget 1:** User growth area chart with gradient fill.
    > *   **Widget 2:** Live map showing active service agents as moving dots.
    > *   **Widget 3:** Recent transactions data table with floating row hover effects and status chips (Paid/Pending).
    > *   **Style:** Clean, flat design with 1px light gray borders and subtle gray background `#F3F4F6`. Apple Human Interface Guidelines influence."

---

## 4. Implementation Requirements Checklist "Anything Needed"

To successfully implement this enterprise design, the following assets and configurations are mandatory:

### **Technologies & Libraries**
1.  **CSS Framework:** `NativeWind` (Mobile) / `Tailwind CSS v4` (Web).
    *   *Constraint:* All spacing must be multiples of 4 (`p-4`, `m-2`).
2.  **Icons:** `Lucide-React` (Web) / `Lucide-React-Native` (Mobile).
    *   *Constraint:* Stroke width 1.5px or 2px, consistent across all screens.
3.  **3D Assets:**
    *   **Format:** `.glb` or `.gltf` (Managed by `@react-three/drei`).
    *   **Requirement:** Low-poly 3D icons for: *Plumber, Electrician, Carpenter, Painter, Cleaning, Driver*.
4.  **Backend Data:**
    *   **Map Data:** Real-time GeoJSON coordinates for worker tracking.
    *   **Charts:** Aggregated JSON data for `Recharts` (Web) and `Victory Native` or `Skia` (Mobile, if needed).

### **Design Handoff Standards**
*   **Auto-Layout:** All Figma frames **MUST** use Auto-Layout. This ensures direct translation to Flexbox (`flex`, `justify-between`, `items-center`).
*   **Variables:** Use Figma Variables for colors.
    *   `primary` -> `bg-primary-600`
    *   `surface` -> `bg-white`
    *   `text-main` -> `text-slate-900`
*   **States:** Every interactive component must have:
    *   `Default`
    *   `Hover` (Web only)
    *   `Pressed/Active` (Scale down 0.98x)
    *   `Disabled` (Opacity 0.5, grayscale)
*   **Dark Mode:** All color tokens must have a defined Dark Mode alternative (e.g., `bg-white` -> `dark:bg-slate-900`).

### **Accessibility (A11y)**
*   **Contrast:** Text must meet WCAG AA standards (4.5:1 ratio).
*   **Touch Targets:** Minimum 44x44px for all mobile interactive elements.
*   **Dynamic Type:** UI must scale if user increases system font size.
