document.body.classList.add('post-page');

const params = new URLSearchParams(window.location.search);
const file = params.get('file');

fetch(`posts/${file}`)
  .then(response => response.text())
  .then(markdown => {
    // Extract YAML metadata
    const meta = {};
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);
    let content = markdown;

    if (match) {
      const lines = match[1].split('\n');
      lines.forEach(line => {
        const [key, ...rest] = line.split(':');
        meta[key.trim()] = rest.join(':').trim();
      });
      content = markdown.replace(match[0], '').trim(); // remove metadata block
    }

    // Parse the rest of the markdown
    const htmlContent = marked.parse(content);

    // Add title from frontmatter as <h1>
    const container = document.getElementById('post');
    container.innerHTML = `
      <h1>${meta.title || file.replace('.md', '')}</h1>
      <p class="post-meta">By ${meta.author || 'Unknown'} &nbsp;&bull;&nbsp; ${new Date(meta.date).toLocaleDateString()}</p>
      ${meta.image ? `<img src="${meta.image}" class="post-image" alt="${meta.title}">` : ''}
      ${htmlContent}
    `;
  });
