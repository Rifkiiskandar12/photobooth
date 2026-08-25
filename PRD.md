# Product Requirements Document (PRD)
## Aesthetic Photobooth Web Application

**Product Name:** [Nama Photobooth]  
**Product Type:** Web-based Digital Photobooth  
**Platform:** Responsive Web Application  
**Primary Experience:** Upload / Camera → Choose Layout → Customize Frame → Preview → Download  
**Design Direction:** Aesthetic, Minimalist, Playful, Premium

---

# 1. Product Overview

Website ini merupakan aplikasi photobooth berbasis web yang memungkinkan pengguna membuat photo strip atau photo collage secara langsung melalui browser.

Pengguna dapat:

- Mengambil foto menggunakan kamera perangkat.
- Mengunggah foto dari perangkat.
- Memilih berbagai layout photobooth.
- Mengatur warna frame.
- Menggunakan berbagai style/template frame.
- Melihat preview hasil secara real-time.
- Mengatur posisi dan crop foto.
- Menghasilkan foto final.
- Mengunduh hasil dalam format gambar.

Website harus terasa seperti menggunakan **digital photobooth studio**, bukan seperti form upload biasa.

Visual website harus mengutamakan:

- Minimalism
- White space
- Typography yang elegan
- Rounded elements
- Soft shadows
- Subtle animation
- Smooth transitions
- Interactive preview
- Editorial / fashion aesthetic

---

# 2. Design Reference

UI/UX menggunakan pendekatan visual dan interaction pattern dari **Skiper UI** sebagai referensi utama.

