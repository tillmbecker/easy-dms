// utils/formatFileSize.ts

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @param decimalPlaces - Number of decimal places to show (default: 1)
 * @param useComma - Use comma instead of dot for decimal separator (default: true)
 * @returns Formatted string (e.g., "2,5 MB" or "0,5 GB")
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1024 * 1024) // "1 MB"
 * formatFileSize(1024 * 1024 * 1024) // "1 GB"
 * formatFileSize(1024 * 1024 * 1024 * 1024) // "1 TB"
 */
export function formatFileSize(
  bytes: number,
  decimalPlaces: number = 1,
  useComma: boolean = true
): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0) return "Invalid size";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const base = 1024;

  // Calculate the appropriate unit
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  // Make sure we don't exceed available units
  const safeUnitIndex = Math.min(unitIndex, units.length - 1);

  // Calculate the value in the selected unit
  const value = bytes / Math.pow(base, safeUnitIndex);

  // Format the number
  let formattedValue = value.toFixed(decimalPlaces);

  // Replace dot with comma if required
  if (useComma) {
    formattedValue = formattedValue.replace(".", ",");
  }

  // Remove trailing zeros after decimal separator (but keep one decimal if whole number)
  formattedValue = formattedValue.replace(/,?0+$/, "");

  // Add back decimal for whole numbers if needed
  if (!formattedValue.includes(useComma ? "," : ".") && decimalPlaces > 0) {
    formattedValue += useComma ? ",0" : ".0";
  }

  return `${formattedValue} ${units[safeUnitIndex]}`;
}
