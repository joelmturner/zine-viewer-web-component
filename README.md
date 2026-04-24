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

## License

MIT
