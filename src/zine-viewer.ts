import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("zine-viewer")
class ZineViewer extends LitElement {
  static styles = css`
    :host {
    }

    * {
      box-sizing: border-box;
    }
    .container {
      font-family: "Poppin", sans-serif;
      background-color: #2e3537;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
    }
    .book {
      width: 291px;
      height: 450px;
      position: relative;
      transition-duration: 1s;
      perspective: 1500;
    }
    input {
      display: none;
    }

    .page {
      position: absolute;
      background-color: white;
      width: 291px;
      height: 430px;
      border-radius: 0 15px 15px 0;
      margin-top: 10px;
      transform-origin: left;
      transform-style: preserve-3d;
      transform: rotateY(0deg);
      transition-duration: 1.5s;
    }
    .page img {
      width: 100%;
      height: 100%;
      border-radius: 15px 0 0 15px;
    }
    .front-page {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      box-sizing: border-box;
      padding: 1rem;
    }
    .back-page {
      transform: rotateY(180deg);
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      z-index: 99;
    }
    .next,
    .prev {
      position: absolute;
      bottom: 1em;
      cursor: pointer;
    }
    .next {
      right: 1em;
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
    return html`
      <div class="container">
        <input type="checkbox" id="checkbox-page1" />
        <input type="checkbox" id="checkbox-page2" />
        <input type="checkbox" id="checkbox-page3" />
        <input type="checkbox" id="checkbox-page4" />
        <div class="book">
          <div class="page" id="page1">
            <div class="front-page">
              <img src="/src/assets/FRONT.jpg" alt="cover image" />
              <label class="next" for="checkbox-page1"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" /></svg
              ></label>
            </div>
            <div class="back-page">
              <img src="/src/assets/1.jpg" alt="cover image" />
              <label class="prev" for="checkbox-page1"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" /></svg
              ></label>
            </div>
          </div>

          <div class="page" id="page2">
            <div class="front-page">
              <img src="/src/assets/2.jpg" alt="cover image" />
              <label class="next" for="checkbox-page2"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" /></svg
              ></label>
            </div>
            <div class="back-page">
              <img src="/src/assets/3.jpg" alt="cover image" />
              <label class="prev" for="checkbox-page2"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" /></svg
              ></label>
            </div>
          </div>

          <div class="page" id="page3">
            <div class="front-page">
              <img src="/src/assets/4.jpg" alt="cover image" />
              <label class="next" for="checkbox-page3"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" /></svg
              ></label>
            </div>
            <div class="back-page">
              <img src="/src/assets/5.jpg" alt="cover image" />
              <label class="prev" for="checkbox-page3"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" /></svg
              ></label>
            </div>
          </div>

          <div class="page" id="page4">
            <div class="front-page">
              <img src="/src/assets/6.jpg" alt="cover image" />
              <label class="next" for="checkbox-page4"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" /></svg
              ></label>
            </div>
            <div class="back-page">
              <img src="/src/assets/BACK.jpg" alt="cover image" />
              <label class="prev" for="checkbox-page4"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" /></svg
              ></label>
            </div>
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
