export interface MeasuredWordRect {
  text: string;
  top: number;
  left: number;
  right: number;
  width: number;
  spaceBefore: boolean;
}

export interface MeasuredVisualLine {
  text: string;
  top: number;
  words: MeasuredWordRect[];
  isLastLine: boolean;
}

export interface MeasuredParagraph {
  lines: MeasuredVisualLine[];
  contentWidth: number;
  lineHeightPx: number;
}

let cachedMeasureCanvas: HTMLCanvasElement | null = null;

export function measureNormalSpaceWidth(element: HTMLElement): number {
  try {
    const computed = window.getComputedStyle(element);
    const font =
      computed.font ||
      `${computed.fontStyle || 'normal'} ${computed.fontWeight || '400'} ${computed.fontSize || '14px'} ${
        computed.fontFamily || 'sans-serif'
      }`;
    if (typeof document !== 'undefined') {
      if (!cachedMeasureCanvas) {
        cachedMeasureCanvas = document.createElement('canvas');
      }
      const ctx = cachedMeasureCanvas.getContext('2d');
      if (ctx) {
        ctx.font = font;
        const w = ctx.measureText(' ').width;
        if (w > 0) return w;
      }
    }
    const fontSize = parseFloat(computed.fontSize || '14') || 14;
    return fontSize * 0.28;
  } catch {
    return 4;
  }
}

interface TextSegmentSplit {
  slice: string;
  rect: DOMRect;
  spaceBefore: boolean;
}

function splitMultiRectToken(
  doc: Document,
  textNode: Text,
  startOffset: number,
  endOffset: number,
  tokenText: string,
  isUnbreakable: boolean,
  initialSpaceBefore: boolean
): TextSegmentSplit[] {
  const results: TextSegmentSplit[] = [];
  const len = endOffset - startOffset;
  if (len <= 1) {
    const range = doc.createRange();
    range.setStart(textNode, startOffset);
    range.setEnd(textNode, endOffset);
    const rects = range.getClientRects();
    const rect = rects[0] || range.getBoundingClientRect();
    results.push({ slice: tokenText, rect, spaceBefore: initialSpaceBefore });
    return results;
  }

  let cursor = 0;
  let first = true;
  while (cursor < len) {
    let low = cursor + 1;
    let high = len;
    let bestEnd = cursor + 1;

    // Find longest prefix starting at `cursor` that remains on a single client rect line
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const r = doc.createRange();
      r.setStart(textNode, startOffset + cursor);
      r.setEnd(textNode, startOffset + mid);
      const rects = r.getClientRects();
      if (rects.length <= 1) {
        bestEnd = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const r = doc.createRange();
    r.setStart(textNode, startOffset + cursor);
    r.setEnd(textNode, startOffset + bestEnd);
    const rects = r.getClientRects();
    const rect = rects[0] || r.getBoundingClientRect();

    const isFinalChunk = bestEnd >= len;
    let sliceText = tokenText.slice(cursor, bestEnd);
    // Preserve soft hyphen rendered by `hyphens: auto` on broken normal words
    if (!isFinalChunk && !isUnbreakable && !sliceText.endsWith('-')) {
      sliceText += '-';
    }

    results.push({
      slice: sliceText,
      rect,
      spaceBefore: first ? initialSpaceBefore : false,
    });
    first = false;
    cursor = bestEnd;
  }

  return results;
}

export function extractMeasuredLinesFromParagraph(p: HTMLElement): MeasuredParagraph {
  const doc = p.ownerDocument || document;
  const computed = window.getComputedStyle(p);
  const fontSize = parseFloat(computed.fontSize || '14') || 14;
  const parsedLineHeight = parseFloat(computed.lineHeight || '');
  const lineHeightPx = Number.isFinite(parsedLineHeight) && parsedLineHeight > 0 ? parsedLineHeight : fontSize * 1.45;
  const paddingLeft = parseFloat(computed.paddingLeft || '0') || 0;
  const paddingRight = parseFloat(computed.paddingRight || '0') || 0;
  const contentWidth = Math.max(0, p.getBoundingClientRect().width - paddingLeft - paddingRight);

  const walker = doc.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  const fragments: MeasuredWordRect[] = [];
  let pendingSpace = false;
  let seenAnyToken = false;

  let currentNode = walker.nextNode() as Text | null;
  while (currentNode) {
    const value = currentNode.nodeValue || '';
    const parentEl = currentNode.parentElement;
    const isUnbreakable = Boolean(parentEl?.closest('.cl-unbreakable-token'));
    const tokenRegex = /(\s+)|(\S+)/g;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(value)) !== null) {
      if (match[1]) {
        if (seenAnyToken) {
          pendingSpace = true;
        }
        continue;
      }

      const wordText = match[2];
      const startOffset = match.index;
      const endOffset = startOffset + wordText.length;

      const range = doc.createRange();
      range.setStart(currentNode, startOffset);
      range.setEnd(currentNode, endOffset);
      const rects = range.getClientRects();

      if (rects.length <= 1) {
        const rect = rects[0] || range.getBoundingClientRect();
        if (rect && (rect.width > 0 || wordText.length > 0)) {
          fragments.push({
            text: wordText,
            top: rect.top,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            spaceBefore: seenAnyToken ? pendingSpace : false,
          });
        }
      } else {
        const splits = splitMultiRectToken(
          doc,
          currentNode,
          startOffset,
          endOffset,
          wordText,
          isUnbreakable,
          seenAnyToken ? pendingSpace : false
        );
        for (const s of splits) {
          fragments.push({
            text: s.slice,
            top: s.rect.top,
            left: s.rect.left,
            right: s.rect.right,
            width: s.rect.width,
            spaceBefore: s.spaceBefore,
          });
        }
      }

      seenAnyToken = true;
      pendingSpace = false;
    }

    currentNode = walker.nextNode() as Text | null;
  }

  if (fragments.length === 0) {
    return { lines: [], contentWidth, lineHeightPx };
  }

  const lineTolerance = Math.max(3, lineHeightPx * 0.45);
  const grouped: Array<{ top: number; words: MeasuredWordRect[] }> = [];

  for (const frag of fragments) {
    const lastGroup = grouped[grouped.length - 1];
    if (!lastGroup || Math.abs(frag.top - lastGroup.top) > lineTolerance) {
      grouped.push({ top: frag.top, words: [frag] });
    } else {
      lastGroup.words.push(frag);
    }
  }

  const lines: MeasuredVisualLine[] = grouped.map((g, idx) => {
    let lineText = '';
    g.words.forEach((w, wordIdx) => {
      if (wordIdx === 0) {
        lineText += w.text;
      } else {
        lineText += (w.spaceBefore ? ' ' : '') + w.text;
      }
    });
    return {
      text: lineText.trim(),
      top: g.top,
      words: g.words,
      isLastLine: idx === grouped.length - 1,
    };
  });

  return { lines, contentWidth, lineHeightPx };
}

