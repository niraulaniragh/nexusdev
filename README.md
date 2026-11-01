# NEXUS — Premium Creative Developer Portfolio

A modern, responsive developer portfolio website featuring a dark theme, elegant animations, and a professional design system.

![NEXUS Portfolio](https://img.shields.io/badge/NEXUS-Portfolio-568BFF?style=for-the-badge)

## ✨ Features

- **Modern Design** — Dark theme with electric blue and purple accents
- **Fully Responsive** — Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** — Elegant scroll animations that respect `prefers-reduced-motion`
- **Accessible** — Semantic HTML, proper contrast ratios, keyboard navigation
- **Fast & Lightweight** — No frameworks, pure HTML/CSS/JavaScript
- **Easy to Deploy** — Ready for GitHub Pages

## 🗂️ Project Structure

```
nexus-portfolio/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Complete stylesheet with design system
├── js/
│   └── main.js         # Vanilla JavaScript for interactions
├── assets/
│   └── favicon.svg     # SVG favicon
├── README.md           # Documentation
└── .gitignore          # Git ignore rules
```

## 🚀 Quick Start

### Run Locally

1. Clone or download this repository
2. Open `index.html` in your browser

**With a local server (recommended):**

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if npx is available)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push this project to the repository:

```bash
cd nexus-portfolio
git init
git add .
git commit -m "Initial commit: NEXUS portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-portfolio.git
git push -u origin main
```

3. Go to **Settings → Pages**
4. Set source to **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

Your site will be live at `https://YOUR_USERNAME.github.io/nexus-portfolio/`

## ⚙️ Configuration

### Update Contact Email

1. Open `index.html`
2. Find the contact section and update the email placeholder:
   ```html
   <a href="mailto:your.email@example.com">your.email@example.com</a>
   ```

### Configure Formspree (Optional)

For a fully functional contact form:

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and copy your form ID
3. Update the form action in `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

Without Formspree, the form uses a `mailto:` fallback.

### Add New Projects

Edit the `projectsData` array in `js/main.js`:

```javascript
const projectsData = [
    {
        id: 'my-new-project',
        title: 'My New Project',
        description: 'Description of your project.',
        tags: ['HTML5', 'CSS3', 'JavaScript'],
        liveUrl: 'https://example.com',
        repoUrl: 'https://github.com/username/repo',
        featured: true,
        comingSoon: false
    },
    // ... more projects
];
```

Or add them directly in the HTML within the `.projects-grid` section.

### Update Technology Stack

Edit the tech stack section in `index.html` to add or remove technologies:

```html
<div class="tech-item">
    <div class="tech-icon-wrapper">
        <!-- Add icon SVG here -->
    </div>
    <span>Technology Name</span>
</div>
```

## 🎨 Design System

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg-primary` | `#080A12` | Main background |
| `--color-bg-secondary` | `#101629` | Section backgrounds |
| `--color-electric-blue` | `#568BFF` | Primary accent |
| `--color-purple` | `#9B72FF` | Secondary accent |
| `--color-cyan` | `#4ECDC4` | Tertiary accent |

### Typography

- **Font Family:** Inter (system fallback)
- **Monospace:** JetBrains Mono

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1023px
- **Desktop:** ≥ 1024px

## ♿ Accessibility

- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Respects `prefers-reduced-motion`
- Sufficient color contrast ratios

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with purpose. **NEXUS.**
