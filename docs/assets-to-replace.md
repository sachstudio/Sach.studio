# Assets to replace before launch

Every file in `public/images/` was cropped from a 1x render of the Figma design (frame renders are in `design/figma-renders/`, git-ignored). They are good enough to build and review, but they are not original-resolution. Export the originals from Figma at 2x and overwrite the files below using the same names and formats; no code changes needed.

Re-run `node scripts/crop-assets.mjs` to regenerate the crops from the renders.

| File | Source frame | Box (x, y, w, h) |
|---|---|---|
| `public/images/hero/hero-photo.webp` | home | 320, 833, 1280, 720 |
| `public/images/logos/gulf-cv-writers.png` | home | 590, 1995, 200, 90 |
| `public/images/logos/hasiru-dala.png` | home | 860, 1995, 210, 90 |
| `public/images/logos/master-systems.png` | home | 1145, 1995, 170, 90 |
| `public/images/process/step-1.png` | home | 320, 4273, 380, 380 |
| `public/images/process/step-2.png` | home | 770, 4273, 380, 380 |
| `public/images/process/step-3.png` | home | 1220, 4273, 380, 380 |
| `public/images/why/integrations.png` | home | 976, 6796, 634, 300 |
| `public/images/testimonials/avatar-1.png` | home | 366, 8238, 80, 52 |
| `public/images/testimonials/avatar-2.png` | home | 1041, 8238, 80, 52 |
| `public/images/about/founder.webp` | about | 970, 1170, 630, 768 |
| `public/images/values/quality.png` | about | 440, 2435, 140, 130 |
| `public/images/values/communication.png` | about | 870, 2435, 140, 130 |
| `public/images/values/growth.png` | about | 1300, 2435, 140, 130 |
| `public/images/values/design.png` | about | 1730, 2435, 140, 130 |
| `public/images/projects/hasiru-dala-card.webp` | projects | 320, 620, 630, 476 |
| `public/images/projects/gulf-cv-writers-card.webp` | projects | 320, 1160, 630, 470 |
| `public/images/projects/master-systems-card.webp` | projects | 320, 1700, 630, 470 |
| `public/images/projects/arizona-loan-card.webp` | projects | 320, 2236, 630, 474 |
| `public/images/projects/arizona-investment-card.webp` | webapps | 320, 596, 614, 484 |
| `public/images/projects/medismart-card.webp` | webapps | 986, 596, 614, 484 |
| `public/images/projects/hasiru-dala-hero.webp` | hdi | 320, 586, 1280, 724 |
| `public/images/projects/gulf-cv-writers-hero.webp` | gulf | 320, 590, 1280, 722 |
| `public/images/projects/cosmion-hero.webp` | cosmion | 320, 590, 1280, 722 |
| `public/images/projects/master-systems-hero.webp` | master | 320, 590, 1280, 722 |
| `public/images/logos/case-hasiru-dala.png` | hdi | 310, 1505, 300, 100 |
| `public/images/logos/case-gulf-cv-writers.png` | gulf | 310, 1505, 300, 100 |
| `public/images/logos/cosmion.png` | cosmion | 310, 1505, 320, 110 |
| `public/images/logos/case-master-systems.png` | master | 310, 1505, 300, 100 |
| `public/images/projects/hasiru-dala-banner.webp` | hdi | 320, 2120, 1280, 410 |
| `public/images/projects/hasiru-dala-feature.webp` | hdi | 320, 4300, 1280, 636 |
| `public/images/projects/hasiru-dala-gallery-1.webp` | hdi | 320, 5776, 1280, 732 |
| `public/images/projects/hasiru-dala-gallery-2.webp` | hdi | 320, 6536, 1280, 636 |
| `public/images/projects/gulf-cv-writers-banner.webp` | gulf | 320, 2090, 1280, 410 |
| `public/images/projects/cosmion-banner.webp` | cosmion | 320, 2125, 1280, 410 |
| `public/images/projects/master-systems-banner.webp` | master | 320, 2050, 1280, 412 |
| `public/images/blogs/wcag-contrast-tools-cover.webp` | blogs | 320, 426, 606, 324 |
| `public/images/blogs/master-systems-cover.webp` | blogs | 996, 426, 604, 324 |
| `public/images/blogs/gulf-cv-writers-cover.webp` | blogs | 320, 990, 606, 320 |
| `public/images/blogs/design-process-cover.webp` | blogs | 996, 990, 604, 320 |
| `public/images/thanks/hands.png` | thanks | 800, 310, 150, 150 |

## Known weak crops

- `testimonials/avatar-1.png` and `avatar-2.png` are small and soft; the other four testimonial avatars are not visible in the Figma frames and use initials.
- `why/integrations.png` shows only part of the tool-icon orbit; replace with the full artwork.
- Cosmion has no Works-card image in Figma, so its hero crop is used as the card image.
