import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("zine-viewer")
class ZineViewer extends LitElement {
  static styles = css`
    :host {
      --canvas-bg-color: transparent;
      --page-width: 291px;
      --page-height: 450px;
      --page-border-radius: 15px;
      --page-color: #111;
      --page-bg-color: #fff;
      --transition-duration: 1s;
    }

    * {
      box-sizing: border-box;
    }
    .container {
      background-color: var(--canvas-bg-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
    }
    .book {
      width: var(--page-width);
      height: var(--page-height);
      position: relative;
      transition-duration: var(--transition-duration);
      perspective: 1500;
    }
    input {
      display: none;
    }
    .page {
      position: absolute;
      background-color: white;
      width: var(--page-width);
      height: var(--page-height);
      border-radius: 0 var(--page-border-radius) var(--page-border-radius) 0;
      transform-origin: left;
      transform-style: preserve-3d;
      transform: rotateY(0deg);
      transition-duration: var(--transition-duration);
    }
    .page img {
      width: 100%;
      height: 100%;
      border-radius: var(--page-border-radius) 0 0 var(--page-border-radius);
    }
    .front-page,
    .back-page {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
    }
    .front-page img {
      border-radius: 0 var(--page-border-radius) var(--page-border-radius) 0;
    }
    .back-page {
      transform: rotateY(180deg);
      z-index: 99;
    }

    .next,
    .prev {
      position: absolute;
      width: 5rem;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }
    .next {
      right: 0;
    }
    .prev {
      left: 1em;
    }
    #page1 {
      z-index: 4;
    }
    #page2 {
      z-index: 3;
    }
    #page3 {
      z-index: 2;
    }
    #page4 {
      z-index: 1;
    }

    #checkbox-page1:checked ~ .book #page1 {
      transform: rotateY(-180deg);
      z-index: 1;
    }
    #checkbox-page2:checked ~ .book #page2 {
      transform: rotateY(-180deg);
      z-index: 2;
    }
    #checkbox-page3:checked ~ .book #page3 {
      transform: rotateY(-180deg);
      z-index: 3;
    }
    #checkbox-page4:checked ~ .book #page4 {
      transform: rotateY(-180deg);
      z-index: 4;
    }
  `;

  render() {
    const pages = Array.from(this.children).map((child, index) => {
      const imgSrc = child.getAttribute("img-src");
      const backImgSrc = child.getAttribute("back-img-src");
      return { imgSrc, backImgSrc, index };
    });

    // Set the total number of pages
    // console.log("Total Pages:", pages.length);
    // this.style.setProperty("--total-pages", pages.length.toString());

    return html`
      <div class="container">
        ${pages.map(
          (_, index) =>
            html` <input type="checkbox" id="checkbox-page${index + 1}" />`
        )}
        <div class="book">
          ${pages.map(
            (page, index) => html`
              <div class="page" id="page${index + 1}">
                <div class="front-page">
                  <img src="${page.imgSrc}" alt="cover image" />
                  <label class="next" for="checkbox-page${index + 1}"> </label>
                </div>
                <div class="back-page">
                  <img src="${page.backImgSrc}" alt="cover image" />
                  <label class="prev" for="checkbox-page${index + 1}"> </label>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

export { ZineViewer };
declare global {
  interface HTMLElementTagNameMap {
    "zine-viewer": ZineViewer;
  }
}
