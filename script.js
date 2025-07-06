// List of markdown files
const posts = [
  '2025-07-12-trump-sets-tariffs-how-is-vietnam-affected.md',
  '2025-07-06-what-is-economics-macro-vs-micro-explained.md',
  '2025-07-19-how-ai-is-reshaping-the-economy.md',
  '2025-07-26-demand-and-supply-the-heart-of-market-economy.md',
  '2025-08-02-trade-war-us-china-tariffs-and-vietnams-role.md',
  '2025-08-09-blockchain-and-crypto-more-than-bitcoin.md',
  '2025-08-16-how-economies-work-command-market-and-mixed-systems.md',
  '2025-08-23-why-oil-price-fluctuations-matter-to-you.md',
  '2025-08-30-the-gig-economy-work-without-walls.md',
  '2025-09-06-inflation-and-deflation-why-prices-keep-changing.md',
  '2025-09-13-gold-prices-are-rising-invest-or-not.md',
  '2025-09-20-sustainable-consumption-buy-less-choose-better.md',
  '2025-09-27-gdp-an-indicator-of-national-economic-health.md',
  '2025-10-04-fiscal-policy-how-governments-spend-and-tax.md',
  '2025-10-11-monetary-policy-and-central-banks.md',
  '2025-10-18-greenwashing-when-eco-is-a-gimmick.md',
  '2025-10-25-stocks-vs-bonds-whats-the-difference.md',
  '2025-11-1-business-cycle-expansion-peak-recession-and-trough.md',
];

const url = new URL(window.location.href);
const pathname = url.pathname;
const currentPage = pathname.substring(pathname.lastIndexOf('/') + 1);

const container = document.getElementById('posts');
const latestContainer = document.getElementById('latest-post') || null;
const categoriesContainer = document.getElementById('categories') || null;

const allPosts = [];

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
  const public = metadata.public || "true";

  if (public == "false") {
    return;
  }

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

  if (currentPage === "index.html" || currentPage === "") {
    const publicPosts = allPosts.filter(p => p.metadata.public !== "false");

    if (latestContainer && publicPosts[0]) {
      renderPostPreview(publicPosts[0].metadata, publicPosts[0].filename, publicPosts[0].content, latestContainer);
    }

    publicPosts.forEach(post => {
      renderPostPreview(post.metadata, post.filename, post.content, container);
    });

    if (categoriesContainer) {
      const uniqueCategories = [...new Set(allPosts.map(p => p.metadata.category || 'Uncategorized'))];
      uniqueCategories.forEach(cat => {
        const div = document.createElement('div')
        const link = document.createElement('a');
        link.href = `category.html?category=${encodeURIComponent(cat)}`;
        link.textContent = cat;
        div.appendChild(link)
        categoriesContainer.appendChild(div);
      });
    }
  } else if (currentPage === "category.html") {
      const urlParams = new URLSearchParams(window.location.search);
      const targetCategory = urlParams.get('category');

      document.getElementById('category-title').textContent = `Articles in "${targetCategory}"`;

      const filteredPosts = allPosts.filter(post => {
        const category = post.metadata.category || 'Uncategorized';
        return category === targetCategory;
      });

      filteredPosts.forEach(post => {
        renderPostPreview(post.metadata, post.filename, post.content, container);
    });
  } else if (window.location.pathname.includes("search.html")) {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q')?.toLowerCase() || "";
    
      document.querySelector("h2").textContent = `Search Results for "${query}"`;
      document.getElementById("searchInput").value = query;
    
      const container = document.getElementById("posts");
      if (!container) return;
    
      const matchingPosts = allPosts.filter(post =>
        post.metadata.title?.toLowerCase().includes(query) ||
        post.metadata.author?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    
      if (matchingPosts.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No matching posts found.";
        container.appendChild(message);
        return;
      }
    
      matchingPosts.forEach(post => {
        renderPostPreview(post.metadata, post.filename, post.content, container);
      });
  }
});
