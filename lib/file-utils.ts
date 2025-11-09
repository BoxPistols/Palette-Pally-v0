/**
 * File utility functions for download and file operations
 */

/**
 * Downloads content as a file in the browser
 * @param content - The content to download (string or Blob)
 * @param filename - The name of the file to download
 * @param mimeType - The MIME type of the file (default: "application/json")
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string = "application/json"
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Reads a file as text
 * @param file - The File object to read
 * @returns Promise that resolves with the file content as string
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error("Failed to read file"))
      }
    }
    reader.onerror = () => reject(new Error("Error reading file"))
    reader.readAsText(file)
  })
}
