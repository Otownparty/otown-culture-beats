/**
 * This file intentionally does NOT define the editions data itself.
 *
 * The real source of truth is src/pages/Events.tsx — that's the file
 * you (and Lovable) update whenever a new edition happens or a new
 * one is announced, since that's where the pictures get added.
 *
 * This file just re-exports that data so About.tsx and Vendor.tsx
 * (and anything else) can use it without importing a page component
 * directly. You should never need to edit this file.
 */
export { editions, nextEdition } from "@/pages/Events";
export type { Edition, NextEdition } from "@/pages/Events";
