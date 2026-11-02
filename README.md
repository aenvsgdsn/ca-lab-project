# ⚡ Simple Accumulator CPU Simulator (ArchLab)

> **Computer Architecture Laboratory Project**  
> **Course:** Computer Architecture (SC-402L) · Group 19  

---

## 👨‍💻 Student & Contributor Information

* **Name:** Abdul Ahad
* **Registration Number:** 243
* **Role:** Frontend Architecture, UI/UX Design System, Dashboard Engineering & Simulator Controller Logic
* **Laboratory Team (Group 19):**
  - **Abdul Ahad** (Reg: `243`) — *Frontend Lead & UI/UX*
  - **Ibrahim Asif Malik** (Reg: `245`)
  - **Haris Aqeel** (Reg: `248`)

---

## 📖 Executive Summary & Frontend Scope

This project implements an interactive, educational **8-Cell Accumulator CPU Simulator** designed for computer architecture visualization. The frontend provides a clear, real-time graphical window into how machine instructions move through the processor, how memory is addressed, and how internal CPU registers (`PC` and `ACC`) react to every single execution cycle.

As the frontend engineer, I conceptualized, engineered, and polished the entire user interface and client-side simulation engine, transforming a static interface into a high-precision, production-grade laboratory dashboard.

---

## 🎨 1. Design System & UI/UX Architecture

### 1.1 Strict 3-Color Minimalist Palette
To avoid visual clutter and align with modern engineering dashboards (such as Linear and Vercel), I implemented a strict **60-30-10** color rule driven by native CSS Custom Properties:
* **60% Base Canvas & Surfaces:** `--bg-canvas: #f8fafc` (crisp studio background) and `--bg-surface: #ffffff` (elevated card panels).
* **30% Structural Ink & Boundaries:** `--text-primary: #0f172a` (high-contrast typography) and `--border-subtle: #e2e8f0` (clean, 1px architectural dividers).
* **10% Strategic Focus Accent:** `--accent-primary: #2563eb` (Electric Cobalt for active states, key interactive buttons, active execution chip, and register highlights).

*(Note: The stylesheet also contains ready-to-use alternative palettes including **Tech Graphite & Emerald** and **Minimalist Zinc & Signal Amber** switchable directly in `:root`.)*

### 1.2 Mathematical 8pt Layout Grid
All spacing, card paddings, element heights, and layout gaps adhere strictly to an 8-point geometric scale (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`). This eliminates arbitrary margins and ensures consistent alignment across the entire viewport.

### 1.3 Professional Typography Hierarchy
* **Primary UI Font:** **Inter** (Google Fonts) for geometric legibility and structural hierarchy.
* **Technical Monospace Font:** **JetBrains Mono** applied to memory addresses, numerical input values, register readouts, opcodes, and history logs.
* **Tabular Figure Alignment:** Configured `font-variant-numeric: tabular-nums` across all tables and counter cards to eliminate text jitter when numbers increment or change digit widths.

---

## 🖥️ 2. Frontend Component Breakdown

### 2.1 Clean Header & Brand Identity (`.topbar`)
* Displays the distinctive `μ` ArchLab monogram brand badge.
* Border-bottom architectural divider framing the top of the interface.

### 2.2 Hero & Hardware Cycle Pipeline (`.hero` & `.cycle-card`)
* Bold typography headline introducing the step-through processor concept.
* **Instruction Cycle Card:** A compact visual pipeline widget illustrating the standard RISC CPU loop:  
  `FETCH` ➔ `DECODE` ➔ `EXECUTE`.

### 2.3 Program Memory Matrix (`.memory-panel`)
* **8-Address Interactive Cell Matrix:** Addresses `00` through `07`.
* **Dynamic Form Controls:** Each cell features a customized dropdown `<select>` for opcodes (`LOAD`, `ADD`, `SUB`, `STORE`, `HALT`) and a number `<input>` for operand/immediate data values.
* **Live Active Instruction Highlighting:** The row currently pointed to by the Program Counter (`PC`) dynamically gains an illuminated Cobalt accent indicator border (`border-left: 3px solid var(--accent-primary)`), a soft blue background tint, and an inverted high-contrast address chip.
* **Memory Example Footnote:** Displays a quick-reference sample program (`LOAD 5 → ADD 3 → STORE 7 → SUB 2 → HALT`).

### 2.4 CPU State & Register Dashboard (`.cpu-panel`)
* **Symmetrical Register Cards:** 
  - **Program Counter (PC):** Monospaced 28px display showing the 2-digit zero-padded next address to read (`00`–`07`).
  - **Accumulator (ACC):** Real-time working arithmetic value.
* **Control Actions:**
  - **Step Button (`▶ Step`):** Primary action button with interactive elevation, subtle hover states, and active key depression.
  - **Reset Button (`↺ Reset`):** Secondary action button that restores CPU state without discarding user edits in memory.
* **Inline Diagnostic Console (`#status-message`):** Displays human-readable explanations of exactly what instruction executed and how the accumulator changed.

### 2.5 Execution History Ledger (`.history-panel`)
* **Full Instruction Audit Trail:** Appends a new timestamped row for every step executed.
* **Fixed Column Alignment:** Proportional widths prevent layout shift during runtime:
  - `Step` (#1, #2, ...)
  - `PC` (Zero-padded memory address)
  - `Instruction` (Opcode + Operand)
  - `ACC After` (Resulting accumulator value)
  - `Status` (Badges: `OK` or `HALTED`)
* **Empty State Handling:** Displays a clean placeholder prompt with guide hints before execution begins.

### 2.6 Lab Team Footer (`footer`)
* Symmetrical, low-contrast footer displaying project credits and student registration numbers.

---

## ⚙️ 3. Client-Side Simulator Engine (`script.js`)

Beyond visual design, I engineered the front-end controller and execution engine in pure JavaScript:

1. **State Management:**
   - Tracks `pc` (Program Counter), `acc` (Accumulator), `stepCount`, and `isHalted`.
2. **Instruction Set Architecture (ISA) Emulation:**
   - **`LOAD <val>`:** Sets Accumulator directly to the specified value (`ACC = operand`).
   - **`ADD <val>`:** Adds operand value to Accumulator (`ACC = ACC + operand`).
   - **`SUB <val>`:** Subtracts operand value from Accumulator (`ACC = ACC - operand`).
   - **`STORE <addr>`:** Writes the current Accumulator value into the designated memory address row input.
   - **`HALT`:** Locks execution, updates status indicators to halted, and prevents further stepping until reset.
3. **Reactive DOM Updates:**
   - Automatically synchronizes register values, active memory row indicators, and history logs upon each click.
4. **Decoupled Event Architecture:**
   - Emits native `CustomEvent("cpu:step")` and `CustomEvent("cpu:reset")` with complete memory snapshots so external backend modules or automated grading scripts can seamlessly hook in without modifying the frontend code.

---

## 🚀 4. How to Run Locally

You can run this project locally without any complex installation or external package managers:

### Option A: Using Python (Recommended)
Open your terminal in the project directory and run:
```bash
python -m http.server 3000
```
Then visit **[http://localhost:3000](http://localhost:3000)** in any modern web browser.

### Option B: Direct Browser Opening
Simply double-click `index.html` to open it directly in Chrome, Edge, Safari, or Firefox.

---

## 📁 5. Repository File Structure

```text
ca-lab-project/
├── index.html        # Semantic HTML5 dashboard layout & component hierarchy
├── style.css         # Complete 3-color design system, typography tokens & responsive grid
├── script.js         # Reactive simulator engine, instruction decoder & event emitter
└── README.md         # Comprehensive project documentation & frontend contribution report
```
