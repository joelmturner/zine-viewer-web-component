import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import {
  loadZinePages,
  createInitialSnapshot,
  pageIsFlipped,
  canFlipForward,
  canFlipBackward,
  flipForward,
  flipBackward,
  getZIndices,
  type BookSnapshot,
  type ZineStackDirection,
} from "./zine-book";

@customElement("zine-viewer")
class ZineViewer extends LitElement {
  @property({ type: String, attribute: "pages" })
  pagesAttr = "";

  @property({ type: Boolean, attribute: "keyboard-navigation" })
  keyboardNavigation = true;

  @property({ type: Boolean, attribute: "keyboard-navigation-focus-only" })
  keyboardNavigationFocusOnly = false;

  @property({ type: Boolean, attribute: "autoplay" })
  autoplay = false;

  @property({ type: Number, attribute: "autoplay-interval" })
  autoplayInterval = 2000;

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
      left: 0;
      right: 50%;
    }

    #next {
      left: 50%;
    }

    button {
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

  @state()
  private book: BookSnapshot = createInitialSnapshot(0);

  @state()
  private stackDirection: ZineStackDirection = "initial";

  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
  private autoplayIntervalId: number | null = null;
  private isHovering = false;

  private updateButtons() {
    if (!this.prevButton || !this.nextButton) return;
    this.prevButton.disabled = !canFlipBackward(this.book);
    this.nextButton.disabled = !canFlipForward(this.book);
  }

  private startAutoplay() {
    this.stopAutoplay();
    if (!this.autoplay || this.book.pageCount === 0 || this.isHovering) return;

    this.autoplayIntervalId = window.setInterval(() => {
      if (canFlipForward(this.book)) {
        this.flipPageForwardInternal();
      } else {
        this.stopAutoplay();
      }
    }, this.autoplayInterval);
  }

  private stopAutoplay() {
    if (this.autoplayIntervalId !== null) {
      window.clearInterval(this.autoplayIntervalId);
      this.autoplayIntervalId = null;
    }
  }

  private flipPageForwardInternal() {
    const next = flipForward(this.book);
    if (!next) return;
    this.book = next;
    this.stackDirection = "forward";
    this.updateButtons();
  }

  private flipPageForward() {
    if (!canFlipForward(this.book)) return;
    this.stopAutoplay(); // stop autoplay on manual navigation
    this.flipPageForwardInternal();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  private flipPageBackward() {
    if (!canFlipBackward(this.book)) return;
    this.stopAutoplay(); // stop autoplay on manual navigation
    const next = flipBackward(this.book);
    if (!next) return;
    this.book = next;
    this.stackDirection = "backward";
    this.updateButtons();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  private resizeContainer() {
    const container = this.shadowRoot?.querySelector(
      ".container",
    ) as HTMLElement;
    const wrapper = this.shadowRoot?.querySelector(".wrapper") as HTMLElement;
    if (!container || !wrapper) return;

    const padding = parseInt(
      getComputedStyle(this).getPropertyValue("--canvas-padding"),
    );
    const pageWidth = parseInt(
      getComputedStyle(this).getPropertyValue("--page-width"),
    );
    const pageHeight = parseInt(
      getComputedStyle(this).getPropertyValue("--page-height"),
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
    this.prevButton = this.shadowRoot?.getElementById(
      "prev",
    ) as HTMLButtonElement;
    this.nextButton = this.shadowRoot?.getElementById(
      "next",
    ) as HTMLButtonElement;

    // Initial size calculation
    this.resizeContainer();

    // Add resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      this.resizeContainer();
    });
    resizeObserver.observe(this);

    this.prevButton?.addEventListener("click", () => this.flipPageBackward());
    this.nextButton?.addEventListener("click", () => this.flipPageForward());

    // keyboard navigation handler
    this.keyboardHandler = (e: KeyboardEvent) => {
      if (!this.keyboardNavigation) return;

      // check if focus is required and component doesn't have focus
      if (this.keyboardNavigationFocusOnly && !this.matches(":focus-within")) {
        return;
      }

      // only handle arrow keys
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.flipPageBackward();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.flipPageForward();
      }
    };

    // add keyboard event listener (handler checks keyboardNavigation property)
    window.addEventListener("keydown", this.keyboardHandler);

    // add mouse hover handlers to pause/resume autoplay
    const wrapper = this.shadowRoot?.querySelector(".wrapper") as HTMLElement;
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => {
        this.isHovering = true;
        this.stopAutoplay();
      });
      wrapper.addEventListener("mouseleave", () => {
        this.isHovering = false;
        if (this.autoplay) {
          this.startAutoplay();
        }
      });
    }

    // wait for all images to load, then update buttons
    const images = Array.from(
      this.shadowRoot?.querySelectorAll("img") || [],
    ) as HTMLImageElement[];
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener("load", () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              this.updateButtons();
            }
          });
          img.addEventListener("error", () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              this.updateButtons();
            }
          });
        }
      });

      // if all images are already loaded
      if (loadedCount === totalImages) {
        this.updateButtons();
      }
    }

    this.updateButtons(); // Initial button state update

    // start autoplay if enabled
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    const pages = loadZinePages(this.pagesAttr, this);
    const n = pages.length;
    if (changedProperties.has("pagesAttr") || n !== this.book.pageCount) {
      this.book = createInitialSnapshot(n);
      this.stackDirection = "initial";
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    // re-query elements if they're not set (in case of re-render)
    if (!this.prevButton || !this.nextButton) {
      this.prevButton = this.shadowRoot?.getElementById(
        "prev",
      ) as HTMLButtonElement;
      this.nextButton = this.shadowRoot?.getElementById(
        "next",
      ) as HTMLButtonElement;
    }
    if (this.prevButton && this.nextButton && this.book.pageCount > 0) {
      this.updateButtons();
    }

    // handle autoplay property changes
    if (
      changedProperties.has("autoplay") ||
      changedProperties.has("autoplayInterval")
    ) {
      if (this.autoplay) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    }

    // keyboard navigation is handled by the handler checking the property
    // no need to add/remove listener when property changes
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // cleanup keyboard event listener
    if (this.keyboardHandler) {
      window.removeEventListener("keydown", this.keyboardHandler);
    }
    // cleanup autoplay interval
    this.stopAutoplay();
  }

  render() {
    const pages = loadZinePages(this.pagesAttr, this);
    const z = getZIndices(this.book, this.stackDirection);

    return html`
      <div
        class="wrapper"
        tabindex=${this.keyboardNavigationFocusOnly ? "0" : null}
      >
        <div class="container">
          <div class="zine">
            ${pages.map(
              page =>
                html`<div
                  class="page${pageIsFlipped(page.index, this.book)
                    ? " flipped"
                    : ""}"
                  data-page="${page.index + 1}"
                  style="z-index: ${z[page.index] ?? 0}"
                >
                  <div class="front"><img src="${page.imgSrc}" /></div>
                  <div class="back"><img src="${page.backImgSrc}" /></div>
                </div>`,
            )}
            <button id="prev" ?disabled=${!canFlipBackward(this.book)}></button>
            <button id="next" ?disabled=${!canFlipForward(this.book)}></button>
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
