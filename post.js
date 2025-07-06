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
        const rawValue = rest.join(':').trim();

        // Handle list-style [a, b, c]
        if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
          meta[key.trim()] = rawValue
            .slice(1, -1)
            .split(',')
            .map(s => s.trim());
        } else {
          meta[key.trim()] = rawValue;
        }
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
        // Insert Infographic section BEFORE this heading
        if (meta.infographic) {
          const infographicWrapper = document.createElement('div');
          infographicWrapper.innerHTML = `
            <h1>Infographic</h1>
            <div class="infographic-gallery">
              ${[...(Array.isArray(meta.infographic) ? meta.infographic : [meta.infographic])]
                .map(src => `<img src="${src}" alt="Infographic" class="post-infographic">`)
                .join('\n')}
            </div>
          `;
          h1.parentNode.insertBefore(infographicWrapper, h1);
        }

        // Wrap all following <p> tags as references
        const wrapper = document.createElement('div');
        wrapper.className = 'references';

        let next = h1.nextElementSibling;
        while (next && next.tagName === 'P') {
          const current = next;
          next = next.nextElementSibling;
          wrapper.appendChild(current);
        }

        h1.parentNode.insertBefore(wrapper, h1.nextElementSibling);
        break;
      }
    }

    // Inject final HTML into page
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

    // Update document title
    document.title = `${meta.title} - eCON Club`;

    // Dynamically update meta tags
    const setMeta = (selector, content) => {
      const el = document.querySelector(selector);
      if (el && content) el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', meta.description || "Read more on economics at eCON Club.");
    setMeta('meta[name="author"]', meta.author || "eCON Club");

    const pageUrl = window.location.href;
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description || "Read more on economics at eCON Club.");
    setMeta('meta[property="og:image"]', meta.image || "https://economicsclubblog.vercel.app/images/banner.png");
    setMeta('meta[property="og:url"]', pageUrl);
  });
