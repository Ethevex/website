<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Ethevex Website — Agent Instructions

> Repository: `Ethevex/website` (private)  
> Intended public website: `https://ethevex.com`  
> Status: Confirmed MVP scope. Any unanswered visual or technical choice remains open.

## Purpose

Ethevex is the owner's independent software brand and umbrella identity for projects, software products, developer tools, libraries, and future ideas. This repository is for **the Ethevex brand website**, not an individual product, a personal portfolio, or a SaaS application.

Ethevex is a long-term brand that may grow to include products under separate domains or subdomains. **The initial website is intentionally much smaller than that long-term vision.** Do not build future features before they are requested.

## Confirmed decisions

| Area                    | Confirmed requirement                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Brand name              | Ethevex                                                                     |
| Public domain           | `ethevex.com`                                                               |
| GitHub organization     | `Ethevex`                                                                   |
| Repository              | `website` (private)                                                         |
| Hosting target          | Vercel                                                                      |
| Frontend framework      | Next.js                                                                     |
| Styling                 | Tailwind CSS                                                                |
| UI toolkit              | shadcn/ui                                                                   |
| Initial scope           | **One homepage only**                                                       |
| Default theme           | **Light**, regardless of device or browser preference                       |
| Available themes        | **Light and dark only**; never offer a system/automatic mode                |
| Light theme             | White background, black logo and black text                                 |
| Dark theme              | Black background, white logo and white text                                 |
| Theme control           | User can explicitly switch between light and dark                           |
| Logo                    | **Balanced Three Blades E** monogram, using two owner-provided SVG variants |
| Main heading            | **`Ethevex`**                                                               |
| Subtitle, exact wording | **`A domain that encompasses all`**                                         |

The owner will provide two SVG logo variants for the light and dark themes. Locate and use the files once supplied; **do not assume filenames or paths or create replacement logo art**. In light mode use the **black logo** on white; in dark mode use the **white logo** on black. Map logos by their visible color and intended theme rather than ambiguous filenames such as `light.svg` or `dark.svg`. If the SVGs are not yet present, ask for the asset paths before finalizing the site. The chosen monogram consists of three horizontally aligned blades with a shorter central blade and opposing angled terminals on the upper and lower blades.

## Initial homepage: precise content and order

The initial public-facing homepage must display, in order:

1. **Ethevex logo** — the approved Balanced Three Blades E asset.
2. **Main title:** `Ethevex`
3. **Subtitle directly below the title:** `A domain that encompasses all`

Use the exact capitalization and subtitle wording above. Do not paraphrase the subtitle, append additional marketing copy, or add a period unless the owner asks.

**The logo, title, subtitle, and a functional light/dark theme control are the entire confirmed visible content scope for version one.** Do not add product cards, a project directory, a GitHub link, navigation, About page, contact form, blog, dashboard, social links, footer copy, call-to-action buttons, or extra sections without a new instruction. A minimal theme switcher is explicitly permitted; standard non-promotional document structure and technical metadata are fine.

Do not create additional public pages at launch merely to prepare for future expansion. Keep the implementation easy to extend later without designing or implementing those future pages now.

## Visual principles

- The design should be minimal, professional, geometric, and restrained, in line with the approved logo.
- Preserve the sharp edges, proportions, and whitespace of the actual logo file.
- **Light is the default initial theme for every visitor**, even if their operating system or browser prefers dark mode.
- Light mode: **white background and black logo/text**. Dark mode: **black background and white logo/text**.
- Provide an accessible, working control to switch explicitly between **light** and **dark**. Do not expose `system`, `auto`, or a third theme option; do not automatically follow `prefers-color-scheme`.
- Swap between the two owner-supplied SVGs with the selected theme, keeping the same size, layout, and alt text.
- Keep both themes visually consistent and high contrast. Avoid flashes of the wrong theme during hydration or page load.
- Give the logo and typography enough room to remain clear on mobile and desktop.
- Prioritize accessible contrast, semantic markup, responsive typography, and fast loading.
- Avoid decorative backgrounds, gradients, illustrations, excessive motion, and unnecessary UI components unless expressly approved.

