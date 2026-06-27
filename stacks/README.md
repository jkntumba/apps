# Stacks — install it on your phone

Stacks is a Progressive Web App (PWA): a website that installs like a real app —
its own icon, full-screen, works offline, data stored on the device. No App Store needed.

## Files in this folder (keep them together)
- index.html  ← the app
- manifest.webmanifest, sw.js  ← make it installable + offline
- icon-192.png, icon-512.png, icon-512-mask.png  ← app icons

## Quick local use (desktop)
Double-click `index.html`. Works fully offline. (Install prompts need hosting — see below.)

## Put it online for free, then install on your phone

### Easiest — Netlify Drop (no account, ~60 seconds)
1. Go to app.netlify.com/drop
2. Drag THIS WHOLE FOLDER onto the page.
3. It gives you an https link. Open it on your phone.

### GitHub Pages (free, permanent)
1. Create a repo, upload all files to the root.
2. Settings → Pages → Source: main branch → Save.
3. Open the https://you.github.io/repo/ link on your phone.

### Cloudflare Pages / Vercel also work — all free.

## Install on the phone
- iPhone (Safari): open the link → Share → "Add to Home Screen".
- Android (Chrome): open the link → tap "Install app" (or menu → Install).

## Want it as a real store-style app?
- Android APK (free): go to PWABuilder.com, paste your hosted link, and it packages
  an Android app you can sideload. (Or use Google's free Bubblewrap tool.)
- iOS App Store: requires a paid Apple Developer account ($99/yr). The Add-to-Home-Screen
  route above is the free way to get an app on an iPhone.

## What you can do
- File records with condition grades (media + sleeve), price paid & estimated value, tags, pressing/variant, a photo of your copy, and owned/wanted status.
- **Scan a barcode** (form → "Scan barcode") to auto-fill the record. It checks Discogs first (best for vinyl, needs a token) and falls back to MusicBrainz — a free, no-token catalog that lists physical UPC/EAN barcodes — so records bought off Discogs (Amazon, in person) still populate, cover and all. Or fetch real covers separately (iTunes + Discogs; add a token in Library tools for the best vinyl matches).
- See the shape of your collection in **Insights** (decade/format/label/tag, value, spins), spot repeats with **Find duplicates**, and edit in bulk with **Select** mode.
- Browse as a shelf or a crate of spines; the turntable logs each spin and shows what you play most.

## Back up your collection
Library tools (⋮) → Export. Re-import on any device — you'll be asked to **Merge** (keeps everything, fills gaps, never overwrites newer edits) or **Replace** the whole library. Covers fetched online are cached so they keep showing offline.
