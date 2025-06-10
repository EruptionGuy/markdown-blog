# Static Markdown Blog

This is a simple static blog built using **HTML**, **CSS**, and **JavaScript**, where each blog post is written in a separate **Markdown (`.md`) file**. The homepage automatically displays the latest blog posts with previews, including title images, dates, and authors parsed from the frontmatter.

## Features

- 📄 Write posts in Markdown
- 🏷️ Title, author, and image from YAML frontmatter
- 🗓️ Automatically extract date from filename
- 📰 Previews show first 200–300 characters of content
- 🎨 Custom fonts and dark theme styling
- ⚡ No frameworks or backend — 100% static

## How to Use

1. **Clone The Repo**

   ```bash
   git clone https://github.com/yourusername/static-markdown-blog.git
   cd static-markdown-blog
   ```

2. **Add Your Posts**
    
    Inside the `posts/` folder, create a new `.md` file with this format:
    
    ```markdown
    ---
    title: My New Blog Post
    author: John Doe
    image: ../images/my-banner.jpg
    ---

    Welcome to my blog! This is the content of my post...
    ```

    Filename should begin with the date: `YYYY-MM-DD-title.md`

3. **Customize The Design**

    Edit `styles/style.css` to change layout, fonts, or colors.
    
    Font family used: `Lato`.

4. **Open The Blog**

    Simply open `index.html` in a browser (or use a local server like Live Server for best results).

## Dependencies

- `marked.js`: Parses Markdown into HTML

## Notes
Posts are loaded dynamically using JavaScript and `fetch()`. Because of this, direct opening of index.html from the filesystem might cause issues in some browsers. Use a local web server if needed.

## Authors
Created by @EruptionGuy
