import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/page/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/*.{js,ts,jsx,tsx,mdx}",
    "./",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        lg: { min: "1441px" },
        mo: { max: "1000px" },
        sm: { min: "1001px" },
        md: [{ min: "1001px", max: "1440px" }],
        smd: [{ min: "1001px", max: "1250px" }],
        mnd: [{ min: "1340px", max: "1440px" }],
        al: [{ min: "1001px", max: "1340px" }],
        ms: [{ min: "1001px", max: "1060px" }],
        ws: [{ min: "1001px", max: "1150px" }],
        bt: [{ min: "1151px", max: "1350px" }],
      },

      width: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};
export default config;
