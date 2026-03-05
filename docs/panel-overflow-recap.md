# Section panel overflow on desktop — recap

## The problem

When a section panel (e.g. Press, Writing) has many entries, the content extends below the bottom of the viewport with no way to see it.

## What we tried

### 1. Scrollable panel with JS-calculated maxHeight

- Added `overflow-y: auto; scrollbar-width: none` to `.section-panel`
- Hidden scrollbar with `::-webkit-scrollbar { display: none }`
- In `showPanel`, used `requestAnimationFrame` to measure `getBoundingClientRect().top` and set `maxHeight` to remaining viewport space
- Also updated `maxHeight` in the `colLeft` scroll listener
- Added `mask-image` gradient at the top for a soft fade instead of hard clip
- **Result:** worked sometimes but scroll was unreliable — wheel events were unpredictably captured by `.col-left` (which also has `overflow-y: auto`) instead of the panel

### 2. stopPropagation on wheel events

- Added `e.stopPropagation()` on wheel events when panel had scrollable content (`p.scrollHeight > p.clientHeight`)
- **Result:** still unreliable

### 3. Virtual scroll (translate-based, no overflow)

- Removed `overflow-y: auto` from panels entirely
- Tracked `panelScrollOffset` variable, moved panel upward via `translate` on wheel events
- Content would flow freely upward over other elements (no clipping)
- **Result:** `scrollHeight` equalled `clientHeight` since there was no overflow container, so max scroll calculation was always 0. Simplified version without max worked but felt ugly.

### 4. Column padding approach

- Removed all overflow/maxHeight from panels
- When a panel was shown, measured if it overflowed the viewport and added `paddingBottom` to `.col-left` to extend the scrollable area
- Panel would scroll with the column via the existing `translate` scroll listener
- **Result:** didn't work reliably, reverted

## Where we landed

Reverted to approach 1 (scrollable panel with maxHeight). A CSS-only version was proposed but not yet tested:

```css
.section-panel {
  max-height: 85vh;
  overflow-y: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(to bottom, transparent 0%, black 0.5rem, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 0.5rem, black 100%);
}
```

This would replace the JS-calculated `maxHeight` with a fixed `85vh` in CSS — simpler, no timing issues. The `mask-image` gives a soft fade at the top when scrolling. Not yet tested.

## Current state of the files

The `template.html` still has the JS `maxHeight` approach in `showPanel` (via `requestAnimationFrame`) and in the `colLeft` scroll listener, plus the wheel `stopPropagation` block. Those should be cleaned up once a final approach is chosen.

## Key context

- `.col-left` also has `overflow-y: auto` (for bio/column scrolling), which creates competing scroll targets
- Section panels are `position: fixed` and aligned via a `translate` that accounts for `colLeft.scrollTop`
- The panel needs to scroll independently of the column
