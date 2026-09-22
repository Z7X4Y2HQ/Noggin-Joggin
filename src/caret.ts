// Caret tracking utility for auto-expanding textareas and mobile viewports

const mirrorStyleProperties = [
  "boxSizing",
  "width",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "letterSpacing",
  "lineHeight",
  "textTransform",
  "wordSpacing",
  "textIndent",
  "whiteSpace",
  "wordWrap",
  "overflowWrap",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
] as const;

let mirrorElement: HTMLDivElement | null = null;

function getOrCreateMirror(): HTMLDivElement {
  if (!mirrorElement || !document.body.contains(mirrorElement)) {
    mirrorElement = document.createElement("div");
    mirrorElement.id = "__textarea_caret_mirror__";
    mirrorElement.setAttribute("aria-hidden", "true");
    mirrorElement.style.position = "absolute";
    mirrorElement.style.top = "-99999px";
    mirrorElement.style.left = "-99999px";
    mirrorElement.style.visibility = "hidden";
    mirrorElement.style.pointerEvents = "none";
    document.body.appendChild(mirrorElement);
  }
  return mirrorElement;
}

export function getCaretCoordinates(
  textarea: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } {
  const mirror = getOrCreateMirror();
  const computed = window.getComputedStyle(textarea);

  for (const prop of mirrorStyleProperties) {
    mirror.style[prop] = computed[prop];
  }

  mirror.style.position = "absolute";
  mirror.style.top = "-99999px";
  mirror.style.left = "-99999px";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.width = `${textarea.clientWidth}px`;

  const textBefore = textarea.value.slice(0, position);
  mirror.textContent = textBefore;

  const marker = document.createElement("span");
  // A dot character ensures the marker gets placed on the active line even following trailing newlines
  marker.textContent = ".";
  mirror.appendChild(marker);

  const borderTop = parseFloat(computed.borderTopWidth) || 0;
  const top = marker.offsetTop + borderTop;
  const left = marker.offsetLeft;
  const parsedLineHeight = parseFloat(computed.lineHeight);
  const height =
    marker.offsetHeight || (Number.isNaN(parsedLineHeight) ? 24 : parsedLineHeight);

  return { top, left, height };
}

export function keepCursorInView(
  textarea: HTMLTextAreaElement,
  options: { immediate?: boolean; alignMiddle?: boolean } = {},
) {
  if (typeof window === "undefined" || !textarea) return;

  const cursorIndex = textarea.selectionEnd ?? textarea.value.length;
  const caret = getCaretCoordinates(textarea, cursorIndex);

  const textareaRect = textarea.getBoundingClientRect();
  const caretTop = textareaRect.top + caret.top - textarea.scrollTop;
  const caretBottom = caretTop + caret.height;

  // Read visual viewport (essential for mobile devices with soft keyboards)
  const vv = window.visualViewport;
  const viewportTop = vv ? vv.offsetTop : 0;
  const viewportHeight = vv ? vv.height : window.innerHeight;
  const visibleTop = viewportTop;
  const visibleBottom = viewportTop + viewportHeight;

  // Maintain safety margins so cursor is not tucked flush against borders or hidden by keyboard
  const topMargin = Math.min(80, viewportHeight * 0.2);
  const bottomMargin = Math.min(95, viewportHeight * 0.28);

  if (options.alignMiddle) {
    const targetY = visibleTop + viewportHeight * 0.38;
    const diff = caretTop - targetY;
    if (Math.abs(diff) > 12) {
      window.scrollBy({
        top: diff,
        behavior: options.immediate ? "auto" : "smooth",
      });
    }
    return;
  }

  let scrollDiff = 0;

  if (caretBottom > visibleBottom - bottomMargin) {
    scrollDiff = caretBottom - (visibleBottom - bottomMargin);
  } else if (caretTop < visibleTop + topMargin) {
    scrollDiff = caretTop - (visibleTop + topMargin);
  }

  if (scrollDiff !== 0) {
    window.scrollBy({
      top: scrollDiff,
      behavior: options.immediate ? "auto" : "smooth",
    });
  }
}
