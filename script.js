// List of markdown files
const posts = [
  '2025-07-24-what-is-economics-macro-vs-micro-explained.md',
  '2025-07-27-trump-sets-tariffs-how-is-vietnam-affected.md',
  '2025-07-31-demand-and-supply-the-heart-of-market-economy.md',
  '2025-08-03-how-ai-is-reshaping-the-economy.md',
  '2025-08-07-trade-war-us-china-tariffs-and-vietnams-role.md',
  '2025-08-10-blockchain-and-crypto-more-than-bitcoin.md',
  '2025-08-14-how-economies-work-command-market-and-mixed-systems.md',
  '2025-08-17-why-oil-price-fluctuations-matter-to-you.md',
  '2025-08-21-inflation-and-deflation-why-prices-keep-changing.md',
  '2025-08-24-the-gig-economy-work-without-walls.md',
  '2025-08-31-sustainable-consumption-buy-less-choose-better.md',
  '2025-09-04-fiscal-policy-how-governments-spend-and-tax.md',
  '2025-09-07-gdp-an-indicator-of-national-economic-health.md',
  '2025-09-14-monetary-policy-and-central-banks.md',
  '2025-09-18-stocks-vs-bonds-whats-the-difference.md',
  '2025-09-21-the-rhythm-of-the-economy-what-the-business-cycle-tells-us.md',
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
      const value = rest.join(':').trim();

      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // Parse as JSON array (handles quoted values correctly)
          meta[key.trim()] = JSON.parse(value);
        } catch (err) {
          console.warn(`Invalid JSON array in metadata key "${key.trim()}":`, value);
          meta[key.trim()] = value;
        }
      } else {
        meta[key.trim()] = value;
      }
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
    <a href="post.html?article=${filename}">
      ${image ? `<img class="preview-image" src="${image}" alt="${title}" loading="lazy">` : ''}
    </a>
    <div>
      <a href="post.html?article=${filename}"><h3>${title}</h3></a>
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

    const viewInfographicBtn = document.getElementById("viewInfographics");
    const gallery = document.getElementById("infographics")

    viewInfographicBtn.addEventListener("click", () => {
      if (viewInfographicBtn.textContent == "View Infographics") {
        // Hide post previews
        document.getElementById("posts").style.display = "none";
      
        // Clear previous infographics
        gallery.innerHTML = "";
      
        allPosts.forEach(post => {
          const infographics = post.metadata.infographic;
          const public = post.metadata.public;
      
          if (public == "false") return;
          if (!infographics) return;
      
          const urls = Array.isArray(infographics)
            ? infographics
            : [infographics];
      
          urls.forEach(url => {
            const a = document.createElement("a");
            a.href = `post.html?article=${post.filename}`;
            const img = document.createElement("img");
            img.src = url;
            img.loading = "lazy"; // Lazy loading
            img.className = "infographic-img";
            a.appendChild(img)
            gallery.appendChild(a);
          });

          // Show gallery
          gallery.style.display = "block";    
          viewInfographicBtn.textContent = "View Posts"
        });
      } else if (viewInfographicBtn.textContent == "View Posts") {
        document.getElementById("posts").style.display = "flex";
        gallery.style.display = "none";
        viewInfographicBtn.textContent = "View Infographics";
      }
    });

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
