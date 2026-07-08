# 🗺️ Kuli Platform - Diátaxis Coverage Map

This document maps all existing Kuli documentation into the [Diátaxis Framework](https://diataxis.fr/) quadrants. This makes it instantly obvious to engineering and product teams where our documentation gaps are.

## The Matrix

| Document | Type | Quadrant | Status |
| :--- | :--- | :--- | :--- |
| `01_PRD.md` | Product Requirements | 🧠 **Explanation** | ✅ Healthy |
| `02_TRD.md` | Technical Architecture | 📚 **Reference** | ✅ Healthy |
| `03_APP_FLOW.md` | User Journeys | 🧠 **Explanation** | ✅ Healthy |
| `04_UI_UX_BRIEF.md` | Design System | 📚 **Reference** | ✅ Healthy |
| `05_BACKEND_SCHEMA.md`| Database Models | 📚 **Reference** | ✅ Healthy |
| `06_IMPLEMENTATION_PLAN.md`| Execution Steps | 📚 **Reference** | ✅ Healthy |
| `07_ANDROID_BUILD_DEPLOYMENT_GUIDE.md` | APK Generation | 🛠️ **How-To Guide** | ✅ Healthy |
| `08_TUTORIAL_LOCAL_SETUP.md` | Developer Onboarding | 🎓 **Tutorial** | ✅ Healthy |
| `kuli-backend/README.md` | API Overview | 📚 **Reference** | ✅ Healthy |
| `kuli-app/README.md` | Mobile Overview | 📚 **Reference** | ✅ Healthy |

---

## 🚨 Coverage Analysis & Identified Gaps

### 1. Tutorials (Learning-Oriented) ✅ HEALTHY
We have successfully bridged our critical gap by creating `08_TUTORIAL_LOCAL_SETUP.md`. New engineers now have a step-by-step guide to clone the repo, boot Docker, run migrations, and connect their physical device via Expo.

### 2. How-To Guides (Problem-Oriented) ⚠️ NEEDS WORK
We have one fantastic guide for Android deployment, but we are missing guides for common operational problems.
> **Required Docs:**
> - `docs/HOWTO_ADD_DATABASE_MIGRATION.md` (How to safely alter the Prisma schema and push).
> - `docs/HOWTO_TEST_WEBHOOKS.md` (How to trigger the Razorpay webhook locally without a live payment).

### 3. Reference (Information-Oriented) ✅ HEALTHY
Our reference documentation is incredibly strong. The `TRD`, `BACKEND_SCHEMA`, and `UI_UX_BRIEF` provide exact specifications for the system's current state. 

### 4. Explanation (Understanding-Oriented) ✅ HEALTHY
The `PRD` and `APP_FLOW` documents perfectly explain *why* Kuli exists, the socio-economic context of the Indian labor market, and the design choices made to accommodate it.

## Conclusion for Next PR
Before launching into production, we must write a **Local Setup Tutorial** so that other developers can actually onboard onto the Kuli project.
