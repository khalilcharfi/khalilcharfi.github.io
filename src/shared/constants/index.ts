export const ANIMATION_DURATION = {
  THEME_TRANSITION: 400,
  MODAL_CLOSE: 300,
  LOADING_FADE: 300,
  PERF_REPORT_DELAY: 2000,
  THREE_PRELOAD_TIMEOUT: 2000,
  IMAGE_LAZY_LOAD_DELAY: 1000,
  BUNDLE_SIZE_DELAY: 1000,
  MOCK_API_DELAY: 1500,
  MODAL_FOCUS_DELAY: 100,
} as const;

export const TIMEOUT = {
  PHOTO_FETCH: 5000,
} as const;

export const SCROLL = {
  SHOW_TOP_BUTTON: 400,
  NAVBAR_THRESHOLD: 50,
} as const;

export const POSITION = {
  SCROLL_TOP_WITH_CHATBOT: 95,
  SCROLL_TOP_DEFAULT: 25,
} as const;

export const CACHE_DURATION = {
  PROFILE_PHOTO: 7 * 24 * 60 * 60 * 1000,
} as const;

export const FORM_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 1000,
} as const;

export const DEVICE_THRESHOLDS = {
  MIN_MEMORY_GB: 4,
  MIN_CPU_CORES: 4,
} as const;

export const RETRY = {
  PHOTO_MAX_RETRIES: 3,
} as const;

export const IMAGE = {
  PLACEHOLDER_WIDTH: 80,
  PLACEHOLDER_HEIGHT: 80,
} as const;

export const OBSERVER_CONFIG = {
  SECTION_ROOT_MARGIN: '-30% 0px -70% 0px',
  SECTION_THRESHOLD: 0,
} as const;

export const CONVERSION = {
  BYTES_TO_MB: 1024 * 1024,
} as const;
