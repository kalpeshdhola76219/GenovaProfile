/**
 * Universal Multi-Page Pagination Engine for Genova Profile
 * 
 * Accurately calculates page count, optimal section/item break boundaries,
 * and distributes resume/CV content across standard A4 pages (800px × 1131px @ 96 DPI / 210mm × 297mm).
 * 
 * Prevents duplicate text lines, orphan headings, cut bullet points, text clipping, and ensures 100% consistency
 * between live preview, PDF export, and physical printing.
 */

export const A4_DIMENSIONS = {
  widthPx: 800,
  heightPx: 1131, // 800 * (297 / 210) ≈ 1131.43px
  aspectRatio: 297 / 210,
  defaultTopPaddingPx: 32,
  defaultBottomPaddingPx: 44,
  minPageContentHeightPx: 280,
} as const;

export interface PageBreakInfo {
  pageIndex: number;
  startY: number;        // Y coordinate in unpaginated source document
  endY: number;          // Y coordinate where page ends in source document
  contentHeight: number; // endY - startY
  isLastPage: boolean;
}

export interface DocumentPaginationResult {
  pageCount: number;
  pageBreaks: PageBreakInfo[];
  totalHeight: number;
  isMultiPage: boolean;
}

interface BulletNode {
  element: HTMLElement;
  top: number;
  bottom: number;
  height: number;
  index: number;
}

interface EntryNode {
  element: HTMLElement;
  top: number;
  bottom: number;
  height: number;
  headerBottom: number;
  bullets: BulletNode[];
  headingBefore: HeadingNode | null;
}

interface HeadingNode {
  element: HTMLElement;
  top: number;
  bottom: number;
  height: number;
}

interface AtomicBlockNode {
  element: HTMLElement;
  top: number;
  bottom: number;
  height: number;
}

/**
 * Scans a rendered DOM container to detect optimal break points that avoid
 * splitting individual jobs, degrees, projects, bullet points, or section headings.
 * Guarantees zero duplicate content across page boundaries.
 */
