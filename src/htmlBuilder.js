const DEFAULT_TITLE = 'Данные из таблицы';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapCellText(value) {
  const words = String(value)
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  return words
    .map((word, index) => {
      const suffix = index < words.length - 1 ? '&nbsp;' : '';
      return `<span style="white-space: nowrap;">${escapeHtml(word)}${suffix}</span>`;
    })
    .join('\n            ');
}

function renderField(label, value) {
  const wrappedText = wrapCellText(value ?? '');

  return `      <div class="data-block__field">
        <dt class="data-block__label">${escapeHtml(label)}</dt>
        <dd class="data-block__value">
          <p style="margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 22px; color: #333f48; font-weight: 400;">
            ${wrappedText || '&nbsp;'}
          </p>
        </dd>
      </div>`;
}

function renderBlock(row, index) {
  const fields = Object.entries(row)
    .map(([key, value]) => renderField(key, value ?? ''))
    .join('\n');

  return `  <section class="data-block" aria-label="Строка ${index + 1}">
    <header class="data-block__title">Строка ${index + 1}</header>
    <dl class="data-block__fields">
${fields}
    </dl>
  </section>`;
}

function buildHtmlDocument(rows, sourceName = DEFAULT_TITLE) {
  const blocks = rows.map(renderBlock).join('\n\n');
  const content = rows.length > 0
    ? blocks
    : '  <p class="data-page__empty">В таблице нет данных.</p>';

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(sourceName)} — ${DEFAULT_TITLE}</title>
  <style>
    :root {
      --bg: #0f172a;
      --surface: #111827;
      --accent: #38bdf8;
      --muted: #cbd5e1;
      --text: #e2e8f0;
      --border: #1f2937;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.08), transparent 25%),
                  radial-gradient(circle at 80% 10%, rgba(56, 189, 248, 0.06), transparent 25%),
                  var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      padding: 32px 16px 48px;
    }

    .data-page {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .data-page__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(56, 189, 248, 0.04));
      border: 1px solid rgba(56, 189, 248, 0.24);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
    }

    .data-page__title {
      margin: 0;
      font-size: 1.5rem;
      letter-spacing: -0.02em;
    }

    .data-page__meta {
      color: var(--muted);
      margin: 0;
      font-size: 0.95rem;
    }

    .data-block {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
      transition: transform 120ms ease, border-color 120ms ease;
    }

    .data-block:hover {
      transform: translateY(-2px);
      border-color: rgba(56, 189, 248, 0.35);
    }

    .data-block__title {
      margin: 0 0 12px 0;
      font-size: 1.05rem;
      color: var(--accent);
    }

    .data-block__fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 10px 16px;
      margin: 0;
      padding: 0;
    }

    .data-block__field {
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
    }

    .data-block__label {
      margin: 0 0 4px 0;
      font-weight: 600;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .data-block__value {
      margin: 0;
      font-size: 1rem;
      line-height: 1.4;
      word-break: break-word;
    }

    .data-page__empty {
      text-align: center;
      padding: 32px;
      color: var(--muted);
      border: 1px dashed rgba(255, 255, 255, 0.16);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.02);
    }
  </style>
</head>
<body>
  <main class="data-page">
    <header class="data-page__header">
      <h1 class="data-page__title">${escapeHtml(DEFAULT_TITLE)}</h1>
      <p class="data-page__meta">Источник: ${escapeHtml(sourceName)}</p>
    </header>
${content}
  </main>
</body>
</html>`;
}

module.exports = {
  buildHtmlDocument,
  escapeHtml,
};
