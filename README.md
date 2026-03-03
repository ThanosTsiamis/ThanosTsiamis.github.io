# ThanosTsiamis.github.io (Windows 98 Edition)

Retro personal website built with Jekyll, styled as a Windows 98 desktop.

## Features

- Windows 98 style shell (window, taskbar, start menu, tray, clock)
- Desktop icons (`My Computer`, `Recycle Bin`, shortcuts)
- Functional controls (minimize, maximize, close, restore)
- Easter eggs and safe visual prank mode
- CV/Projects/Home content driven by `_data/*.yml`
- Regression tests to protect key functionality

## Project Structure

- `_layouts/default.html`: main shell UI + JS interactions
- `assets/css/win98.css`: Windows 98 styling
- `pages/`: markdown pages (about, projects, cv, contact, 404)
- `_data/`: shared content and configuration
- `test/site_features_test.rb`: regression tests
- `test/site_expectations.yml`: test expectations (easy to modify)

## Local Setup

```bash
bundle install
```

## Run Locally

```bash
bundle exec jekyll serve
```

Site will be available at `http://127.0.0.1:4000`.

## Build

```bash
bundle exec jekyll build
```

## Tests

Run either:

```bash
./bin/test
```

or:

```bash
rake test
```

## Content Updates

- Navigation links: `_data/navigation.yml`
- Social links/email: `_data/social.yml`
- CV content: `_data/cv.yml`
- Projects content: `_data/projects.yml`
- Homepage content: `index.md`
- Other pages: `pages/*.md`

## Profile Photo

Place your photo at:

`assets/profile.jpg`

The homepage is already wired to render it.

## Analytics (GA4)

Set your Google Analytics Measurement ID in `_config.yml`:

`google_analytics_id: "G-XXXXXXXXXX"`

Tracking loads only after the user accepts the cookie banner (and on future visits after that consent is saved).