[Skiper UI Components](https://skiper-ui.com/components?utm_source=chatgpt.com)

Skiper UI memiliki pendekatan komponen React yang menekankan animated interactions, carousel, cards, scroll effects, hero sections, dan micro-interactions.

Namun, website tidak boleh menjadi copy dari Skiper UI.

Skiper UI digunakan sebagai **component inspiration dan implementation source**, sedangkan visual identity tetap dibuat khusus untuk brand photobooth.

---

# 3. Product Goals

## Primary Goals

1. Membuat pengalaman photobooth digital yang mudah digunakan.
2. Membuat pengguna dapat menghasilkan foto aesthetic dalam waktu singkat.
3. Menyediakan berbagai layout photobooth.
4. Memberikan kebebasan untuk memilih warna dan style frame.
5. Membuat hasil akhir terlihat profesional tanpa membutuhkan software editing.
6. Menyediakan UI yang menarik sehingga pengguna ingin mencoba berbagai template.

## Success Criteria

Target pengalaman:

**Open Website → Choose Photos → Customize → Download**

dapat dilakukan tanpa tutorial panjang.

Target waktu:

**≤ 2–3 menit** untuk menghasilkan satu foto final.

---

# 4. Target Users

## Primary User

Anak muda usia 15–30 tahun yang:

- Suka fotografi.
- Suka aesthetic content.
- Sering menggunakan Instagram / TikTok.
- Suka photo booth.
- Ingin membuat photo strip digital.
- Membutuhkan foto untuk social media.

## Secondary User

- Event organizer.
- Wedding organizer.
- Cafe.
- Brand.
- Kampus / sekolah.
- Event komunitas.
- Digital photobooth business.

---

# 5. User Journey

### Flow utama

```text
Landing Page
      ↓
Start Photobooth
      ↓
Choose Input
 ┌───────────────┐
 │ Camera        │
 │ Upload Photos │
 └───────────────┘
      ↓
Select Layout
      ↓
Customize Frame
      ↓
Preview Result
      ↓
Edit / Retake
      ↓
Generate Photo
      ↓
Download
```

---

# 6. Landing Page

Landing page harus menjadi kombinasi antara **portfolio showcase + entry point ke photobooth**.

## 6.1 Navbar

Navbar minimalis.

Elements:

- Logo
- Templates
- How It Works
- About
- CTA "Create Photo"

Contoh:

```text
[LOGO]

Templates    How It Works    About

                         [Create Photo ↗]
```

Navbar dapat menggunakan animated navigation / magnetic button style yang terinspirasi dari Skiper UI.

---

# 7. Hero Section

Hero merupakan bagian paling visual.

## Content

Headline:

> Make memories look beautiful.

Subheadline:

> Create aesthetic photo strips and collages directly from your browser.

CTA:

**Create Your Photo →**

Secondary CTA:

**Explore Templates**

## Visual

Bagian kanan / tengah menampilkan beberapa hasil photobooth yang bergerak perlahan.

Contoh:

```text
        ┌─────────┐
        │ PHOTO   │
        │         │
        │ PHOTO   │
        │         │
        │ PHOTO   │
        └─────────┘

   ┌───────────────┐
   │ PHOTO PHOTO   │
   │ PHOTO PHOTO   │
   └───────────────┘
```

Gunakan:

- Floating cards
- Subtle parallax
- Hover interaction
- Slow movement
- Image reveal animation

Hindari animasi berlebihan.

---

# 8. Template Showcase

Section:

## Choose Your Mood

Menampilkan berbagai template photobooth.

Contoh kategori:

- Classic Strip
- Minimal
- Film
- Polaroid
- Grid
- Editorial
- Vintage
- Cute
- Party
- Wedding

Template ditampilkan dalam card grid.

Contoh:

```text
┌────────────┐ ┌────────────┐ ┌────────────┐
│            │ │            │ │            │
│   PHOTO    │ │   PHOTO    │ │   PHOTO    │
│            │ │   PHOTO    │ │            │
│   PHOTO    │ │   PHOTO    │ │   PHOTO    │
│            │ │            │ │            │
├────────────┤ ├────────────┤ ├────────────┤
│ Classic    │ │ Film       │ │ Polaroid   │
└────────────┘ └────────────┘ └────────────┘
```

Card menggunakan hover animation.

Saat hover:

- Card sedikit naik.
- Image zoom 1–3%.
- Border berubah.
- Template name muncul.
- CTA "Use Template" muncul.

---

# 9. Photo Booth Editor

Ini merupakan fitur utama aplikasi.

Layout desktop:

```text
┌─────────────────────────────────────────────────────────┐
│ LOGO                              Back    Save           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│       ┌───────────────────┐       ┌────────────────┐   │
│       │                   │       │ Layout         │   │
│       │                   │       │                │   │
│       │    PHOTO          │       │ ○ Classic      │   │
│       │    PREVIEW        │       │ ○ Film         │   │
│       │                   │       │ ○ Grid         │   │
│       │                   │       │ ○ Polaroid     │   │
│       │                   │       │                │   │
│       │                   │       │ Frame Color    │   │
│       │                   │       │ ○ ○ ○ ○ ○      │   │
│       └───────────────────┘       │                │   │
│                                   │ [Download]      │   │
│                                   └────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

# 10. Photo Input

Pengguna mempunyai dua pilihan.

## Option A — Camera

Button:

**Take a Photo**

Saat ditekan:

1. Browser meminta camera permission.
2. Camera preview muncul.
3. Countdown:

```text
3
2
1
```

4. Foto diambil.
5. Foto masuk ke editor.

Camera harus mendukung:

- Front camera
- Back camera
- Camera switching jika tersedia
- Retake
- Capture

---

# 11. Upload Photo

Button:

**Upload Photos**

Support:

- JPG
- JPEG
- PNG
- WebP

Drag & drop juga tersedia.

Contoh:

```text
┌───────────────────────────────┐
│                               │
│          +                   │
│                               │
│   Drop your photos here       │
│                               │
│   or click to browse          │
│                               │
└───────────────────────────────┘
```

Maximum:

**6 photos per session**

---

# 12. Photo Management

Setelah upload:

```text
Your Photos

┌──────┐ ┌──────┐ ┌──────┐
│ IMG1 │ │ IMG2 │ │ IMG3 │
└──────┘ └──────┘ └──────┘

[ + Add Photo ]
```

User dapat:

- Delete photo
- Replace photo
- Reorder photo
- Crop photo
- Rotate photo

Drag & drop digunakan untuk reorder.

---

# 13. Layout System

Website memiliki sistem layout dinamis.

## Layout Examples

### Classic Strip

```text
┌──────────────┐
│              │
│    PHOTO     │
│              │
├──────────────┤
│    PHOTO     │
├──────────────┤
│    PHOTO     │
├──────────────┤
│    PHOTO     │
│              │
└──────────────┘
```

### 2×2 Grid

```text
┌─────────┬─────────┐
│ PHOTO   │ PHOTO   │
├─────────┼─────────┤
│ PHOTO   │ PHOTO   │
└─────────┴─────────┘
```

### Polaroid

```text
┌─────────────────┐
│                 │
│      PHOTO      │
│                 │
│                 │
│     caption     │
└─────────────────┘
```

### Film Strip

```text
┌────────────────────┐
│ ○ ○ ○              │
│      PHOTO         │
│                    │
│      PHOTO         │
│                    │
│      PHOTO         │
│ ○ ○ ○              │
└────────────────────┘
```

### Editorial

Layout lebih bebas dengan kombinasi:

- Large image
- Small image
- Typography
- Decorative element

---

# 14. Frame Customization

User dapat mengganti warna frame.

## Default Colors

- White
- Black
- Cream
- Beige
- Brown
- Pink
- Red
- Blue
- Green
- Lavender

Tambahkan custom color picker.

```text
Frame Color

○ ○ ○ ○ ○ ○ ○

[ + Custom Color ]
```

## Advanced

User dapat memilih:

- Frame color
- Border thickness
- Corner radius
- Inner spacing
- Photo gap
- Background texture

---

# 15. Background Customization

Background tidak hanya berupa warna.

Options:

### Solid

```text
#FFFFFF
#000000
#F5F0E8
```

### Gradient

Contoh:

```text
Cream → Pink
Blue → Purple
Green → Cream
```

### Texture

Optional:

- Paper
- Film grain
- Noise
- Polaroid texture

---

# 16. Typography / Caption

Optional caption.

User dapat menambahkan:

```text
Text:

"Summer Memories"

"08.25.26"

"Best Day Ever"

"Rifki & Friends"
```

Settings:

- Font
- Font size
- Alignment
- Letter spacing
- Position

Font categories:

- Serif
- Sans Serif
- Mono
- Handwritten

---

# 17. Filters

Website menyediakan filter foto.

Basic filters:

- Original
- Warm
- Cool
- Vintage
- Film
- B&W
- Soft
- Fade
- Retro

Filter diterapkan secara real-time ke preview.

Contoh:

```text
Filters

Original   Warm   Film   Retro   B&W
```

User dapat melihat preview filter sebelum memilih.

---

# 18. Photo Editing

Setiap foto dapat diedit secara individual.

Features:

- Crop
- Zoom
- Position
- Rotate
- Flip
- Filter
- Brightness
- Contrast
- Saturation

Interface:

```text
Selected Photo

[ Crop ]
[ Rotate ]
[ Flip ]

Brightness ━━━━━━━●━━
Contrast   ━━━━━●━━━━
Saturation ━━━━●━━━━━
```

---

# 19. Real-time Preview

Preview harus berubah secara real-time.

Ketika user:

- Mengubah layout
- Mengubah warna
- Mengubah filter
- Mengubah spacing
- Menambahkan text

hasil preview langsung berubah.

Tidak membutuhkan tombol "Apply".

---

# 20. Final Preview

Sebelum download, tampilkan modal:

```text
Your photo is ready ✨

┌─────────────────┐
│                 │
│     RESULT      │
│                 │
│                 │
└─────────────────┘

[ Edit Again ]

[ Download Photo ]
```

Optional:

**Share**

---

# 21. Download

Format:

- PNG
- JPG

Default:

**PNG**

Optional quality:

- Standard
- High Quality

Filename:

```text
photobooth-2026-08-25.png
```

---

# 22. Responsive Design

## Desktop

Editor menggunakan:

```text
Preview | Controls
```

## Tablet

```text
Preview
────────
Controls
```

## Mobile

Editor menjadi vertical:

```text
Preview

Layout
Frame
Filter
Text
Photo

[Download]
```

Bottom navigation dapat digunakan:

```text
Layout | Frame | Filter | Text | More
```

---

# 23. UI Design System

## Visual Style

Primary style:

**Minimalist Editorial**

Characteristics:

- Large whitespace
- Thin borders
- Rounded corners
- Soft shadows
- Neutral colors
- Elegant typography
- Subtle motion

## Color Palette

### Primary

`#111111`

### Background

`#FAFAF7`

### Secondary Background

`#F1EFEA`

### Accent

`#D9A7A0`

### Text

`#171717`

### Muted

`#777777`

---

# 24. Typography

Recommended:

### Heading

Editorial serif:

- Playfair Display
- Cormorant Garamond
- DM Serif Display

### Body

Modern sans:

- Inter
- Geist
- DM Sans

### UI

Geist / Inter.

Gunakan kontras antara serif heading dan sans-serif UI agar website terasa seperti editorial fashion / photography studio.

---

# 25. Animation Guidelines

Animation harus terasa premium dan tidak mengganggu.

Gunakan:

- Fade
- Slide
- Scale
- Blur reveal
- Parallax
- Hover lift
- Magnetic button
- Smooth page transition

Skiper UI memang menyediakan banyak pola seperti scroll-driven reveal, carousel, preloader, parallax, cursor effects, dan animated cards yang bisa menjadi referensi motion design.

### Animation duration

Micro interaction:

`150–250ms`

Normal:

`300–500ms`

Page transition:

`500–800ms`

Hindari:

- Excessive bouncing
- Excessive scaling
- Animasi setiap elemen
- Motion yang terlalu cepat

---

# 26. Skiper UI Component Mapping

Komponen Skiper UI digunakan sesuai kebutuhan.

| Website Feature | Skiper UI Direction |
|---|---|
| Hero | Animated Hero |
| Template showcase | Card / Card Carousel |
| Template gallery | Animated Cards |
| Navbar | Animated Navigation |
| CTA | Magnetic / Animated Button |
| Photo preview | Interactive Card |
| Template slider | Carousel |
| Filter selection | Animated Tabs |
| Color picker | Interactive Controls |
| Upload modal | Dialog / Modal |
| Camera modal | Dialog |
| Download modal | Modal |
| Theme switch | Theme Toggle |
| Page transition | Preloader / Page Transition |
| Gallery section | Scroll Reveal |
| Template categories | Horizontal Scroll |
| Mobile menu | Animated Navigation |

Skiper UI dapat ditambahkan satu per satu melalui shadcn registry, sehingga tidak perlu memasukkan seluruh library sekaligus.

---

# 27. Recommended Tech Stack

## Frontend

**Next.js**

**React**

**TypeScript**

**Tailwind CSS**

## UI

**Skiper UI**

**shadcn/ui**

**Lucide React**

## Animation

**Motion / Framer Motion**

**GSAP** jika membutuhkan animation yang lebih kompleks.

Skiper UI sendiri menggunakan ekosistem React/Tailwind dan sejumlah komponen menggunakan Framer Motion atau GSAP untuk animasi.

---

# 28. Image Processing

Image processing dilakukan di client-side sebanyak mungkin.

Recommended:

- Canvas API
- HTML Canvas
- OffscreenCanvas jika diperlukan

Tujuan:

- Mengurangi upload ke server.
- Preview lebih cepat.
- Privacy lebih baik.
- User dapat langsung menghasilkan foto.

Pipeline:

```text
Original Image
      ↓
Crop
      ↓
Transform
      ↓
Filter
      ↓
Layout
      ↓
Frame
      ↓
Text
      ↓
Canvas
      ↓
Export PNG/JPG
```

---

# 29. Camera Architecture

Browser camera menggunakan:

```text
navigator.mediaDevices.getUserMedia()
```

Flow:

```text
Request Permission
       ↓
Camera Stream
       ↓
Preview
       ↓
Countdown
       ↓
Capture Frame
       ↓
Convert to Image
       ↓
Editor
```

Jika permission ditolak:

```text
Camera unavailable

[Upload Photos Instead]
```

---

# 30. Privacy

Karena aplikasi memproses foto pribadi, prinsip privacy-first harus diterapkan.

Default:

**Foto diproses di browser.**

Jangan upload foto ke server kecuali fitur tersebut memang dibutuhkan.

Tampilkan informasi:

> Your photos stay on your device.

Jika suatu saat server processing digunakan, harus terdapat:

- Privacy notice
- Consent
- Delete policy
- Secure upload

---

# 31. Error States

## Camera Permission Denied

```text
We can't access your camera.

Please allow camera access or upload photos instead.

[Upload Photos]
```

## Unsupported Browser

```text
Your browser doesn't support camera access.

Try using a modern browser such as Chrome, Safari, or Edge.
```

## Invalid File

```text
This file format isn't supported.
Please upload JPG, PNG, or WebP.
```

## Too Many Photos

```text
You can add up to 6 photos.
```

---

# 32. Loading States

Gunakan skeleton / subtle loader.

Contoh:

```text
Preparing your photo...

████████░░░░
```

Jangan menggunakan loading spinner yang terlalu generic jika bisa menggunakan animation yang lebih aesthetic.

---

# 33. Accessibility

Website harus mendukung:

- Keyboard navigation
- Focus states
- ARIA labels
- Alt text
- Sufficient color contrast
- Reduced motion preference
- Screen reader friendly controls

Jika user mengaktifkan:

```text
prefers-reduced-motion
```

maka animation harus dikurangi.

---

# 34. Performance

Target:

- Landing page cepat dibuka.
- Lazy load image.
- Compress preview assets.
- Jangan load seluruh template image sekaligus.
- Dynamic import untuk editor.
- Optimized image rendering.
- Avoid unnecessary re-render pada canvas.

Target UX:

```text
Landing Page Interactive < 2–3 sec
Editor Interaction < 100ms
Preview Update ≈ realtime
```

---

# 35. MVP Scope

### Phase 1 — MVP

- Landing page
- Camera capture
- Upload image
- Photo preview
- 5–8 layouts
- Frame color
- Basic filters
- Basic crop
- Text
- PNG download
- Responsive mobile
- Desktop editor

### Phase 2

- More templates
- Advanced filters
- Background textures
- More typography
- Drag & drop
- Better image positioning
- JPG export
- High-quality export

### Phase 3

- User accounts
- Save projects
- Cloud storage
- Share link
- QR code
- Event mode
- Custom branded photobooth

---

# 36. Future Event Mode

Untuk penggunaan di event, tambahkan:

```text
EVENT MODE

[Start Session]

Camera
   ↓
Take 4 Photos
   ↓
Select Template
   ↓
Generate
   ↓
QR Code
   ↓
Download
```

Pengunjung dapat scan QR untuk mengambil hasil fotonya.

---

# 37. Suggested Landing Page Structure

```text
NAVBAR

        ↓

HERO
"Make memories look beautiful."

        ↓

FEATURED PHOTO SHOWCASE

        ↓

TEMPLATE GALLERY
"Choose Your Mood"

        ↓

HOW IT WORKS

1. Take or Upload
2. Customize
3. Download

        ↓

INTERACTIVE PHOTO SHOWCASE

        ↓

FEATURES

Camera
Layouts
Filters
Frames

        ↓

FINAL CTA

"Ready to make a memory?"

[Create Your Photo]

        ↓

FOOTER
```

---

# 38. Core Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | User dapat membuka landing page | Must |
| FR-02 | User dapat menggunakan kamera | Must |
| FR-03 | User dapat upload foto | Must |
| FR-04 | User dapat memilih layout | Must |
| FR-05 | User dapat mengubah frame | Must |
| FR-06 | User dapat memilih warna frame | Must |
| FR-07 | User dapat menggunakan filter | Must |
| FR-08 | User dapat melakukan crop | Must |
| FR-09 | User dapat menambahkan text | Should |
| FR-10 | User dapat melihat preview realtime | Must |
| FR-11 | User dapat mengunduh foto | Must |
| FR-12 | Website responsive | Must |
| FR-13 | User dapat mengganti background | Should |
| FR-14 | User dapat mengatur spacing | Should |
| FR-15 | User dapat menggunakan custom color | Should |
| FR-16 | User dapat share hasil | Could |
| FR-17 | User dapat menyimpan project | Future |
| FR-18 | Event mode | Future |

---

# 39. Non-Functional Requirements

## Performance

Aplikasi harus tetap responsif ketika menangani beberapa foto sekaligus.

## Security

Tidak menyimpan foto pengguna secara permanen tanpa consent.

## Compatibility

Target:

- Chrome
- Edge
- Safari
- Firefox

## Responsive

Support:

- Mobile
- Tablet
- Desktop

---

# 40. Final Product Experience

Pengalaman yang ingin dicapai:

> User membuka website dan langsung merasa seperti masuk ke sebuah digital photography studio.

Bukan:

> "Ini website untuk edit foto."

Tetapi:

> "Ini tempat untuk membuat memory yang aesthetic."

Visual harus terasa:

**Apple × Pinterest × Digital Photobooth × Editorial Photography**

dengan interaction quality yang terinspirasi oleh Skiper UI.

---

# 41. Recommended MVP Screens

Minimal terdapat **7 screen utama**:

1. **Landing Page**
2. **Photo Source Selection**
3. **Camera Capture**
4. **Photo Upload / Management**
5. **Photobooth Editor**
6. **Final Preview**
7. **Download / Share Result**

---

# 42. Primary CTA

CTA utama di seluruh website:

> **Create Your Photo ↗**

CTA sekunder:

> **Explore Templates**

Pada editor:

> **Generate Photo**

Pada hasil:

> **Download**

---

# 43. Design Principle

Tiga prinsip utama:

### 01 — Simple

User tidak perlu memahami editing foto.

### 02 — Beautiful

Setiap state harus terlihat aesthetic.

### 03 — Playful

Interaksi harus terasa menyenangkan.

---

# 44. Product One-Liner

**An aesthetic digital photobooth that lets you capture, customize, and create beautiful photo memories directly from your browser.**

---

# 45. Development Priority

Urutan development yang disarankan:

```text
1. Design System
        ↓
2. Landing Page
        ↓
3. Camera / Upload
        ↓
4. Photo State Management
        ↓
5. Layout Engine
        ↓
6. Frame Customization
        ↓
7. Filter Engine
        ↓
8. Canvas Rendering
        ↓
9. Export
        ↓
10. Responsive Optimization
        ↓
11. Animation Polish
        ↓
12. Performance Optimization
```

**Catatan implementasi:** Skiper UI memiliki komponen free dan premium, dan dokumentasinya menyebut bahwa penggunaan versi free memerlukan attribution, sedangkan komponen Pro membutuhkan lisensi. Jadi saat development, pilih komponen yang memang tersedia untuk penggunaan yang sesuai dengan lisensi proyek.