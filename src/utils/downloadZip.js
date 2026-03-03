import JSZip from "jszip";
import { generateScaffold } from "../utils/exportScaffold";
export async function downloadZip(
  htmlContent,
  projectName = "website",
  files = null,
  format = "html"
) {
  if (!htmlContent && !files) return;

  const zip = new JSZip();
  const scaffold = generateScaffold(format, htmlContent, files, projectName);

  Object.entries(scaffold).forEach(([filepath, content]) => {
    zip.file(filepath, content);
  });

  const imagesFolder = zip.folder("images");
  imagesFolder.file(".gitkeep", "# Place your images here\n");

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFilename(projectName)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "website"
  );
}

export default downloadZip;