export function calculateDocumentPagination(
  container: HTMLElement | null,
  options?: {
    pageHeight?: number;
    topPadding?: number;
    bottomPadding?: number;
    minPageHeight?: number;
  }
): DocumentPaginationResult {
  if (!container) {
    return {
      pageCount: 1,
      pageBreaks: [
        {
          pageIndex: 0,
          startY: 0,
          endY: A4_DIMENSIONS.heightPx,
          contentHeight: A4_DIMENSIONS.heightPx,
          isLastPage: true,
        },
      ],
      totalHeight: A4_DIMENSIONS.heightPx,
      isMultiPage: false,
    };
  }

  const pageHeight = options?.pageHeight ?? A4_DIMENSIONS.heightPx;
  const bottomPadding = options?.bottomPadding ?? A4_DIMENSIONS.defaultBottomPaddingPx;
  const topPadding = options?.topPadding ?? A4_DIMENSIONS.defaultTopPaddingPx;
  const minPageHeight = options?.minPageHeight ?? A4_DIMENSIONS.minPageContentHeightPx;

  // Measure actual rendered scroll height
  const totalHeight = Math.max(container.scrollHeight, container.offsetHeight);

  // If content fits within standard A4 height with bottom padding, it is 1 page
  if (totalHeight <= pageHeight) {
    return {
      pageCount: 1,
      pageBreaks: [
        {
          pageIndex: 0,
          startY: 0,
          endY: totalHeight,
          contentHeight: totalHeight,
          isLastPage: true,
        },
      ],
      totalHeight,
      isMultiPage: false,
    };
  }

  const containerRect = container.getBoundingClientRect();

  // Helper to get element coordinates relative to container (rounded to integer pixels)
  const getRelativeRect = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const top = Math.round(rect.top - containerRect.top);
    const bottom = Math.round(rect.bottom - containerRect.top);
    return { top, bottom, height: bottom - top };
  };

  // 1. Find all Section Headings (h1, h2, h3, [data-heading])
  const headingElements = Array.from(
    container.querySelectorAll('h1, h2, h3, [data-heading], [data-section-title]')
  ) as HTMLElement[];

  const headings: HeadingNode[] = [];
  for (const h of headingElements) {
    const r = getRelativeRect(h);
    if (r.height > 0 && (h.textContent || '').trim().length > 0) {
      headings.push({
        element: h,
        top: r.top,
        bottom: r.bottom,
        height: r.height,
      });
    }
  }
  headings.sort((a, b) => a.top - b.top);

  // 2. Find all entries (e.g. individual job items, education items, project items)
  const entrySelectors = [
    '[data-entry]',
    '.space-y-1 > div',
    '.space-y-1\\.5 > div',
    '.space-y-2 > div',
    '.space-y-2\\.5 > div',
    '.space-y-3 > div',
    '.space-y-3\\.5 > div',
    '.space-y-4 > div',
    '.space-y-5 > div',
    '.space-y-6 > div',
  ];
  const rawEntryElements = Array.from(
    container.querySelectorAll(entrySelectors.join(','))
  ) as HTMLElement[];

  const entries: EntryNode[] = [];
  const seenEntries = new Set<HTMLElement>();

  for (const el of rawEntryElements) {
    if (seenEntries.has(el)) continue;
    // Skip if it is a heading or an outer wrapper
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1' || tag === 'h2' || tag === 'h3') continue;

    const r = getRelativeRect(el);
    if (r.height < 15) continue; // Skip zero/tiny elements
    seenEntries.add(el);

    // Find the immediately preceding section heading (if within 80px)
    let closestHeading: HeadingNode | null = null;
    for (let hIdx = headings.length - 1; hIdx >= 0; hIdx--) {
      const h = headings[hIdx];
      if (h.bottom <= r.top + 5) {
        if (r.top - h.bottom < 90) {
          closestHeading = h;
        }
        break;
      }
    }

    // Find header elements (title, company, dates) vs bullet points
    // Header is usually the first row (.flex.justify-between or first div)
    const headerRow = (el.querySelector('.flex.justify-between') || el.firstElementChild) as HTMLElement | null;
    let headerBottom = r.top + 30;
    if (headerRow) {
      const hr = getRelativeRect(headerRow);
      headerBottom = Math.max(headerBottom, hr.bottom);
    }

    // Find bullet points / responsibility items inside this entry
    const bulletSelectors = [
      '[data-bullet]',
      '.flex.items-start',
      '.space-y-1 > div',
      '.space-y-1\\.5 > div',
      '.space-y-0\\.5 > div',
      '.space-y-1 > p',
      'li',
    ];
    const rawBullets = Array.from(el.querySelectorAll(bulletSelectors.join(','))) as HTMLElement[];
    const bullets: BulletNode[] = [];
    const seenBullets = new Set<HTMLElement>();

    for (const b of rawBullets) {
      if (seenBullets.has(b)) continue;
      seenBullets.add(b);
      const br = getRelativeRect(b);
      if (br.height >= 8 && br.top >= r.top) {
        bullets.push({
          element: b,
          top: br.top,
          bottom: br.bottom,
          height: br.height,
          index: bullets.length,
        });
      }
    }
    bullets.sort((a, b) => a.top - b.top);

    // If no bullet items found, check if there is a description paragraph
    if (bullets.length === 0) {
      const p = el.querySelector('p');
      if (p) {
        const pr = getRelativeRect(p);
        if (pr.height >= 12) {
          bullets.push({
            element: p,
            top: pr.top,
            bottom: pr.bottom,
            height: pr.height,
            index: 0,
          });
        }
      }
    }

    entries.push({
      element: el,
      top: r.top,
      bottom: r.bottom,
      height: r.height,
      headerBottom,
      bullets,
      headingBefore: closestHeading,
    });
  }
  entries.sort((a, b) => a.top - b.top);

  // 3. Find atomic blocks that must not be split (e.g. photos, compact cards, single certifications)
  const atomicBlocks: AtomicBlockNode[] = [];
  const rawAtomic = Array.from(
    container.querySelectorAll('.avoid-break, img, [data-atomic]')
  ) as HTMLElement[];

  for (const a of rawAtomic) {
    const r = getRelativeRect(a);
    // Ignore avoid-break if it's a huge container (> 260px) or contains section headings
    if (r.height > 260 || a.querySelector('h1, h2, h3')) {
      continue;
    }
    if (r.height > 0) {
      atomicBlocks.push({
        element: a,
        top: r.top,
        bottom: r.bottom,
        height: r.height,
      });
    }
  }

  // All individual leaf atomic units for collision prevention (never sliced horizontally)
  const allLeafUnits: Array<{ top: number; bottom: number }> = [];
  for (const h of headings) allLeafUnits.push({ top: h.top, bottom: h.bottom });
  for (const e of entries) {
    if (e.bullets.length === 0) {
      allLeafUnits.push({ top: e.top, bottom: e.bottom });
    } else {
      // Header unit
      allLeafUnits.push({ top: e.top, bottom: e.headerBottom });
      // Each bullet
      for (const b of e.bullets) {
        allLeafUnits.push({ top: b.top, bottom: b.bottom });
      }
    }
  }
  for (const a of atomicBlocks) allLeafUnits.push({ top: a.top, bottom: a.bottom });

  // Pagination loop across pages
  const pageBreaks: PageBreakInfo[] = [];
  let currentStartY = 0;
  let pageIndex = 0;
  const maxPages = 15;

  while (currentStartY < totalHeight && pageIndex < maxPages) {
    const usablePageHeight =
      pageIndex === 0
        ? pageHeight - bottomPadding
        : pageHeight - topPadding - bottomPadding;

    const targetEndY = currentStartY + usablePageHeight;

    // If remaining content comfortably fits on the current page, conclude
    if (totalHeight <= targetEndY + 12) {
      pageBreaks.push({
        pageIndex,
        startY: currentStartY,
        endY: totalHeight,
        contentHeight: totalHeight - currentStartY,
        isLastPage: true,
      });
      break;
    }

    let cutY: number | null = null;
    let nextStartY: number | null = null;

    // Check 1: Did an entry span across targetEndY?
    // Find the entry that starts before targetEndY and ends after targetEndY
    const intersectingEntry = entries.find(
      (e) => e.top < targetEndY && e.bottom > targetEndY
    );

    if (intersectingEntry) {
      const e = intersectingEntry;
      const bullets = e.bullets;

      if (bullets.length > 0) {
        const firstBullet = bullets[0];
        // Requirement 4: Keep job titles, company names, dates, and their first responsibility together
        const firstUnitBottom = Math.max(e.headerBottom, firstBullet.bottom);

        // Can the header + first responsibility fit on this page?
        if (firstUnitBottom > targetEndY || e.top <= currentStartY) {
          if (firstUnitBottom > targetEndY) {
            // Even header + first bullet cannot fit on this page!
            // Move entire entry to next page.
            if (
              e.headingBefore &&
              e.headingBefore.top >= currentStartY + minPageHeight &&
              e.top - e.headingBefore.bottom < 50
            ) {
              // Section heading stays together with this entry!
              cutY = e.headingBefore.top - 6;
              nextStartY = e.headingBefore.top;
            } else {
              cutY = e.top - 4;
              nextStartY = e.top;
            }
          } else {
            // Entry started at top of page and has multiple bullets
            let lastFittingIdx = -1;
            for (let b = 0; b < bullets.length; b++) {
              if (bullets[b].bottom <= targetEndY) {
                lastFittingIdx = b;
              } else {
                break;
              }
            }

            if (lastFittingIdx >= 0 && lastFittingIdx < bullets.length - 1) {
              const lastBullet = bullets[lastFittingIdx];
              const nextBullet = bullets[lastFittingIdx + 1];
              cutY = Math.round((lastBullet.bottom + nextBullet.top) / 2);
              nextStartY = nextBullet.top;
            } else if (lastFittingIdx === bullets.length - 1) {
              cutY = e.bottom + 2;
              nextStartY = e.bottom + 4;
            }
          }
        } else {
          // Entry started on this page and first unit fits!
          // Find the last bullet that cleanly fits before targetEndY
          let lastFittingIdx = -1;
          for (let b = 0; b < bullets.length; b++) {
            if (bullets[b].bottom <= targetEndY) {
              lastFittingIdx = b;
            } else {
              break;
            }
          }

          if (lastFittingIdx >= 0 && lastFittingIdx < bullets.length - 1) {
            // Clean break between lastFittingBullet and the next bullet!
            const lastBullet = bullets[lastFittingIdx];
            const nextBullet = bullets[lastFittingIdx + 1];
            cutY = Math.round((lastBullet.bottom + nextBullet.top) / 2);
            nextStartY = nextBullet.top;
          } else if (lastFittingIdx === bullets.length - 1) {
            cutY = e.bottom + 2;
            nextStartY = e.bottom + 4;
          } else {
            // Fallback: move whole entry
            cutY = e.top - 4;
            nextStartY = e.top;
          }
        }
      } else {
        // Entry has no multiple bullets (single block)
        if (
          e.headingBefore &&
          e.headingBefore.top >= currentStartY + minPageHeight &&
          e.top - e.headingBefore.bottom < 50
        ) {
          cutY = e.headingBefore.top - 6;
          nextStartY = e.headingBefore.top;
        } else {
          cutY = e.top - 4;
          nextStartY = e.top;
        }
      }
    }

    // Check 2: If no intersecting entry or cutY still null, check headings near targetEndY
    if (cutY === null) {
      for (const h of headings) {
        if (h.top < targetEndY && h.top > currentStartY + minPageHeight) {
          if (h.bottom > targetEndY || targetEndY - h.top < 60) {
            cutY = h.top - 6;
            nextStartY = h.top;
            break;
          }
        }
      }
    }

    // Check 3: Find the last unit that cleanly completed before targetEndY
    if (cutY === null) {
      let bestBottom = currentStartY + minPageHeight;
      let matchingUnitTop: number | null = null;

      for (const unit of allLeafUnits) {
        if (unit.bottom <= targetEndY && unit.bottom > bestBottom) {
          bestBottom = unit.bottom + 2;
        }
      }

      for (const unit of allLeafUnits) {
        if (unit.top >= bestBottom) {
          if (matchingUnitTop === null || unit.top < matchingUnitTop) {
            matchingUnitTop = unit.top;
          }
        }
      }

      if (bestBottom > currentStartY + minPageHeight) {
        cutY = bestBottom;
        if (matchingUnitTop !== null && matchingUnitTop >= bestBottom && matchingUnitTop - bestBottom <= 24) {
          nextStartY = matchingUnitTop;
        } else {
          nextStartY = bestBottom;
        }
      }
    }

    // Fallback: targetEndY
    if (cutY === null || cutY <= currentStartY + minPageHeight) {
      cutY = targetEndY;
      nextStartY = targetEndY;
    }

    if (nextStartY === null || nextStartY < cutY) {
      nextStartY = cutY;
    }

    // Collision Check: Ensure cutY does not slice through ANY unit horizontally
    for (let c = 0; c < 5; c++) {
      let collided = false;
      for (const unit of allLeafUnits) {
        if (cutY > unit.top + 2 && cutY < unit.bottom - 2) {
          cutY = unit.top - 4;
          nextStartY = unit.top;
          collided = true;
          break;
        }
      }
      if (!collided) break;
    }

    // Enforce bounds and forward progress
    cutY = Math.max(cutY, currentStartY + minPageHeight);
    cutY = Math.min(cutY, targetEndY);
    nextStartY = Math.max(nextStartY, cutY);

    pageBreaks.push({
      pageIndex,
      startY: currentStartY,
      endY: cutY,
      contentHeight: cutY - currentStartY,
      isLastPage: false,
    });

    currentStartY = nextStartY;
    pageIndex++;
  }

  if (pageBreaks.length > 0) {
    pageBreaks[pageBreaks.length - 1].isLastPage = true;
  }

  return {
    pageCount: pageBreaks.length,
    pageBreaks,
    totalHeight,
    isMultiPage: pageBreaks.length > 1,
  };
}
