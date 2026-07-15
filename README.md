# Karam Alsawaftah — Portfolio

Personal portfolio website for Karam Alsawaftah, XR Developer.
Plain HTML, CSS and JavaScript — no build step, served directly by GitHub Pages.

## Structure

```
index.html      page skeleton (sections only, no content)
css/style.css   theme — colors are CSS variables at the top
js/data.js      ALL site content: projects, experience, education, skills, languages
js/main.js      rendering logic (reads data.js, builds the page)
public/         favicon
```

## Editing content

Everything lives in `js/data.js`:

- **Add a project** — copy any object in the `PROJECTS` array and edit it.
  Set `category` to `commercial`, `university` or `personal`.
  Add an `image: "path/to/screenshot.jpg"` field to replace the generated placeholder art.
- **Add a category** — add an entry to `CATEGORIES`; it renders automatically.
  Empty categories are hidden.
- **Skills / languages / education / experience / contact** — edit the matching arrays.

`index.html` and `css/style.css` never need to change for content updates.

## Run locally

Any static server works, e.g.:

```
npx http-server -p 5500 .
```
