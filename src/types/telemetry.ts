export type TelemetryEventName =
  | "page_view"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "scroll_90"
  | "time_on_page"
  | "site_search"
  | "filter_apply"
  | "empty_search_result"
  | "outbound_click"
  | "social_share"
  | "file_download"
  | "error_404"
  | "js_error";

export type DeviceType = "mobile" | "desktop" | null;