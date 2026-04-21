<!-- RHT-NAV PR template. Respect CLAUDE.md: never fabricate data. -->

## Summary

<!-- What this PR changes, in 1–3 sentences. -->

## Type of change

- [ ] Data refresh (cite vintage + source below)
- [ ] New state scaffold
- [ ] UI / UX
- [ ] Simulation / assumptions
- [ ] Infrastructure / tooling / CI
- [ ] Documentation only

## Data integrity checklist

<!-- REQUIRED for any PR that touches src/data/**, prisma/seed.cjs, or renders a number. -->

- [ ] Every new or changed numeric value is traceable to a cited primary source.
- [ ] Each value carries `source`, `sourceUrl`, `vintage`, and `retrievedOn`.
- [ ] No numeric constant in this diff was produced by an LLM.
- [ ] Missing values are rendered via `<DataComingSoon />`, not estimated.
- [ ] Tribal-health data respects small-cell suppression (n >= 11).
- [ ] `src/components/module-sources.tsx` reflects every new source used.

### Sources cited in this PR

| Field | Source | URL | Vintage | Retrieved |
| ----- | ------ | --- | ------- | --------- |
|       |        |     |         |           |

## Accessibility

- [ ] Keyboard-reachable in logical order
- [ ] Meets WCAG 2.2 AA contrast
- [ ] Icon-only controls have `aria-label`
- [ ] Map views include a textual fallback

## Testing

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test:simulation`
- [ ] `npm run test:e2e` (if UI changed)

## Related

<!-- Issues, prior PRs, or data-refresh cadence this belongs to. -->
