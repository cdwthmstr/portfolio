<div align="center">

# <img src="https://api.iconify.design/tabler:layout-dashboard.svg?color=%236c8cff&width=40" width="34" style="vertical-align:middle" /> Portfolio

**"Hi, I'm Master Guilliver F. Jaravata, a BSIT student sharpening my fundamentals while I work toward a career in networking and systems administration."**

<img src="https://img.shields.io/badge/status-live-6c8cff?style=for-the-badge&labelColor=0a0e1a" />
<img src="https://img.shields.io/badge/design-dark%20%2B%20glassmorphism-b06cff?style=for-the-badge&labelColor=0a0e1a" />

<br />

<img src="https://skillicons.dev/icons?i=html,css,js,vercel" />

<br />

<p>
  <a href="#features">Features</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#structure">Structure</a> &middot;
  <a href="#running-locally">Running Locally</a> &middot;
  <a href="#projects-featured">Projects Featured</a>
</p>

</div>

<br />

A single-page portfolio site, dark mode with a glassmorphism look (frosted glass cards, blurred gradient accents), built to double as a living resume for internship and job applications.

## Features

- **Hero** with intro, resume download, and social links
- **About** section with education, focus areas, and quick facts
- **Skills**, grouped by core languages, full-stack tools, databases, and networking fundamentals
- **Projects**, flagship capstone system with a screenshot gallery, plus a supporting project
- **Resume** section with a one-click PDF download
- **Contact** form (mailto handoff) plus direct contact info
- Mobile nav, scroll-spy active links, and scroll-reveal animations, all vanilla JS

## Tech Stack

Plain HTML5, CSS3 (custom properties, Flexbox, Grid, `backdrop-filter` for the glass effect), and vanilla JavaScript, no framework or build step.

## Structure

```
index.html      main page, all sections
css/style.css   theme, layout, responsive styles
js/script.js    nav toggle, scroll spy, form handling
assets/         images, resume PDF
api/            reserved for a future contact-form serverless function
```

## Running Locally

```
npx serve .
```

Then open the printed local URL in your browser.

## Deployment

Deployed on [Vercel](https://vercel.com), connected directly to this repo, push to `main` to redeploy.

## Projects Featured

| Project | Repo |
|---|---|
| Barangay San Roque Family Tree System (capstone) | [preview](https://github.com/cdwthmstr/brgy-san-roque-system-preview) &middot; [code excerpts](https://github.com/cdwthmstr/brgy-san-roque-code-excerpts) |
| JCM Inventory POS System | [repo](https://github.com/cdwthmstr/jcm-inv-pos-system-ipt102) |
| Rentify (rental platform landing page) | [repo](https://github.com/cdwthmstr/rentify-rent-app-cc106) &middot; [live demo](https://retlify-v2-g8.netlify.app/pages/index.html) |
| Personal Webpage (WS101) | [repo](https://github.com/cdwthmstr/personal-webpage-ws101) &middot; [live demo](https://lab1-ws101.netlify.app/) |
