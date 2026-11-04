# Docgen Design System

## 1. Atmosphere & Identity

A practical Indonesian document editor with white form sections, navy text,
and a green total. Preserve the existing system in
`design-system/docgen/MASTER.md`, `tailwind.config.js`, and `src/components/ui.tsx`.
The user fills a form and sees the same data in an A4 document.

## 2. Color

Use the existing Tailwind tokens: `primary` (#1E3A5F), `accent` (#059669),
`background` (#F8FAFC), `foreground` (#0F172A), `muted` (#F1F3F5),
`border` (#E4E7EB), and `destructive` (#DC2626). White is the input and paper
surface. Slate 500/600 supply secondary text. Active controls use a primary
wash and primary text; keyboard focus uses a visible primary ring.

## 3. Typography

Poppins for headings, Open Sans for body text; both are self-hosted. Form text
is `text-sm` (14px), field labels `text-xs` (12px), and supporting text
`text-xs`. Paper keeps its existing 11–13px text, with 14–15px totals.
Rich text inherits its container's font, size, color, and line height.

## 4. Spacing & Layout

Use Tailwind's 4px spacing scale. Sections stack with 16px gaps and use
16px/20px padding. Form fields use 12px gaps, 12px horizontal and 8px vertical
padding. Existing desktop editor/preview columns and mobile tabs own layout.
New controls must fit the editor at 390px and 768px without horizontal overflow.
Paper remains 210mm wide and at least 297mm tall.

## 5. Components

- `Section`: white, neutral border, 12px corners, existing subtle card shadow.
- `Field`, `Input`, `TextArea`, `Select`: existing shared primitives; disabled
  inputs use muted surfaces and reduced opacity. Every new input has a label.
- Optional amount control: separately labeled checkbox and numeric input;
  enabling restores the retained value. Disabled values do not affect totals.
- Custom adjustment: a stacked neutral row with checkbox, label, signed
  amount, and an accessible delete button. Default name in output is
  “Penyesuaian”. Add/remove controls use the existing button style.
- `RichTextEditor`: neutral border with 8px corners, a wrapping muted toolbar,
  and a white editable body with at least 96px height. Toolbar buttons use
  32px desktop / 44px touch targets, named actions, pressed states, visible
  keyboard focus, and disabled undo/redo states. Supports bold, italic,
  underline, strike, bullet and numbered lists, undo, redo, and clear format.
- Rich text output: paragraphs and lists share editor/output styles; visible
  list markers, modest paragraph spacing, and wrapping for long words.
- Recipient PIC: optional plain text directly after the recipient name;
  omit the entire line when empty.

## 6. Motion & Interaction

Retain the existing 200ms color transitions and global reduced-motion rule.
No new animations. Formatting preserves selection and updates the preview.
Saved and reset documents replace editor content without creating undo steps.
Custom amounts apply after discount and tax, in the order shown on paper.

## 7. Depth & Surface

Keep existing neutral 1px borders and `shadow-card`. Use `rounded-lg` for
inputs and toolbar controls, `rounded-xl` for sections. States use tonal
surfaces; no decorative accent stripes. Print output has no card shadow.

## 8. Accessibility Constraints & Accepted Debt

New controls require keyboard access, visible focus, labels, and pressed/
disabled states. Rich text exposes a named multiline textbox. Negative
amounts have explicit minus signs and positive amounts explicit plus signs.
Only supported text formatting is rendered; pasted or stored HTML is sanitized.
Legacy plain text remains literal, including angle brackets and newlines.
The app currently has one light theme and existing A4 scaling/print behavior;
this feature adds no theme or print-layout redesign. No new accepted debt.
