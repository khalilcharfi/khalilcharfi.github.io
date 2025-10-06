export const DEFAULT_SECTION_IDS = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'publications',
  'certificates',
  'contact'
];

/**
 * Returns the list of section ids to render, respecting the order provided via the
 * VITE_SECTIONS_ORDER env var and the enabled list via VITE_ENABLED_SECTIONS.
 *
 * - VITE_SECTIONS_ORDER: comma-separated list defining the desired order.
 *                       Sections not listed will keep their default order at the end.
 * - VITE_ENABLED_SECTIONS: comma-separated list of section ids to include.
 *                          If omitted, all default sections are enabled.
 */
export const getSectionIds = (): string[] => {
  const orderEnv = (import.meta as any).env?.VITE_SECTIONS_ORDER as string | undefined;
  const enabledEnv = (import.meta as any).env?.VITE_ENABLED_SECTIONS as string | undefined;

  const desiredOrder = orderEnv
    ? orderEnv.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_SECTION_IDS;

  const enabledSet = new Set(
    enabledEnv && enabledEnv.trim().length > 0
      ? enabledEnv.split(',').map((s) => s.trim())
      : DEFAULT_SECTION_IDS
  );

  // Preserve order while filtering out disabled sections
  const orderedEnabled = desiredOrder.filter((id) => enabledSet.has(id));

  // Ensure any enabled sections not explicitly ordered appear after the ordered ones
  DEFAULT_SECTION_IDS.forEach((id) => {
    if (enabledSet.has(id) && !orderedEnabled.includes(id)) {
      orderedEnabled.push(id);
    }
  });

  return orderedEnabled;
};
