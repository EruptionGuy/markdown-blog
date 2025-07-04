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

    // Parse markdown to HTML
    let htmlContent = marked.parse(content);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find the <h1> with "References"
    const allH1s = doc.querySelectorAll('h1');
    for (const h1 of allH1s) {
      if (h1.textContent.trim().toLowerCase() === 'references') {
        const wrapper = document.createElement('div');
        wrapper.className = 'references';

        // Collect all <p> elements after the h1
        let next = h1.nextElementSibling;
        while (next && next.tagName === 'P') {
          const current = next;
          next = next.nextElementSibling;
          wrapper.appendChild(current);
        }

        // Insert wrapper after the heading
        h1.parentNode.insertBefore(wrapper, h1.nextElementSibling);
        break;
      }
    }

    // Inject final HTML
    const container = document.getElementById('post');
    container.innerHTML = `
      <h1 class="post-title">${meta.title || file.replace('.md', '')}</h1>
      <div class="post-meta">
        <p><span class="post-meta-type">By</span>&nbsp;&nbsp;${meta.author || 'Unknown'}</p>
        <p><span class="post-meta-type">Published</span>&nbsp;&nbsp;${new Date(meta.date).toLocaleDateString()}</p>
        <p><span class="post-meta-type">Category</span>&nbsp;&nbsp;<a class="category-link" href="category.html?category=${encodeURIComponent(meta.category)}">${meta.category}</a></p>
      </div>
      ${meta.image ? `<img src="${meta.image}" class="post-image" alt="${meta.title}">` : ''}
      ${doc.body.innerHTML}
    `;

    document.title = `${meta.title} - eCON Club`;
  });
