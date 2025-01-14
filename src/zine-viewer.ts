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
      --page-bg-color: transparent;
      --transition-duration: 1s;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 600px;
      margin: 0;
      background: var(--canvas-bg-color);
      font-family: Arial, sans-serif;
    }

    .zine {
      position: relative;
      width: calc(var(--page-width));
      height: calc(var(--page-height));
      perspective: 1500px;
    }

    .page {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: left;
      transform-style: preserve-3d;
      transition: transform var(--transition-duration);
    }

    .page.flipped {
      transform: rotateY(-180deg);
    }

    .page > div {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2em;
      background: var(--page-bg-color);
      border: 1px solid #ccc;
    }

    .front {
      background-color: #fdf6e3;
      border-radius: 0 var(--page-border-radius) var(--page-border-radius) 0;
      overflow: hidden;
    }

    .back {
      transform: rotateY(180deg);
      background-color: #eee;
      border-radius: var(--page-border-radius) 0 0 var(--page-border-radius);
      overflow: hidden;
    }

    #next,
    #prev {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
    }

    #prev {
      left: -100%;
    }

    #next {
      right: 0;
    }

    button {
      padding: 10px 20px;
      margin: 0 10px;
      border: none;
      background-color: transparent;
      font-size: 16px;
      cursor: pointer;
      z-index: 10;
    }

    button:disabled {
      cursor: not-allowed;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `;

  currentPage = 0;

  firstUpdated() {
    const pages = Array.from(this.shadowRoot?.querySelectorAll(".page") || []);
    const prevButton = this.shadowRoot?.getElementById("prev");
    const nextButton = this.shadowRoot?.getElementById("next");

    const updateButtons = () => {
      (prevButton as HTMLButtonElement).disabled = this.currentPage === 0;
      (nextButton as HTMLButtonElement).disabled =
        this.currentPage === pages.length;
    };

    const flipPage = (forward: boolean) => {
      if (forward) {
        pages[this.currentPage].classList.add("flipped");
        (pages[this.currentPage] as HTMLElement).style.zIndex =
          this.currentPage + 6 + "";
        this.currentPage++;
      } else {
        this.currentPage--;
        pages[this.currentPage].classList.remove("flipped");
        (pages[this.currentPage] as HTMLElement).style.zIndex =
          5 - this.currentPage + "";
      }
      updateButtons();
    };

    prevButton!.addEventListener("click", () => flipPage(false));
    nextButton!.addEventListener("click", () => flipPage(true));

    updateButtons(); // Initial button state update
  }

  render() {
    const pages = Array.from(this.children).map((child, index) => {
      const imgSrc = child.getAttribute("img-src");
      const backImgSrc = child.getAttribute("back-img-src");
      return { imgSrc, backImgSrc, index };
    });

    return html`
      <div class="container">
        <div class="zine">
          ${pages.map(
            page => html`<div
              class="page"
              data-page="${page.index + 1}"
              style="z-index: ${5 - page.index}"
            >
              <div class="front"><img src="${page.imgSrc}" /></div>
              <div class="back"><img src="${page.backImgSrc}" /></div>
            </div>`
          )}
          <button id="prev"></button>
          <button id="next"></button>
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
