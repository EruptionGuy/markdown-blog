// Navbar
const navbar = ` 
<nav>
    <div>
      <p><a href="./index.html">eCON CLUB</a></p>
      <div class="search">
        <input type="text" id="searchInput" placeholder="Search"/>
        <button id="searchButton"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
    </div>
</nav>`;

document.body.getElementsByTagName("header")[0].insertAdjacentHTML("beforebegin", navbar);

// Footer
const footer = `
<footer class="site-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>About eCON Club</h4>
        <p>A vibrant community for individuals passionate about the dynamic world of economics.</p>
      </div>
  
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="./index.html">Home</a></li>
          <li><a href="./index.html/#latest-post">Latest Post</a></li>
          <li><a href="./index.html/#category.html">Categories</a></li>
        </ul>
      </div>
  
      <div class="footer-section">
        <h4>Connect</h4>
        <ul class="socials">
          <li><a href="https://www.facebook.com/profile.php?id=61554295590080">Facebook</a></li>
          <li><a href="#">Email</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 eCON Club. All rights reserved.</p>
    </div>
</footer>`

document.body.getElementsByTagName("main")[0].insertAdjacentHTML("afterend", footer);