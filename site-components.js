// Navbar
const navbar = ` 
<nav>
    <div>
      <h4><a href="./index.html">eCON CLUB</a></h4>
      <div class="nav-categories">
        <p><a href="/category.html?category=Understanding%20Economics">Understanding Economics</a></p>
        <p><a href="/category.html?category=Economic%20Trends">Economic Terms</a></p>
        <p><a href="/category.html?category=Economic%20News">Economic News</a></p>
      </div>
      <form id="search">
        <input type="text" id="searchInput" placeholder="Search"/>
        <button id="searchButton" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
      </form>
      <a href="javascript:void(0);" class="hamburger-button" onclick="toggleHamburgerMenu()"><i class="fa fa-bars"></i></a>
    </div>
    <div id="hamburger-menu">
      <div>
        <div class="nav-categories">
          <a href="/category.html?category=Understanding%20Economics"><div><p>Understanding Economics</p></div></a>
          <a href="/category.html?category=Economic%20Trends"><div><p>Economic Terms</p></div></a>
          <a href="/category.html?category=Economic%20News"><div><p>Economic News</p></div></a>
        </div>
        <form id="search">
          <input type="text" id="searchInput" placeholder="Search"/>
          <button id="searchButton" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>
    </div>
</nav>`;

document.body.getElementsByTagName("header")[0].insertAdjacentHTML("beforebegin", navbar);

function toggleHamburgerMenu() {
  const menu = document.getElementById("hamburger-menu");
  menu.classList.toggle("show");
}


// Back-to-top Button
const backToTop = `
<button id="back-to-top" onclick="scrollToTop()">
  <i class="fas fa-arrow-up"></i>
</button>`;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.body.getElementsByTagName("main")[0].insertAdjacentHTML("afterend", backToTop);

// Footer
const footer = `
<footer class="site-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>eCON CLUB</h4>
        <p>A vibrant community for individuals passionate about the dynamic world of economics.</p>
      </div>
  
      <div class="footer-section">
        <h4>QUICK LINKS</h4>
        <ul>
          <li><a href="./">Home</a></li>
          <li><a href="./#latest-post2">Latest Post</a></li>
          <li><a href="./#categories2">Categories</a></li>
        </ul>
      </div>
  
      <div class="footer-section">
        <h4>CONNECT</h4>
        <ul class="socials">
          <li><a href="https://www.facebook.com/profile.php?id=61554295590080" target="_blank">Facebook</a></li>
          <li><a href="mailto:contact.econclub@gmail.com" target="_blank">Email</a></li>
          <li><a href="./index.html" target="_blank">Blog</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 eCON Club. All rights reserved.</p>
    </div>
</footer>`

document.body.getElementsByTagName("main")[0].insertAdjacentHTML("afterend", footer);