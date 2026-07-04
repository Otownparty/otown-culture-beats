import edition1 from "@/assets/edition-1.jpg";
import edition2 from "@/assets/edition-2.jpg";
import edition3 from "@/assets/edition-3.jpg";
import edition4 from "@/assets/edition-4.jpg";
import edition5 from "@/assets/edition-5.jpg";
import edition6 from "@/assets/edition-6.jpg";
import edition7 from "@/assets/edition-7.jpg";
import edition8 from "@/assets/edition-8.jpg";
import edition9 from "@/assets/edition-9.jpg";
import edition10 from "@/assets/edition-10.jpg";
import edition11Asset from "@/assets/edition-11.jpg.asset.json";
import edition12Asset from "@/assets/edition-12.png.asset.json";
import edition13Asset from "@/assets/edition-13.jpg.asset.json";

export interface Edition {
  num: number;
  date: string;
  title: string;
  desc: string;
  img: string;
}

/**
 * PAST / COMPLETED EDITIONS
 * ---------------------------------------------------------
 * Add a new entry here once an edition has happened.
 * Every page (Events, About, Vendor) reads its "how many
 * editions so far" copy from `editions.length` below, so
 * nothing else needs to be touched when this list grows.
 */
export const editions: Edition[] = [
  { num: 12, date: "Sat 27th June 2026", title: "Iseyin Edition", desc: "The movement moved to Iseyin — one night of rave, culture and connection under the stars at Silver ZB Resort.", img: edition12Asset.url },
  { num: 11, date: "Sat 30th May 2026", title: "Glow in the 90s — Chapter II", desc: "The Anniversary Edition — a neon-soaked 90s throwback that lit up Oyo Durbar Stadium.", img: edition11Asset.url },
  { num: 10, date: "Sat 21st March 2026", title: "Denim After Dark", desc: "A Decade of Raving — the 10th edition at Oyo Durbar Stadium.", img: edition10 },
  { num: 9, date: "Tue 30th Dec 2025", title: "POTY", desc: "Party of the Year returned — closing out 2025 at Labamba Resort, Oyo.", img: edition9 },
  { num: 8, date: "Sat 25th Oct 2025", title: "Haunted Groove Halloween", desc: "The scariest night of the year — Haunted Groove at Labamba Resort celebrates African culture.", img: edition8 },
  { num: 7, date: "Sat 31st May 2025", title: "Owambe Edition", desc: "1 Year Anniversary — the Owambe Edition celebrated African culture in full colour.", img: edition7 },
  { num: 6, date: "Sat 15th Feb 2025", title: "XOXO Edition", desc: "The ultimate year-ender — Party of the Year at Labamba Resort.", img: edition6 },
  { num: 5, date: "Sat 21st Dec 2024", title: "Party of the Year", desc: "A spine-chilling Halloween celebration at Labamba Resort.", img: edition5 },
  { num: 4, date: "Sat 26th Oct 2024", title: "Halloween: Terror By Night", desc: "The flyest wave hit Labamba Resort.", img: edition4 },
  { num: 3, date: "Sat 14th Sept 2024", title: "Y2K Edition", desc: "A retro-futuristic throwback — the flyest wave hit Labamba Resort.", img: edition3 },
  { num: 2, date: "Sat 22nd June 2024", title: "Frenzy Edition", desc: "The energy tripled — the Frenzy Edition took Labamba Resort by storm.", img: edition2 },
  { num: 1, date: "Sat 27th April 2024", title: "The Genesis", desc: "Where it all began — music, games, dance, drink, and connect at the very first Otown Party.", img: edition1 },
];

export interface NextEdition {
  num: number;
  title: string;
  desc: string;
  /** Long display form, e.g. "Sat 1st August 2026" */
  date: string;
  /** Short display form, e.g. "August 1, 2026" */
  shortDate: string;
  time: string;
  venue: string;
  img: string;
}

/**
 * UPCOMING / NEXT EDITION
 * ---------------------------------------------------------
 * When a new edition is announced, update this object.
 * When that edition happens, move its details into
 * `editions` above (as the new first entry) and replace
 * this object with the following edition's details.
 */
export const nextEdition: NextEdition = {
  num: 13,
  title: "Faaji Extra",
  desc: "The rave returns to Oyo with more energy, more culture, more Faaji. One night. Extra everything.",
  date: "Sat 1st August 2026",
  shortDate: "August 1, 2026",
  time: "6PM–4AM",
  venue: "Durbar Stadium, Oyo",
  img: edition13Asset.url,
};
