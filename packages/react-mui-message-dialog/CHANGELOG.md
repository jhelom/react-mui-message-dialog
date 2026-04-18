# @jhelom/react-mui-message-dialog

## 1.0.13

### Patch Changes

- ffa2250: Improve `DialogTitleEx` title/header behavior for more consistent rendering and close-action handling.

## 1.0.12

### Patch Changes

- 4575725: Fix: update `index.tsx` exports for `MessageDialogProvider`, `useMessageDialog`, `MessageDialogSettings`, `DialogTitleEx`, and `DialogTitleExProps` to ensure correct type and component exports.

## 1.0.10

### Patch Changes

- Improve Next.js Turbopack SSR compatibility by switching library outputs to ESM/CJS only, adding conditional `exports`, and removing legacy `require` fallback pressure from package metadata.

## 1.0.9

### Patch Changes

- Rename `DialogTitleExProps.titleHeight` to `height` and constrain it to `number`; add `MessageDialogSettings.titleHeight` and wire it to dialog title height.

## 1.0.8

### Patch Changes

- Improve MessageDialog reliability and accessibility: resolve pending promises on popstate/unmount/reopen, add customizable close button aria-label, support configurable title height with a 40px default, and update docs/tests.

## 1.0.7

### Patch Changes

- 8e30389: fix: add autoFocus property to the OK button in MessageDialogProvider

## 1.0.6

### Patch Changes

- 4b9ab3f: Add autoFocus property to the OK button in MessageDialogProvider.

## 1.0.5

### Patch Changes

- 6bacc48: Fix: export MessageDialogSettings as a type from index.tsx to resolve build error.

## 1.0.4

### Patch Changes

- ee62c36: Add license field (MIT) to package.json.

## 1.0.3

### Patch Changes

- 104d45c: Fix: Ensure dist directory is built and included in npm package during release workflow.

## 1.0.2

### Patch Changes

- e68f830: Update: auto-generated changeset for develop branch push.
- 2a0010c: Fix: ensure CJS build and README.md are included in npm package. Update release workflow.

## 1.0.1

### Patch Changes

- 680f138: Fix: build configuration and npm package contents (add CJS build, include README.md)
