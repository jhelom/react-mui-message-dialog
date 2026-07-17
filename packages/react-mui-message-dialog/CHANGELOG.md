# @jhelom/react-mui-message-dialog

## 1.0.17

### Patch Changes

- Fix ESM bundling for Next.js Turbopack by externalizing `react/*` and `react-dom/*` subpath imports, preventing dynamic `require` runtime stubs from being emitted in `dist/index.es.js`.

## 1.0.16

### Patch Changes

- Restore `package.json` `main` to `./dist/index.es.js` to keep the package root aligned with the ESM entry.

## 1.0.15

### Patch Changes

- Export `MessageDialogType` from the public package entry so consumers can use it without deep imports blocked by `exports`.
- Document the `MessageDialogType` type-only import in the README.
- Externalize `@mui/material/*` and `@mui/icons-material/*` subpaths during library bundling for safer npm publishing.

## 1.0.14

### Patch Changes

- Add `closeOnBackdropClick` setting and per-call dialog options (`title`, `okText`, `closeOnBackdropClick`) for `alert` / `error`, plus `cancelText` override for `confirm`.
- Refine package publish metadata (`exports`, CJS/ESM entrypoints, `prepack`, bundled `LICENSE` / `CHANGELOG.md`) for safer npm distribution.

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
