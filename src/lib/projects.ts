import type { Project } from "../data/content";

/**
 * One definition of "active", shared by every consumer.
 *
 * The /projects page, llms.txt and the syndication feeds all split projects the
 * same way, and they used to each carry their own test — llms.txt matched
 * `startsWith("Active")` while the page matched `=== "Active"`, so a status of
 * "Active (paused)" would have appeared in one and not the other. Status is a
 * free-text field, so the exact match is the honest one: anything that is not
 * literally "Active" reads as past, which covers Archived, Exited and
 * No Longer Maintained without naming them anywhere.
 */
export const isActive = (project: Project): boolean => project.status === "Active";

/** Array order from content.ts is the display order, and is preserved. */
export function splitByStatus<T extends Project>(items: readonly T[]) {
  return {
    active: items.filter(isActive),
    past: items.filter((project) => !isActive(project)),
  };
}

/**
 * Projects belonging to one owner. The join key is the company's `name`, since
 * that is what `association` carries — "Epilogue", not the "epilogue" slug.
 */
export function byAssociation<T extends Project>(
  items: readonly T[],
  association: string,
): T[] {
  return items.filter((project) => project.association === association);
}
