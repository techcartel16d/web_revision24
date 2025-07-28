// renderMath.js
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { CHTML } from 'mathjax-full/js/output/chtml.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({ packages: AllPackages });
const chtml = new CHTML();

const html = mathjax.document('', { InputJax: tex, OutputJax: chtml });

export const renderMath = (text, container) => {
  if (!container || !text) return;

  // Clear previous math
  container.innerHTML = text;

  // Typeset the container
  mathjax.typesetPromise([container]);
};
