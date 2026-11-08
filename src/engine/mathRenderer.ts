import katex from 'katex';

export function renderLatexToString(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: true,
      strict: false
    });
  } catch (err) {
    console.warn('KaTeX render warning:', err);
    return `<code>${latex}</code>`;
  }
}

export function hydrateMathElements(root: HTMLElement) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-latex]');
  nodes.forEach((node) => {
    const tex = node.getAttribute('data-latex') || '';
    const isDisplay = node.getAttribute('data-display') === 'true';
    try {
      katex.render(tex, node, {
        displayMode: isDisplay,
        throwOnError: false,
        trust: true,
        strict: false
      });
    } catch (e) {
      node.textContent = tex;
    }
  });
}

