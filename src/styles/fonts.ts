import { Nanum_Myeongjo } from "next/font/google";
import localFont from "next/font/local";

const haasgrotdisp = localFont({ src: "./HaasGrotDisp-55Roman.ttf" });

// define your variable fonts
const nanumMyeongjo = Nanum_Myeongjo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nanum",
});

export { nanumMyeongjo, haasgrotdisp };