/**
 * Checks if any non-last justified line in `.cl-body-content p` has an average
 * word gap exceeding ~2.2x a normal space width.
 */
export function detectWideJustificationGaps(rootEl: HTMLElement): boolean {
  const paragraphs = Array.from(rootEl.querySelectorAll('.cl-body-content p')) as HTMLElement[];
  for (const p of paragraphs) {
    if (p.closest('.cl-sample-placeholder')) continue;
    const normalSpace = measureNormalSpaceWidth(p);
    if (normalSpace <= 0) continue;

    const { lines, contentWidth } = extractMeasuredLinesFromParagraph(p);
    for (const line of lines) {
      if (line.isLastLine) continue;

      // Collect actual inter-word gap widths on this line
      let gapSum = 0;
      let gapCount = 0;
      for (let i = 1; i < line.words.length; i++) {
        if (!line.words[i].spaceBefore) continue;
        const gap = line.words[i].left - line.words[i - 1].right;
        if (gap >= 0) {
          gapSum += gap;
          gapCount++;
        }
      }

      if (gapCount === 0) continue;

      let avgGap = gapSum / gapCount;
      // Fallback if Range rects did not shift horizontally for justification
      if (avgGap <= normalSpace * 1.05 && contentWidth > 0) {
        const wordsTotalWidth = line.words.reduce((acc, w) => acc + w.width, 0);
        const theoreticalAvg = (contentWidth - wordsTotalWidth) / gapCount;
        if (theoreticalAvg > avgGap) {
          avgGap = theoreticalAvg;
        }
      }

      if (avgGap > normalSpace * 2.2) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Rebuilds each `.cl-body-content p` inside the cloned export DOM using the
 * exact visual lines measured via Range.getClientRects() from the live preview,
 * guaranteeing 1:1 line count and line breaks in html2canvas PDF/PNG exports.
 */
export function rebuildCoverLetterBodyLinesForExport(
  clonedDoc: Document,
  clonedRoot: HTMLElement,
  liveRoot: HTMLElement
): void {
  const isJustified =
    liveRoot.getAttribute('data-cl-justify') === 'true' ||
    Boolean(liveRoot.querySelector('[data-cl-justify="true"]'));

  const liveParagraphs = Array.from(liveRoot.querySelectorAll('.cl-body-content p')) as HTMLElement[];
  const clonedParagraphs = Array.from(clonedRoot.querySelectorAll('.cl-body-content p')) as HTMLElement[];
  const count = Math.min(liveParagraphs.length, clonedParagraphs.length);

  for (let i = 0; i < count; i++) {
    const liveP = liveParagraphs[i];
    const clonedP = clonedParagraphs[i];
    if (!liveP || !clonedP) continue;
    if (liveP.closest('.cl-sample-placeholder')) continue;

    const { lines, lineHeightPx } = extractMeasuredLinesFromParagraph(liveP);
    if (lines.length === 0) continue;

    const liveComputed = window.getComputedStyle(liveP);
    clonedP.style.lineHeight = `${lineHeightPx}px`;
    clonedP.style.textAlign = 'left';
    clonedP.style.hyphens = 'none';
    clonedP.style.marginTop = liveComputed.marginTop;
    clonedP.style.marginBottom = liveComputed.marginBottom;

    while (clonedP.firstChild) {
      clonedP.removeChild(clonedP.firstChild);
    }

    for (const line of lines) {
      const lineSpan = clonedDoc.createElement('span');
      lineSpan.className = 'cl-export-line';
      lineSpan.style.display = 'block';
      lineSpan.style.width = '100%';
      lineSpan.style.whiteSpace = 'nowrap';
      lineSpan.style.lineHeight = `${lineHeightPx}px`;
      lineSpan.style.hyphens = 'none';

      if (isJustified && !line.isLastLine) {
        lineSpan.style.textAlign = 'justify';
        (lineSpan.style as any).textAlignLast = 'justify';
        (lineSpan.style as any).textJustify = 'inter-word';
      } else {
        lineSpan.style.textAlign = 'left';
        (lineSpan.style as any).textAlignLast = 'left';
      }

      lineSpan.textContent = line.text;
      clonedP.appendChild(lineSpan);
    }
  }
}
