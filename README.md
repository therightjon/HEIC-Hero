# HEIC Hero

HEIC Hero is a sleek and efficient web application designed to convert HEIC (High Efficiency Image Container) files into the widely compatible JPEG format. Built with modern web technologies, it offers a fast, user-friendly, and completely client-side conversion process.

![HEIC Hero Screenshot](https://placehold.co/800x450.png)
*A placeholder screenshot of the HEIC Hero user interface.*

## ✨ Features

-   **Effortless Conversion**: Easily convert HEIC and HEIF images to high-quality JPEGs.
-   **Drag & Drop Interface**: A modern, intuitive drag-and-drop zone for uploading files.
-   **Batch Processing**: Upload and convert multiple files at once.
-   **Conversion Queue**: View the status of each file as it's being processed (`waiting`, `processing`, `completed`, `failed`).
-   **Direct Downloads**: Download your converted JPEG files with a single click.
-   **Responsive Design**: A clean, fully responsive layout that works on desktops, tablets, and mobile devices.
-   **Dark Mode**: A beautiful dark-themed UI for comfortable viewing in low-light environments.

## 🛠️ Tech Stack

This project is built using a modern, type-safe, and component-based architecture:

-   **[Next.js](https://nextjs.org/)**: A React framework for building server-rendered and static web applications.
-   **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that enhances code quality and maintainability.
-   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
-   **[ShadCN UI](https://ui.shadcn.com/)**: A collection of beautifully designed, reusable components.
-   **[Lucide React](https://lucide.dev/)**: A simply beautiful and consistent icon toolkit.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (version 18 or later) and npm installed on your machine.

### Installation & Running

1.  **Clone the repository** (or download the source code):
    ```sh
    git clone https://github.com/your-username/heic-hero.git
    cd heic-hero
    ```

2.  **Install NPM packages**:
    ```sh
    npm install
    ```

3.  **Run the development server**:
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You can start editing the main page by modifying `src/app/page.tsx`.

### Building for Production

To create a production-ready build of the application, run:

```sh
npm run build
```

This will create an optimized build in the `.next` directory, which can then be started with:

```sh
npm run start
```

## 📄 License

This project is open-source and available under the MIT License.
