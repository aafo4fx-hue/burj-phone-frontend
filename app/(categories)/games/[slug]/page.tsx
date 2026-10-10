import { slugConfigs } from "../../../lib/categoryConfig";

export { default, generateMetadata } from "../../[slug]/page";
// 24-hour revalidate: category content changes infrequently.
// On-demand revalidation via revalidateTag() handles immediate updates from admin.
export const revalidate = 86400;

export function generateStaticParams() {
  return Object.entries(slugConfigs)
    .filter(([_, config]) => config.parentHref === "/games")
    .map(([slug]) => ({ slug }));
}
