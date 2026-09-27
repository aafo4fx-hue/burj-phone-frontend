import { slugConfigs } from "../../../lib/categoryConfig";

export { default, generateMetadata } from "../../[slug]/page";
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.entries(slugConfigs)
    .filter(([_, config]) => config.parentHref === "/smartphones")
    .map(([slug]) => ({ slug }));
}