**Not yet confirmed:** exact font, precise alignment, logo dimensions, spacing, theme control placement/appearance, whether an explicit theme selection should persist across visits, and whether any animation is desired. If a choice materially affects the visual identity, ask the owner before committing to it. Don't treat examples from brainstorming as final approvals.

## Implementation and deployment

- Use **Next.js** with **Tailwind CSS** and **shadcn/ui**. Do not add packages without a concrete need.
- First inspect the repository to determine its current structure, dependencies, tooling, and asset paths.
- Follow existing conventions for routing, TypeScript, linting, package management, and other configuration. If there is no established convention and the decision matters, ask rather than asserting a prior decision.
- The page should be as simple as its requirements: it does not need authentication, a database, forms, API routes, or external services. Small client-side state is appropriate **only** for the functional light/dark theme control.
- Use semantic HTML; the title should be the main `h1`, and the subtitle should be visually placed immediately below it.
- Include sensible page metadata without adding unsupported marketing claims. Use available favicon assets when provided.
- A theme implementation must not have a `system` mode or initialize from the visitor's OS/browser preference. If using a theme library, explicitly disable system-theme detection and make the first visit light. If theme persistence is not specified, avoid assuming a particular persistence policy; confirm it before implementing cross-visit storage.
- Optimize assets appropriately, avoid layout shift, and respect accessibility and reduced-motion preferences.
- Vercel is the chosen hosting target. Do not assume the project or custom domain has already been configured in Vercel.
- Never hardcode secrets or expose private environment variables.

## Long-term architecture, not launch scope

The website may eventually serve as an entry point to multiple Ethevex products. Those products may live in independent repositories and may use their own Vercel deployments or other hosting providers. Future subdomains are possible, but **no subdomain, product integration, navigation structure, or migration has been approved for implementation**.

Keep this homepage maintainable and avoid architecture that needlessly restricts future expansion; do not pre-build a product ecosystem, multi-tenant system, or large monorepo.

## Rules for coding agents

1. Read this file and inspect existing code and assets before proposing edits.
2. Distinguish requirements explicitly confirmed by the owner from suggestions or previous brainstorming.
3. **Ask when unsure about a material choice** rather than inventing user preferences, brand copy, assets, page sections, public claims, or deployment configuration.
4. Do not invent details about an incorporated company, team size, customers, metrics, contact information, or products.
5. Treat the Balanced Three Blades E files as approved reference assets; do not overwrite them without approval.
6. Make small, reviewable changes and prefer clean, conventional components over unnecessary abstractions.
7. After implementation, run the available relevant checks (build, lint, types) and report actual results, not assumed success.

## Open questions for the owner

These questions are **not blockers to understanding the site's purpose**, but should be resolved before a final visual implementation if no established site styles already answer them:

- Should the logo and text be vertically/horizontally centered, or positioned differently?
- Is there a specific font or typographic style to use?
- Should there be any motion at all, or should the page be fully static?
- Should a visitor's explicit light/dark choice be remembered after reloading or on a future visit?
- Where should the theme control appear, and should it be an icon button or labeled switch?
- What are the actual repository paths for the two theme-specific SVG logo assets?

Do not ask about pages, product listings, or extra features at this stage: the owner has explicitly selected a **single, minimal homepage**.

## Definition of done for version one

On `ethevex.com`, a visitor initially sees a **white background**, the approved **black logo**, the title **Ethevex**, and directly beneath it the exact subtitle **A domain that encompasses all**. The visitor can switch to dark mode and see a **black background**, **white logo**, and **white text**, and can switch back to light. **There is no system/automatic theme option.** The homepage remains clear and responsive, without unrequested content. The site builds successfully, is ready to deploy to Vercel, and leaves room for future work without implementing it prematurely.
