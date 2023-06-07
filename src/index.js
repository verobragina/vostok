// SCSS
import '@/scss/main.scss'

// PAGES
import '@/pages/index/index'

// SVG icons sprite generation
document.addEventListener('DOMContentLoaded', () => {
  function requireAll(r) {
    r.keys().forEach(r);
  }
  requireAll(require.context('./assets/icons/', true, /\.svg$/));
});
