import type { AnchorMeasurement, MenuSize } from "../types";

/**
 * Validates that a measurement has valid dimensions.
 * Returns true if the measurement is valid (non-null and has positive dimensions).
 */
export function isValidMeasurement(
  measurement: AnchorMeasurement | null | undefined
): measurement is AnchorMeasurement {
  if (!measurement) return false;
  return (
    typeof measurement.width === "number" &&
    typeof measurement.height === "number" &&
    typeof measurement.pageX === "number" &&
    typeof measurement.pageY === "number" &&
    measurement.width > 0 &&
    measurement.height > 0 &&
    !isNaN(measurement.width) &&
    !isNaN(measurement.height) &&
    !isNaN(measurement.pageX) &&
    !isNaN(measurement.pageY)
  );
}

/**
 * Validates that a menu size has valid dimensions.
 * Returns true if the size is valid (non-null and has positive dimensions).
 */
export function isValidMenuSize(size: MenuSize | null | undefined): size is MenuSize {
  if (!size) return false;
  return (
    typeof size.width === "number" &&
    typeof size.height === "number" &&
    size.width > 0 &&
    size.height > 0 &&
    !isNaN(size.width) &&
    !isNaN(size.height)
  );
}

/**
 * Checks if a measurement looks invalid (e.g., all zeros, which can happen
 * on Android during layout transitions).
 */
export function isInvalidMeasurement(
  measurement: AnchorMeasurement | null | undefined
): boolean {
  if (!measurement) return true;
  return (
    measurement.pageX === 0 &&
    measurement.pageY === 0 &&
    measurement.width === 0 &&
    measurement.height === 0
  );
}
