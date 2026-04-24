/**
 * pure zine book state + page loading for <zine-viewer>.
 * DOM/CSS stays in the Lit component; this module owns parsing and stack math.
 */

export interface ZinePage {
  imgSrc: string | null;
  backImgSrc: string | null;
  index: number;
}

export interface BookSnapshot {
  pageCount: number;
  /** 0 = cover; pageCount = all leaves flipped */
  currentPage: number;
}

export type ZineStackDirection = "forward" | "backward" | "initial";

export function loadZinePages(
  pagesAttr: string,
  fallbackHost: Element
): ZinePage[] {
  if (pagesAttr) {
    try {
      const pagesData: unknown = JSON.parse(pagesAttr);
      if (!Array.isArray(pagesData)) {
        return parsePagesFromLightDom(fallbackHost);
      }
      return pagesData.map(
        (
          page: { img: string; backImg: string } | [string, string],
          index: number
        ) => {
          if (Array.isArray(page)) {
            return { imgSrc: page[0], backImgSrc: page[1], index };
          }
          return { imgSrc: page.img, backImgSrc: page.backImg, index };
        }
      );
    } catch {
      return parsePagesFromLightDom(fallbackHost);
    }
  }
  return parsePagesFromLightDom(fallbackHost);
}

function parsePagesFromLightDom(host: Element): ZinePage[] {
  return Array.from(host.children).map((child, index) => {
    const imgSrc = child.getAttribute("img-src");
    const backImgSrc = child.getAttribute("back-img-src");
    return { imgSrc, backImgSrc, index };
  });
}

export function createInitialSnapshot(pageCount: number): BookSnapshot {
  return { pageCount, currentPage: 0 };
}

export function pageIsFlipped(
  pageIndex: number,
  snapshot: BookSnapshot
): boolean {
  return pageIndex < snapshot.currentPage;
}

export function canFlipForward(snapshot: BookSnapshot): boolean {
  return snapshot.currentPage < snapshot.pageCount;
}

export function canFlipBackward(snapshot: BookSnapshot): boolean {
  return snapshot.currentPage > 0;
}

export function flipForward(snapshot: BookSnapshot): BookSnapshot | null {
  if (!canFlipForward(snapshot)) return null;
  return {
    pageCount: snapshot.pageCount,
    currentPage: snapshot.currentPage + 1,
  };
}

export function flipBackward(snapshot: BookSnapshot): BookSnapshot | null {
  if (!canFlipBackward(snapshot)) return null;
  return {
    pageCount: snapshot.pageCount,
    currentPage: snapshot.currentPage - 1,
  };
}

/** z-index for each page index; mirrors legacy updateZIndices branches */
export function getZIndices(
  snapshot: BookSnapshot,
  direction: ZineStackDirection
): number[] {
  const { pageCount, currentPage } = snapshot;
  const useForward = direction !== "backward";
  const out: number[] = [];
  for (let index = 0; index < pageCount; index++) {
    out.push(
      useForward
        ? forwardZIndex(pageCount, currentPage, index)
        : backwardZIndex(pageCount, currentPage, index)
    );
  }
  return out;
}

function forwardZIndex(
  pageCount: number,
  currentPage: number,
  index: number
): number {
  if (index === 0 && currentPage <= 1) {
    return pageCount + 1;
  }
  if (index < currentPage) {
    return pageCount - (currentPage - index);
  }
  return pageCount - index;
}

function backwardZIndex(
  pageCount: number,
  currentPage: number,
  index: number
): number {
  if (index === pageCount - 1 && currentPage >= pageCount - 1) {
    return pageCount + 1;
  }
  if (index === currentPage) {
    return pageCount;
  }
  if (index < currentPage) {
    return index;
  }
  return pageCount - index;
}
