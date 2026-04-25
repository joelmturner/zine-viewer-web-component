# zine-web-component

## Preview

https://github.com/user-attachments/assets/b78a8912-df38-423c-aa78-4e412dadc595

## Local Development

Run `pnpm dev` to start the local development server.

## Publishing (maintainers)

Publishing runs from GitHub Actions ([`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml)).

1. Add an npm **Automation** or **Granular** token with publish access to this package as the repo secret `NPM_TOKEN` (GitHub repo → Settings → Secrets and variables → Actions).
2. Bump `version` in `package.json`, commit, and push a matching git tag (for example `v0.1.2`).
3. Create a **GitHub Release** from that tag and publish the release. The workflow publishes to npm when the release is published. You can also run the workflow manually via **Actions → Publish to npm → Run workflow**.

## Usage

Use the `zine-web-component` element in your HTML.

Add the script to the head of your page.

```html
<script
  type="module"
  src="https://unpkg.com/@joelmturner/zine-viewer-web-component?module"
></script>
```

Add an element with the `img-src` and `back-img-src` attributes for each page of the zine.

```html
<zine-viewer id="zine-viewer">
  <div
    img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/FRONT.jpg"
    back-img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/1.jpg"
  ></div>
  <div
    img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/2.jpg"
    back-img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/3.jpg"
  ></div>
  <div
    img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/4.jpg"
    back-img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/5.jpg"
  ></div>
  <div
    img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/6.jpg"
    back-img-src="https://res.cloudinary.com/joelmturner/image/upload/v1736665494/zines/pick%20me%20ups/BACK.jpg"
  ></div>
</zine-viewer>
```

### Page size (`size` attribute and CSS variables)

Each page uses `--page-width` and `--page-height` on the host (defaults match one panel of an **8-page US Letter** sheet: 4×2 landscape imposition, ~2.75×4.25 in, ratio 11:17).

Use the **`size`** attribute for common presets (ids are case-insensitive):

| `size` value     | Notes                                      |
| ---------------- | ------------------------------------------ |
| `letter-8up`     | default ratio; 8-up one-sheet Letter panel |
| `letter-half`    | same ratio as `letter-8up` (5.5×8.5 in half-sheet) |
| `a5`             | ISO A5 portrait (148×210 mm)               |
| `a6`             | ISO A6 portrait (105×148 mm)               |
| `square`         | 1:1 page                                   |
| `digest-6x9`     | 6×9 in trade / chapbook proportion         |

Omit **`size`** (or use an unknown value) to rely only on CSS: set `--page-width` and `--page-height` on `zine-viewer` yourself. If you use custom properties that way, leave `size` unset so the component does not overwrite them with inline styles.

Example:

```html
<zine-viewer size="a5"> … </zine-viewer>
```

## License

MIT
