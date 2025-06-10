// List of markdown files
const posts = [
    '2025-06-09-another-day.md',
    '2025-06-08-my-first-post.md',
    '2025-06-09-another-day.md',
    '2025-06-09-another-day.md',
    '2025-06-09-another-day.md',
    '2025-06-09-another-day.md',
    '2025-06-09-another-day.md',
    '2025-06-09-another-day.md',
    '2025-06-09-another-day.md',
];
  
const container = document.getElementById('posts');

// Function to extract YAML frontmatter
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

posts.forEach(filename => {
  fetch(`posts/${filename}`)
    .then(response => response.text())
    .then(markdown => {
      const metadata = extractMetadata(markdown);
      const title = metadata.title || filename.replace('.md', '');
      const author = metadata.author || 'Unknown';
      const image = metadata.image || null;

      const dateRaw = metadata.date || filename.split('-').slice(0, 3).join('-');
      const formattedDate = new Date(dateRaw).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const contentWithoutMeta = markdown.replace(/^---\n[\s\S]*?\n---/, '').trim();
      const lines = contentWithoutMeta.split('\n');
      if (lines[0].startsWith('# ')) lines.shift();

      let previewRaw = lines.join(' ').replace(/\n/g, ' ');
      previewRaw = previewRaw.replace(/#+\s?(.+)/g, '$1');
      const previewText = previewRaw.substring(0, 300) + "...";
      const previewHtml = marked.parse(previewText);

      const postPreview = document.createElement('div');
      postPreview.className = 'post-preview';

      postPreview.innerHTML = `
        <a href="post.html?file=${filename}"><h2>${title}</h2>
        ${image ? `<img class="preview-image" src="${image}" alt="${title}">` : ''}</a>
        ${previewHtml}
        <p class="post-meta">By ${author} &nbsp;&bull;&nbsp; ${formattedDate}</p>
      `;

      container.appendChild(postPreview);
    });

});
