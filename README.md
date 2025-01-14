# zine-web-component

## Local Development

Run `pnpm dev` to start the local development server.

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
