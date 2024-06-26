import { getTauri } from "@/lib/tauri";

// Initiates a file download with default name `filename` and
// content `text`. This differs based on whether the app is
// in web or desktop mode, so we need to check for the
// existence of the Tauri object.
export const downloadFile = async (filename: string, text: string) => {
  const tauri = getTauri();
  if (tauri) {
    // In desktop mode
    const downloadPath = await tauri.dialog.save({
      filters: [{ name: "*.txt,*.TXT", extensions: ["txt", "TXT"] }],
      defaultPath: (await tauri.path.downloadDir()) + filename
    });

    if (downloadPath) await tauri.fs.writeTextFile(downloadPath, text);
  } else {
    // In web mode
    const downloadLink = document.createElement("a");

    downloadLink.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );

    downloadLink.setAttribute("download", filename);

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
  }
};
