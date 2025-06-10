// List of markdown files
const posts = [
  '2025-06-09-another-day.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
  '2025-06-08-my-first-post.md',
];

const container = document.getElementById('posts');
const latestContainer = document.getElementById('latest-post');
const categoriesContainer = document.getElementById('categories') || null;

const allPosts = [];

// Extract YAML frontmatter
function extractMetadata(markdown) {
  const meta = {};
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      meta[key.trim()] = rest.join(':').trim();
    });
  }
  return meta;
}

function renderPostPreview(metadata, filename, contentWithoutMeta, target) {
  const title = metadata.title || filename.replace('.md', '');
  const author = metadata.author || 'Unknown';
  const image = metadata.image || null;
  const category = metadata.category || 'Uncategorized';

  const dateRaw = metadata.date || filename.split('-').slice(0, 3).join('-');
  const formattedDate = new Date(dateRaw).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const lines = contentWithoutMeta.split('\n');
  if (lines[0].startsWith('# ')) lines.shift();
  let previewRaw = lines.join(' ').replace(/\n/g, ' ');
  previewRaw = previewRaw.replace(/#+\s?(.+)/g, '$1');
  const previewText = previewRaw.substring(0, 300) + "...";
  const previewHtml = marked.parse(previewText);

  const postPreview = document.createElement('div');
  postPreview.className = 'post-preview';

  postPreview.innerHTML = `
    <a href="post.html?file=${filename}">
      ${image ? `<img class="preview-image" src="${image}" alt="${title}">` : ''}
    </a>
    <div>
      <a href="post.html?file=${filename}"><h3>${title}</h3></a>
      ${previewHtml}
      <p class="post-meta">
        By ${author} &nbsp;&bull;&nbsp; ${formattedDate} &nbsp;&bull;&nbsp;
        <a class="category-link" href="category.html?category=${encodeURIComponent(category)}">${category}</a>
      </p>
    </div>
  `;

  target.appendChild(postPreview);
}

Promise.all(posts.map(filename =>
  fetch(`posts/${filename}`)
    .then(response => response.text())
    .then(markdown => {
      const metadata = extractMetadata(markdown);
      const content = markdown.replace(/^---\n[\s\S]*?\n---/, '').trim();
      allPosts.push({ filename, metadata, content });
    })
)).then(() => {
  allPosts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

  // Latest post
  if (latestContainer && allPosts[0]) {
    renderPostPreview(allPosts[0].metadata, allPosts[0].filename, allPosts[0].content, latestContainer);
  }

  // All posts
  allPosts.forEach(post => {
    renderPostPreview(post.metadata, post.filename, post.content, container);
  });

  // Render unique categories
  if (categoriesContainer) {
    const uniqueCategories = [...new Set(allPosts.map(p => p.metadata.category || 'Uncategorized'))];
    uniqueCategories.forEach(cat => {
      const link = document.createElement('a');
      link.href = `category.html?category=${encodeURIComponent(cat)}`;
      link.textContent = cat;
      link.style.marginRight = '1rem';
      categoriesContainer.appendChild(link);
    });
  }
});
