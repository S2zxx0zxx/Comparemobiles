# CompareMobile Design System V1

## Direction

Apple-like product clarity + Linear-like hierarchy + Vercel-like precision, without copying their visual identity.

## Locked behavior

- Neutral surfaces with one controlled accent.
- Thin borders and restrained shadows.
- High information density without portal clutter.
- Large product-focused hero typography.
- Mobile bottom dock for core workflows.
- Bottom sheets/dialogs for dense mobile controls as the component library expands.
- Motion is used for state changes, layout transitions and feedback—not decoration.
- Difference highlighting is semantic and subtle; comparison pages do not become red/green spreadsheets.

## Tokens

All public color/surface tokens live in `src/app/globals.css` as CSS custom properties. Components consume tokens instead of embedding random color values.

## Accessibility

- Keyboard focus and semantic controls are required.
- Reduced-motion preference is respected globally.
- Dialog behavior uses Base UI primitives.
- Text contrast and readable hit targets are treated as release requirements.
