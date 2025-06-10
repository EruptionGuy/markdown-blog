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
      <div class="post-meta">
        <p><span class="post-meta-type">By</span>&nbsp;&nbsp;${meta.author || 'Unknown'}</p>
        <p><span class="post-meta-type">Published</span>&nbsp;&nbsp;${new Date(meta.date).toLocaleDateString()}</p>
        <p><span class="post-meta-type">Category</span>&nbsp;&nbsp;<a class="category-link" href="category.html?category=${encodeURIComponent(meta.category)}">${meta.category}</a></p>
      </div>
      ${meta.image ? `<img src="${meta.image}" class="post-image" alt="${meta.title}">` : ''}
      ${htmlContent}
    `;
  });
