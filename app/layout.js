import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script id="vertexShader" type="x-shader/x-vertex"></script>
      <script id="fragmentShader" type="x-shader/x-fragment" />

      <title>PrismaX | A Base Layer for Real-World Multimodal GenAI Apps</title>
      <link rel="icon" href="./prismax-logo.png" />

      <meta
        data-rh="true"
        property="og:title"
        content="PrismaX | A Base Layer for Real-World Multimodal GenAI Apps"
      ></meta>
      <meta
        name="description"
        content="PrismaX | A Base Layer for Real-World Multimodal GenAI Apps"
      />

      <meta
        name="twitter:image"
        content="https://dev-home.prismax.ai/thumbnail.png"
      ></meta>

      <meta
        name="description"
        content="PrismaX | A Base Layer for Real-World Multimodal GenAI Apps"
      />
      <meta
        property="og:title"
        content="The PrismaX Ecosystem is the foundational layer for Real-World Multimodal GenAI Apps. "
      />
      <meta
        property="og:description"
        content="PrismaX | A Base Layer for Real-World Multimodal GenAI Apps"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://dev-home.prismax.ai" />
      <meta
        property="og:image"
        content="https://dev-home.prismax.ai/thumbnail.png"
      />
      <meta property="og:image:alt" content="Default image description" />
      <meta
        property="og:site_name"
        content="The PrismaX Ecosystem is the foundational layer for Real-World Multimodal GenAI Apps. "
      />

      <meta
        data-rh="true"
        property="og:description"
        content="PrismaX | A Base Layer for Real-World Multimodal GenAI Apps"
      ></meta>

      <meta
        name="twitter:title"
        content="The PrismaX Ecosystem is the foundational layer for Real-World Multimodal GenAI Apps. "
      ></meta>
      <meta
        name="twitter:description"
        content="PrismaX | A Base Layer for Real-World Multimodal GenAI Apps"
      ></meta>
      <meta name="twitter:site" content="@PrismaXai/"></meta>
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta
        name="twitter:image"
        content="https://dev-home.prismax.ai/thumbnail.png"
      ></meta>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Quattrocento+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
