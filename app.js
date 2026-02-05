/* ==========================================================================
   Markdown Learning Site — app.js
   Theme toggle, routing, Learn section, Practice engine
   ========================================================================== */

(function () {
  'use strict';

  // ========================================================================
  // Theme Toggle
  // ========================================================================

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function getPreferredTheme() {
    const stored = localStorage.getItem('md-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('md-theme', next);
    applyTheme(next);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('md-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ========================================================================
  // Routing
  // ========================================================================

  const homeView = document.getElementById('homeView');
  const learnView = document.getElementById('learnView');
  const practiceView = document.getElementById('practiceView');
  const siteTitle = document.querySelector('.site-title');

  function showView(view) {
    homeView.hidden = true;
    learnView.hidden = true;
    practiceView.hidden = true;
    view.hidden = false;
  }

  siteTitle.addEventListener('click', () => showView(homeView));
  document.getElementById('goLearn').addEventListener('click', () => {
    showView(learnView);
    renderLearnPage();
  });
  document.getElementById('goPractice').addEventListener('click', () => {
    showView(practiceView);
    loadChallenge();
  });
  document.getElementById('learnToPractice').addEventListener('click', () => {
    showView(practiceView);
    loadChallenge();
  });
  document.getElementById('practiceToLearn').addEventListener('click', () => {
    showView(learnView);
    renderLearnPage();
  });

  // ========================================================================
  // marked.js configuration
  // ========================================================================

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  function renderMarkdown(src) {
    return marked.parse(src);
  }

  // ========================================================================
  // Learn Section — Page Data
  // ========================================================================

  function example(raw) {
    return `<div class="example-pair">
      <div>
        <div class="example-label">Markdown</div>
        <div class="example-raw">${escapeHtml(raw)}</div>
      </div>
      <div>
        <div class="example-label">Result</div>
        <div class="example-rendered">${renderMarkdown(raw)}</div>
      </div>
    </div>`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const learnPages = [
    {
      title: 'Welcome',
      content: () => `
        <h2>Welcome to Learn Markdown!</h2>
        <p>Markdown is a lightweight markup language that lets you format text using simple, readable syntax. It was created by John Gruber in 2004 with the goal of being as readable as possible in its raw form.</p>
        <p>You'll find Markdown everywhere: GitHub READMEs, Slack messages, Reddit posts, note-taking apps, documentation sites, and much more.</p>
        <p>This guide walks you through every formatting option, step by step. Each page shows you the raw Markdown alongside the rendered result. When you're ready to test yourself, head to <strong>Practice</strong>.</p>
        <p>Use the <strong>arrow buttons</strong> or <strong>keyboard arrows</strong> to flip between pages. Click the <strong>page title</strong> above to jump to any topic.</p>
      `
    },
    {
      title: 'Headings',
      content: () => `
        <h2>Headings</h2>
        <p>Use <code>#</code> symbols at the start of a line to create headings. The number of <code>#</code> symbols determines the heading level (1–6).</p>
        ${example('# Heading 1')}
        ${example('## Heading 2')}
        ${example('### Heading 3')}
        <p>You can go all the way to level 6:</p>
        ${example('#### Heading 4\n##### Heading 5\n###### Heading 6')}
        <p><strong>Tip:</strong> Always put a space after the <code>#</code>. <code>#No space</code> won't render as a heading in most parsers.</p>
      `
    },
    {
      title: 'Emphasis',
      content: () => `
        <h2>Emphasis: Bold, Italic & Strikethrough</h2>
        <p>Wrap text in asterisks or underscores to add emphasis.</p>
        <p><strong>Italic</strong> — single <code>*</code> or <code>_</code>:</p>
        ${example('*italic text*')}
        ${example('_also italic_')}
        <p><strong>Bold</strong> — double <code>**</code> or <code>__</code>:</p>
        ${example('**bold text**')}
        <p><strong>Bold + Italic</strong> — triple <code>***</code>:</p>
        ${example('***bold and italic***')}
        <p><strong>Strikethrough</strong> — double tildes <code>~~</code>:</p>
        ${example('~~deleted text~~')}
      `
    },
    {
      title: 'Paragraphs & Line Breaks',
      content: () => `
        <h2>Paragraphs & Line Breaks</h2>
        <p>Paragraphs are separated by a blank line. Simply pressing Enter once does <em>not</em> create a new paragraph — you need a completely empty line between blocks of text.</p>
        ${example('This is paragraph one.\n\nThis is paragraph two.')}
        <p>To force a line break <em>within</em> a paragraph (without starting a new paragraph), end the line with two trailing spaces or use <code>&lt;br&gt;</code>.</p>
        ${example('Line one  \nLine two (two trailing spaces)')}
        <p><strong>Tip:</strong> Trailing spaces are invisible, so many people prefer using <code>&lt;br&gt;</code> for clarity.</p>
      `
    },
    {
      title: 'Links & Images',
      content: () => `
        <h2>Links & Images</h2>
        <p><strong>Inline links</strong> use <code>[text](url)</code>:</p>
        ${example('[Visit Zombo](https://zombo.com)')}
        <p><strong>Links with titles</strong> — hover text in quotes:</p>
        ${example('[Hover me](https://zombo.com "You can do anything!")')}
        <p><strong>Images</strong> are like links with a <code>!</code> prefix. The text in brackets becomes the alt text:</p>
        ${example('![Alt text](https://picsum.photos/seed/markdown/300/100)')}
        <p><strong>Reference-style links</strong> let you define URLs separately:</p>
        ${example('[Click here][1]\n\n[1]: https://zombo.com')}
      `
    },
    {
      title: 'Lists',
      content: () => `
        <h2>Lists</h2>
        <p><strong>Unordered lists</strong> use <code>-</code>, <code>*</code>, or <code>+</code>:</p>
        ${example('- Apple\n- Banana\n- Cherry')}
        <p><strong>Ordered lists</strong> use numbers followed by a period:</p>
        ${example('1. First item\n2. Second item\n3. Third item')}
        <p><strong>Nested lists</strong> — indent with 2 or 4 spaces:</p>
        ${example('- Fruits\n  - Apple\n  - Banana\n- Vegetables\n  - Carrot\n  - Peas')}
        <p>You can also nest ordered inside unordered and vice versa:</p>
        ${example('1. Step one\n   - Detail A\n   - Detail B\n2. Step two')}
      `
    },
    {
      title: 'Task Lists',
      content: () => `
        <h2>Task Lists</h2>
        <p>Task lists (also called checkbox lists) use <code>- [ ]</code> for unchecked and <code>- [x]</code> for checked items. These are a GitHub Flavored Markdown extension.</p>
        ${example('- [x] Write the outline\n- [x] Draft the introduction\n- [ ] Add examples\n- [ ] Review and publish')}
        <p>They can be nested too:</p>
        ${example('- [x] Phase 1\n  - [x] Research\n  - [x] Planning\n- [ ] Phase 2\n  - [ ] Development\n  - [ ] Testing')}
      `
    },
    {
      title: 'Blockquotes',
      content: () => `
        <h2>Blockquotes</h2>
        <p>Use <code>&gt;</code> at the start of a line to create a blockquote:</p>
        ${example('> This is a blockquote.\n> It can span multiple lines.')}
        <p><strong>Nested blockquotes</strong> use multiple <code>&gt;</code> symbols:</p>
        ${example('> Outer quote\n>\n>> Nested quote\n>>\n>>> Deeply nested')}
        <p>You can put other formatting inside blockquotes:</p>
        ${example('> **Note:** This is *important* information.')}
      `
    },
    {
      title: 'Code',
      content: () => `
        <h2>Code</h2>
        <p><strong>Inline code</strong> uses single backticks:</p>
        ${example('Use the `print()` function to output text.')}
        <p><strong>Code blocks</strong> use triple backticks (optionally with a language name for syntax hints):</p>
        ${example('```\nfunction hello() {\n  console.log("Hello!");\n}\n```')}
        <p>With a language identifier:</p>
        ${example('```python\ndef greet(name):\n    return f"Hello, {name}!"\n```')}
        <p><strong>Tip:</strong> You can also create code blocks by indenting every line with 4 spaces, but fenced blocks (with backticks) are more common and more readable.</p>
      `
    },
    {
      title: 'Horizontal Rules',
      content: () => `
        <h2>Horizontal Rules</h2>
        <p>Create a horizontal line to separate sections. Use three or more hyphens, asterisks, or underscores on their own line:</p>
        ${example('Above the line\n\n---\n\nBelow the line')}
        <p>All of these work:</p>
        ${example('---')}
        ${example('***')}
        ${example('___')}
        <p><strong>Tip:</strong> Make sure there's a blank line above and below the rule, especially with <code>---</code>, to avoid it being interpreted as a heading underline.</p>
      `
    },
    {
      title: 'Tables',
      content: () => `
        <h2>Tables</h2>
        <p>Tables use pipes <code>|</code> and hyphens <code>-</code>. The second row (separator) is required.</p>
        ${example('| Name   | Role       |\n|--------|------------|\n| Alice  | Developer  |\n| Bob    | Designer   |')}
        <p><strong>Column alignment</strong> — use colons in the separator row:</p>
        ${example('| Left   | Center | Right  |\n|:-------|:------:|-------:|\n| A      | B      | C      |\n| Hello  | World  | !      |')}
        <p><strong>Tip:</strong> The outer pipes are optional, and columns don't need to be perfectly aligned in your source — the renderer handles it. But aligning them makes your raw markdown more readable.</p>
      `
    },
    {
      title: 'Advanced Combinations',
      content: () => `
        <h2>Advanced Combinations</h2>
        <p>You can mix and nest most Markdown elements. Here are some common combos:</p>
        <p><strong>Bold text in a heading:</strong></p>
        ${example('## A **very** important heading')}
        <p><strong>Links inside lists:</strong></p>
        ${example('- [Zombo](https://zombo.com)\n- [Welcome](https://www.zombo.com)\n- [Anything](https://html5zombo.com)')}
        <p><strong>Emphasis inside blockquotes:</strong></p>
        ${example('> The key is to *never* stop **learning**.')}
        <p><strong>Code inside a list:</strong></p>
        ${example('1. Install it: `npm install marked`\n2. Import it: `import { marked } from "marked"`\n3. Use it: `marked.parse("# Hello")`')}
        <p><strong>A table with bold and links:</strong></p>
        ${example('| Feature | Status |\n|---------|--------|\n| **Auth** | Done |\n| [API Docs](https://zombo.com) | In Progress |')}
      `
    },
    {
      title: 'Footnotes & Extras',
      content: () => `
        <h2>Footnotes & Extras</h2>
        <p><strong>Footnotes</strong> let you add references without cluttering the text:</p>
        ${example('Here is a statement[^1] with a footnote.\n\n[^1]: This is the footnote content.')}
        <p><em>Note: Footnote support varies by parser. GitHub supports them; some others don't.</em></p>
        <p><strong>Definition lists</strong> (not universally supported):</p>
        ${example('Term\n: Definition of the term\n\nAnother term\n: Another definition')}
        <p><strong>Escaping special characters</strong> — use a backslash:</p>
        ${example('\\*Not italic\\*\n\\# Not a heading')}
        <p>You now know all the major Markdown formatting options! Head to <strong>Practice</strong> to test your skills.</p>
      `
    },
  ];

  // ========================================================================
  // Learn Section — Rendering & Navigation
  // ========================================================================

  let learnPageIndex = 0;
  const learnContent = document.getElementById('learnContent');
  const learnTitleText = document.getElementById('learnTitleText');
  const learnTitle = document.getElementById('learnTitle');
  const tocDropdown = document.getElementById('tocDropdown');
  const tocList = document.getElementById('tocList');
  const learnPageIndicator = document.getElementById('learnPageIndicator');
  const learnPrev = document.getElementById('learnPrev');
  const learnNext = document.getElementById('learnNext');

  function renderLearnPage() {
    const page = learnPages[learnPageIndex];
    learnTitleText.textContent = page.title;
    learnContent.innerHTML = page.content();
    learnPageIndicator.textContent = `${learnPageIndex + 1} / ${learnPages.length}`;
    learnPrev.disabled = learnPageIndex === 0;
    learnNext.disabled = learnPageIndex === learnPages.length - 1;
  }

  learnPrev.addEventListener('click', () => {
    if (learnPageIndex > 0) { learnPageIndex--; renderLearnPage(); }
  });
  learnNext.addEventListener('click', () => {
    if (learnPageIndex < learnPages.length - 1) { learnPageIndex++; renderLearnPage(); }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (learnView.hidden) return;
    // Don't capture if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' && learnPageIndex > 0) {
      learnPageIndex--;
      renderLearnPage();
    } else if (e.key === 'ArrowRight' && learnPageIndex < learnPages.length - 1) {
      learnPageIndex++;
      renderLearnPage();
    }
  });

  // TOC
  function buildTOC() {
    tocList.innerHTML = '';
    learnPages.forEach((page, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = `${i + 1}. ${page.title}`;
      if (i === learnPageIndex) btn.classList.add('toc-active');
      btn.addEventListener('click', () => {
        learnPageIndex = i;
        renderLearnPage();
        closeTOC();
      });
      li.appendChild(btn);
      tocList.appendChild(li);
    });
  }

  function closeTOC() {
    tocDropdown.hidden = true;
    learnTitle.setAttribute('aria-expanded', 'false');
  }

  learnTitle.addEventListener('click', () => {
    const isOpen = !tocDropdown.hidden;
    if (isOpen) {
      closeTOC();
    } else {
      buildTOC();
      tocDropdown.hidden = false;
      learnTitle.setAttribute('aria-expanded', 'true');
    }
  });

  // Close TOC when clicking outside
  document.addEventListener('click', (e) => {
    if (!tocDropdown.hidden && !e.target.closest('.learn-title-wrap')) {
      closeTOC();
    }
  });

  // ========================================================================
  // Practice Section — Challenge Engine
  // ========================================================================

  // Word pools for random generation
  const nouns = ['galaxy', 'mountain', 'river', 'phoenix', 'crystal', 'shadow', 'compass', 'lantern', 'harbor', 'meadow', 'thunder', 'whisper', 'coral', 'summit', 'voyage', 'ember', 'mosaic', 'horizon', 'aurora', 'beacon'];
  const adjectives = ['ancient', 'bright', 'calm', 'daring', 'elegant', 'fierce', 'gentle', 'hidden', 'luminous', 'mystic', 'quiet', 'radiant', 'swift', 'vibrant', 'wandering', 'golden', 'silver', 'cosmic', 'serene', 'bold'];
  const verbs = ['explore', 'discover', 'create', 'illuminate', 'navigate', 'transform', 'observe', 'design', 'craft', 'build', 'launch', 'gather', 'decode', 'master', 'unlock'];
  const topics = ['astronomy', 'botany', 'cartography', 'engineering', 'folklore', 'geology', 'history', 'linguistics', 'music', 'philosophy', 'robotics', 'typography', 'zoology', 'architecture', 'chemistry'];
  const names = ['Alice', 'Bjorn', 'Clara', 'Dmitri', 'Elena', 'Felix', 'Grace', 'Hugo', 'Iris', 'Jules', 'Kira', 'Leo', 'Mira', 'Niko', 'Olive'];
  const urls = ['https://zombo.com', 'https://www.zombo.com', 'https://html5zombo.com', 'https://zombo.com/welcome', 'https://zombo.com/anything-is-possible'];
  const languages = ['python', 'javascript', 'rust', 'go', 'ruby'];
  const codeSnippets = [
    { lang: 'python', code: 'print("Hello, world!")' },
    { lang: 'javascript', code: 'console.log("Hello!");' },
    { lang: 'rust', code: 'println!("Hello!");' },
    { lang: 'python', code: 'x = [i**2 for i in range(10)]' },
    { lang: 'javascript', code: 'const sum = (a, b) => a + b;' },
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  // Tier definitions: each tier has a name and an array of generator functions.
  // Each generator returns { markdown, explanation }
  const tiers = [
    {
      name: 'Headings',
      generators: [
        () => {
          const level = randInt(1, 4);
          const text = `${pick(adjectives)} ${pick(nouns)}`.replace(/^\w/, c => c.toUpperCase());
          const hashes = '#'.repeat(level);
          return {
            markdown: `${hashes} ${text}`,
            explanation: `Use ${level} hash symbol${level > 1 ? 's' : ''} followed by a space to create a level-${level} heading.`
          };
        },
        () => {
          const t1 = `${pick(adjectives)} ${pick(nouns)}`.replace(/^\w/, c => c.toUpperCase());
          const t2 = `${pick(adjectives)} ${pick(nouns)}`.replace(/^\w/, c => c.toUpperCase());
          const l1 = randInt(1, 3);
          const l2 = l1 + randInt(1, 2);
          return {
            markdown: `${'#'.repeat(l1)} ${t1}\n\n${'#'.repeat(Math.min(l2, 6))} ${t2}`,
            explanation: `Create two headings: level ${l1} (${l1} hashes) and level ${Math.min(l2, 6)} (${Math.min(l2, 6)} hashes). Separate them with a blank line.`
          };
        },
      ]
    },
    {
      name: 'Emphasis',
      generators: [
        () => {
          const word = pick(nouns);
          return {
            markdown: `*${word}*`,
            explanation: `Wrap the word in single asterisks for italic: *${word}*`
          };
        },
        () => {
          const word = pick(adjectives);
          return {
            markdown: `**${word}**`,
            explanation: `Wrap the word in double asterisks for bold: **${word}**`
          };
        },
        () => {
          const word = pick(nouns);
          return {
            markdown: `***${word}***`,
            explanation: `Wrap the word in triple asterisks for bold italic: ***${word}***`
          };
        },
        () => {
          const word = pick(nouns);
          return {
            markdown: `~~${word}~~`,
            explanation: `Wrap the word in double tildes for strikethrough: ~~${word}~~`
          };
        },
        () => {
          const w1 = pick(adjectives);
          const w2 = pick(nouns);
          return {
            markdown: `The **${w1}** ${w2}`,
            explanation: `Only the word "${w1}" is bold (double asterisks). The rest is plain text.`
          };
        },
      ]
    },
    {
      name: 'Links & Images',
      generators: [
        () => {
          const text = pick(nouns).replace(/^\w/, c => c.toUpperCase());
          const url = pick(urls);
          return {
            markdown: `[${text}](${url})`,
            explanation: `Inline link syntax: [display text](URL)`,
            hints: [`URL: ${url}`]
          };
        },
        () => {
          const text = `${pick(adjectives)} ${pick(nouns)}`;
          const url = pick(urls);
          const title = pick(['Click here', 'Learn more', 'Visit site', 'Read this', 'Go here']);
          return {
            markdown: `[${text}](${url} "${title}")`,
            explanation: `Link with a title/tooltip: [text](URL "title")`,
            hints: [`URL: ${url}`, `Title: "${title}"`]
          };
        },
        () => {
          const alt = `${pick(adjectives)} ${pick(nouns)}`;
          const seed = alt.replace(/\s+/g, '-').toLowerCase();
          const imgUrl = `https://picsum.photos/seed/${seed}/200/100`;
          return {
            markdown: `![${alt}](${imgUrl})`,
            explanation: `Image syntax is like a link but with ! prefix: ![alt text](image URL)`,
            hints: [`Alt text: "${alt}"`, `Image URL: ${imgUrl}`]
          };
        },
      ]
    },
    {
      name: 'Lists',
      generators: [
        () => {
          const items = pickN(nouns, randInt(3, 4));
          const md = items.map(i => `- ${i.replace(/^\w/, c => c.toUpperCase())}`).join('\n');
          return {
            markdown: md,
            explanation: `Unordered list: start each line with - followed by a space.`
          };
        },
        () => {
          const items = pickN(nouns, randInt(3, 4));
          const md = items.map((item, i) => `${i + 1}. ${item.replace(/^\w/, c => c.toUpperCase())}`).join('\n');
          return {
            markdown: md,
            explanation: `Ordered list: start each line with a number, period, and space.`
          };
        },
        () => {
          const parent1 = pick(nouns).replace(/^\w/, c => c.toUpperCase());
          const children1 = pickN(nouns, 2).map(n => n.replace(/^\w/, c => c.toUpperCase()));
          const parent2 = pick(nouns).replace(/^\w/, c => c.toUpperCase());
          const children2 = pickN(nouns, 2).map(n => n.replace(/^\w/, c => c.toUpperCase()));
          const md = `- ${parent1}\n  - ${children1[0]}\n  - ${children1[1]}\n- ${parent2}\n  - ${children2[0]}\n  - ${children2[1]}`;
          return {
            markdown: md,
            explanation: `Nested list: indent child items with 2 spaces under their parent.`
          };
        },
      ]
    },
    {
      name: 'Task Lists',
      generators: [
        () => {
          const items = pickN(verbs, randInt(3, 5));
          const md = items.map((v, i) => {
            const checked = i < randInt(1, items.length - 1);
            const label = `${v.replace(/^\w/, c => c.toUpperCase())} the ${pick(nouns)}`;
            return `- [${checked ? 'x' : ' '}] ${label}`;
          }).join('\n');
          return {
            markdown: md,
            explanation: `Task list: use - [ ] for unchecked and - [x] for checked items.`
          };
        },
      ]
    },
    {
      name: 'Blockquotes',
      generators: [
        () => {
          const sentence = `The ${pick(adjectives)} ${pick(nouns)} will ${pick(verbs)} the ${pick(nouns)}.`;
          return {
            markdown: `> ${sentence}`,
            explanation: `Blockquote: start the line with > followed by a space.`
          };
        },
        () => {
          const s1 = `${pick(adjectives)} things take time.`.replace(/^\w/, c => c.toUpperCase());
          const s2 = `The ${pick(nouns)} is always ${pick(adjectives)}.`;
          return {
            markdown: `> ${s1}\n>\n>> ${s2}`,
            explanation: `Nested blockquote: use > for the outer quote and >> for the inner one. Use > on its own for a blank line inside the quote.`
          };
        },
        () => {
          const word = pick(nouns);
          const adj = pick(adjectives);
          return {
            markdown: `> **${word.replace(/^\w/, c => c.toUpperCase())}** is *${adj}*.`,
            explanation: `You can use bold (**text**) and italic (*text*) inside blockquotes.`
          };
        },
      ]
    },
    {
      name: 'Code',
      generators: [
        () => {
          const fn = pick(['print', 'console.log', 'echo', 'puts', 'fmt.Println']);
          return {
            markdown: `Use the \`${fn}()\` function.`,
            explanation: `Inline code: wrap text in single backticks.`
          };
        },
        () => {
          const snippet = pick(codeSnippets);
          return {
            markdown: `\`\`\`${snippet.lang}\n${snippet.code}\n\`\`\``,
            explanation: `Fenced code block: use triple backticks, optionally followed by the language name. Close with another set of triple backticks.`,
            hints: [`Language: ${snippet.lang}`]
          };
        },
        () => {
          const snippet = pick(codeSnippets);
          return {
            markdown: `\`\`\`\n${snippet.code}\n\`\`\``,
            explanation: `Fenced code block without a language: use triple backticks on their own lines before and after the code.`,
            hints: [`No language identifier needed`]
          };
        },
      ]
    },
    {
      name: 'Tables',
      generators: [
        () => {
          const cols = pickN(topics, 2).map(t => t.replace(/^\w/, c => c.toUpperCase()));
          const rows = pickN(names, randInt(2, 3));
          const items = rows.map(n => pick(adjectives).replace(/^\w/, c => c.toUpperCase()));
          let md = `| ${cols[0]} | ${cols[1]} |\n|---|---|\n`;
          rows.forEach((r, i) => { md += `| ${r} | ${items[i]} |\n`; });
          return {
            markdown: md.trim(),
            explanation: `Table: use | to separate columns. The second row (|---|---|) is the required separator between header and body.`
          };
        },
        () => {
          const h1 = pick(topics).replace(/^\w/, c => c.toUpperCase());
          const h2 = 'Count';
          const h3 = 'Status';
          const r1 = [pick(names), String(randInt(1, 99)), pick(adjectives)];
          const r2 = [pick(names), String(randInt(1, 99)), pick(adjectives)];
          const md = `| ${h1} | ${h2} | ${h3} |\n|:---|:---:|---:|\n| ${r1.join(' | ')} |\n| ${r2.join(' | ')} |`;
          return {
            markdown: md,
            explanation: `Table with alignment: :--- is left-aligned, :---: is centered, ---: is right-aligned. Set alignment in the separator row using colons.`
          };
        },
      ]
    },
    {
      name: 'Mixed / Advanced',
      generators: [
        () => {
          const heading = `${pick(adjectives)} ${pick(topics)}`.replace(/\b\w/g, c => c.toUpperCase());
          const url1 = pick(urls);
          const url2 = pick(urls);
          const name1 = pick(nouns).replace(/^\w/, c => c.toUpperCase());
          const name2 = pick(nouns).replace(/^\w/, c => c.toUpperCase());
          const item1 = `[${name1}](${url1})`;
          const item2 = `[${name2}](${url2})`;
          return {
            markdown: `## ${heading}\n\n- ${item1}\n- ${item2}`,
            explanation: `Combine a level-2 heading with a list of links. Each list item uses inline link syntax: [text](url).`,
            hints: [`"${name1}" URL: ${url1}`, `"${name2}" URL: ${url2}`]
          };
        },
        () => {
          const q = `The **${pick(adjectives)}** ${pick(nouns)} will *${pick(verbs)}* the ${pick(nouns)}.`;
          return {
            markdown: `> ${q}`,
            explanation: `A blockquote containing both bold (**text**) and italic (*text*) emphasis.`
          };
        },
        () => {
          const title = `${pick(adjectives)} ${pick(nouns)}`.replace(/\b\w/g, c => c.toUpperCase());
          const fn = pick(codeSnippets);
          return {
            markdown: `### ${title}\n\nRun this code:\n\n\`\`\`${fn.lang}\n${fn.code}\n\`\`\``,
            explanation: `A heading followed by a paragraph and a fenced code block with a language identifier.`,
            hints: [`Language: ${fn.lang}`]
          };
        },
        () => {
          const items = pickN(nouns, 3).map(n => n.replace(/^\w/, c => c.toUpperCase()));
          const checked = randInt(0, 2);
          const md = items.map((item, i) => {
            const bold = i === 0 ? `**${item}**` : item;
            return `- [${i < checked ? 'x' : ' '}] ${bold}`;
          }).join('\n');
          return {
            markdown: md,
            explanation: `A task list with bold formatting on the first item. Combine - [x] / - [ ] with **bold** inside the label.`
          };
        },
        () => {
          const n1 = pick(names);
          const n2 = pick(names);
          const t = pick(topics).replace(/^\w/, c => c.toUpperCase());
          const md = `| Name | Topic |\n|---|---|\n| **${n1}** | ${t} |\n| *${n2}* | \`${pick(nouns)}\` |`;
          return {
            markdown: md,
            explanation: `A table with emphasis and inline code inside cells. You can use **bold**, *italic*, and \`code\` inside table cells.`
          };
        },
      ]
    },
  ];

  // ========================================================================
  // Practice Section — State & UI
  // ========================================================================

  let currentTierIndex = 0;
  let currentChallenge = null; // { markdown, explanation, hints? }
  let hasWrongAttempt = false;

  const practiceRendered = document.getElementById('practiceRendered');
  const practiceHints = document.getElementById('practiceHints');
  const practiceInput = document.getElementById('practiceInput');
  const practiceSubmit = document.getElementById('practiceSubmit');
  const practiceShowAnswer = document.getElementById('practiceShowAnswer');
  const practiceFeedback = document.getElementById('practiceFeedback');
  const practiceTier = document.getElementById('practiceTier');
  const practicePrev = document.getElementById('practicePrev');
  const practiceNext = document.getElementById('practiceNext');
  const answerModal = document.getElementById('answerModal');
  const answerModalBody = document.getElementById('answerModalBody');
  const answerModalClose = document.getElementById('answerModalClose');

  function loadChallenge() {
    const tier = tiers[currentTierIndex];
    const gen = pick(tier.generators);
    currentChallenge = gen();
    hasWrongAttempt = false;

    practiceTier.textContent = `Tier ${currentTierIndex + 1}: ${tier.name}`;
    practiceRendered.innerHTML = renderMarkdown(currentChallenge.markdown);
    practiceInput.value = '';
    practiceFeedback.textContent = '';
    practiceFeedback.className = 'practice-feedback';
    practiceShowAnswer.hidden = true;

    // Render hints if the challenge provides them
    if (currentChallenge.hints && currentChallenge.hints.length > 0) {
      practiceHints.hidden = false;
      practiceHints.innerHTML = '<span class="practice-hints-label">Details:</span> ' +
        currentChallenge.hints.map(h => `<code>${escapeHtml(h)}</code>`).join(' · ');
    } else {
      practiceHints.hidden = true;
      practiceHints.innerHTML = '';
    }

    // Never disable arrows — endless mode wraps around
    practicePrev.disabled = false;
    practiceNext.disabled = false;
  }

  function normalize(str) {
    return str
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+$/gm, '')  // trim trailing whitespace per line
      .replace(/\n{3,}/g, '\n\n') // collapse 3+ newlines to 2
      .trim();
  }

  practiceSubmit.addEventListener('click', () => {
    const userInput = normalize(practiceInput.value);
    const expected = normalize(currentChallenge.markdown);

    if (userInput === expected) {
      practiceFeedback.textContent = 'Correct!';
      practiceFeedback.className = 'practice-feedback correct';
      practiceShowAnswer.hidden = true;
      // Auto-advance after a short delay (wraps to tier 1 after last tier)
      setTimeout(() => {
        currentTierIndex = (currentTierIndex + 1) % tiers.length;
        loadChallenge();
      }, 1200);
    } else {
      practiceFeedback.textContent = 'Not quite — try again!';
      practiceFeedback.className = 'practice-feedback incorrect';
      hasWrongAttempt = true;
      practiceShowAnswer.hidden = false;
    }
  });

  // Allow Ctrl+Enter / Cmd+Enter to submit
  practiceInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      practiceSubmit.click();
    }
  });

  // Show Answer Modal
  practiceShowAnswer.addEventListener('click', () => {
    answerModalBody.innerHTML = `
      <p class="answer-explanation">${escapeHtml(currentChallenge.explanation)}</p>
      <pre><code>${escapeHtml(currentChallenge.markdown)}</code></pre>
    `;
    answerModal.hidden = false;
  });

  answerModalClose.addEventListener('click', () => {
    answerModal.hidden = true;
  });

  // Close modal on overlay click
  answerModal.addEventListener('click', (e) => {
    if (e.target === answerModal) {
      answerModal.hidden = true;
    }
  });

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !answerModal.hidden) {
      answerModal.hidden = true;
    }
  });

  // Practice navigation arrows (endless — wraps around)
  practiceNext.addEventListener('click', () => {
    currentTierIndex = (currentTierIndex + 1) % tiers.length;
    loadChallenge();
  });

  practicePrev.addEventListener('click', () => {
    currentTierIndex = (currentTierIndex - 1 + tiers.length) % tiers.length;
    loadChallenge();
  });

  // ========================================================================
  // Init
  // ========================================================================

  // Pre-render first learn page in case user navigates there
  renderLearnPage();

})();
