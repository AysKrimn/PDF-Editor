# PDF Editor

A simple browser based PDF editing and creation application built with React, TypeScript and modern web APIs.
## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.x |
| Language | TypeScript | 5.9 |
| Build Tool | Vite | 7.x |
| Styling | Tailwind CSS | 4.x |
| PDF Parsing & Rendering | pdfjs-dist | 5.x |
| PDF Generation & Modification | pdf-lib | 1.17 |
| Font Embedding | @pdf-lib/fontkit | 1.1 |
| Icons | lucide-react | 0.575 |

## Features

### Edit Mode (will be avaiable in upcoming PRs)
- Upload an existing PDF and interact with its layers
- Click any item to select and double-click to active edit mode
- Delete items and restore them later
- Live preview rendering with embedded PDF fonts
- Export modified PDF with full Unicode support

### Create Mode
- Start from a blank A4 canvas (595 × 842 pt)
- Add draggable, resizable components
- In-place text editing with double-click
- Customizable font family, font size, font weight, font style, text alignment and color
- Automatic word wrapping in PDF export
- Custom file name for download

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## Preview 

### Main Screen 
- App offers two options, edit existing a pdf (user will upload file from computer) or create a new one

<img width="847" height="511" alt="image" src="https://github.com/user-attachments/assets/2f103512-c8d1-4b5d-a45e-24ed91f9a4a8" />


### Edit Screen 
- The user can select predefined components (text, image, list) from the left sidebar and use them.
- The user can modify the selected component's styles such as font size, font family, font weight etc.
- The user can change the project name in the top center and download the PDF by clicking "İndir" on the right side.

<img width="1352" height="553" alt="image" src="https://github.com/user-attachments/assets/d7329353-7167-4f6f-8b79-faa5782816ee" />


## Upcoming features in upcoming PR 
- Improved UI style for better user experience
- Option to edit existing pdf file
- Localiziation for English
