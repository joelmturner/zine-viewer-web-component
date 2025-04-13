import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("zine-viewer")
class ZineViewer extends LitElement {
  static styles = css`
    :host {
      --canvas-bg-color: transparent;
      --canvas-padding: 25px;
      --page-width: 291px;
      --page-height: 450px;
      --spread-width: calc(var(--page-width) * 2);
      --page-border-radius: 5%;
      --page-color: #111;
      --page-bg-color: transparent;
      --transition-duration: 1s;
      display: block;
      width: 100%;
      height: 100%;
    }

    * {
      box-sizing: border-box;
    }

    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--canvas-padding);
    }

    .container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      margin: 0 auto;
      background: var(--canvas-bg-color);
      font-family: Arial, sans-serif;
      border-radius: var(--page-border-radius);
    }

    .zine {
      position: relative;
      width: 100%;
      height: 100%;
      perspective: calc(var(--page-width) * 5);
    }

    .page {
      position: absolute;
      right: 0;
      width: 50%;
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
    }

    .front {
      background-color: #fdf6e3;
      overflow: hidden;
      & img {
        border-radius: 0 var(--page-border-radius) var(--page-border-radius) 0;
      }
    }

    .back {
      transform: rotateY(180deg);
      background-color: #eee;
      overflow: hidden;
      & img {
        border-radius: var(--page-border-radius) 0 0 var(--page-border-radius);
      }
    }

    #next,
    #prev {
      position: absolute;
      width: 50%;
      height: 100%;
      top: 0;
      bottom: 0;
    }

    #prev {
      left: -25%;
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
      border: 1px solid #ccc;
    }
  `;

  currentPage = 0;

  private resizeContainer() {
    const container = this.shadowRoot?.querySelector(
      ".container"
    ) as HTMLElement;
    const wrapper = this.shadowRoot?.querySelector(".wrapper") as HTMLElement;
    if (!container || !wrapper) return;

    const padding = parseInt(
      getComputedStyle(this).getPropertyValue("--canvas-padding")
    );
    const pageWidth = parseInt(
      getComputedStyle(this).getPropertyValue("--page-width")
    );
    const pageHeight = parseInt(
      getComputedStyle(this).getPropertyValue("--page-height")
    );
    const spreadWidth = pageWidth * 2;

    const availableWidth = wrapper.clientWidth - padding * 2;
    const availableHeight = wrapper.clientHeight - padding * 2;

    const widthScale = availableWidth / spreadWidth;
    const heightScale = availableHeight / pageHeight;
    const scale = Math.min(widthScale, heightScale);

    container.style.width = `${spreadWidth * scale}px`;
    container.style.height = `${pageHeight * scale}px`;
  }

  firstUpdated() {
    const pages = Array.from(this.shadowRoot?.querySelectorAll(".page") || []);
    const prevButton = this.shadowRoot?.getElementById("prev");
    const nextButton = this.shadowRoot?.getElementById("next");

    // Initial size calculation
    this.resizeContainer();

    // Add resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      this.resizeContainer();
    });
    resizeObserver.observe(this);

    const updateButtons = () => {
      (prevButton as HTMLButtonElement).disabled = this.currentPage === 0;
      (nextButton as HTMLButtonElement).disabled =
        this.currentPage === pages.length;
    };

    const updateZIndices = (isForward: boolean) => {
      pages.forEach((page, index) => {
        let zIndex;
        if (isForward) {
          if (index === 0 && this.currentPage <= 1) {
            zIndex = pages.length + 1;
          } else if (index < this.currentPage) {
            // Pages that have been turned
            zIndex = pages.length - (this.currentPage - index);
          } else {
            // Pages that haven't been turned yet
            zIndex = pages.length - index;
          }
        } else {
          // When paging backward, reverse the z-index order
          if (
            index === pages.length - 1 &&
            this.currentPage >= pages.length - 1
          ) {
            zIndex = pages.length + 1;
          } else if (index === this.currentPage) {
            // Current page gets highest z-index
            zIndex = pages.length;
          } else if (index < this.currentPage) {
            // Pages that have been unflipped get lower z-indices
            zIndex = index;
          } else {
            // Unturned pages get z-indices in reverse order
            zIndex = pages.length - index;
          }
        }
        (page as HTMLElement).style.zIndex = zIndex.toString();
      });
    };

    const flipPage = (forward: boolean) => {
      if (forward) {
        pages[this.currentPage].classList.add("flipped");
        this.currentPage++;
      } else {
        this.currentPage--;
        pages[this.currentPage].classList.remove("flipped");
      }
      updateZIndices(forward);
      updateButtons();
    };

    prevButton!.addEventListener("click", () => flipPage(false));
    nextButton!.addEventListener("click", () => flipPage(true));

    updateZIndices(true); // Initial z-index setup (assuming forward direction)
    updateButtons(); // Initial button state update
  }

  render() {
    const pages = Array.from(this.children).map((child, index) => {
      const imgSrc = child.getAttribute("img-src");
      const backImgSrc = child.getAttribute("back-img-src");
      return { imgSrc, backImgSrc, index };
    });

    return html`
      <div class="wrapper">
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
