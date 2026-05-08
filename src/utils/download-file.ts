import { isTauri } from "@/lib/tauri";
import { downloadDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

// Initiates a file download with default name `filename` and
// content `text`. This differs based on whether the app is
// in web or desktop mode, so we need to check for the
// existence of the Tauri runtime.
export const downloadFile = async (filename: string, text: string) => {
  if (isTauri()) {
    // In desktop mode
    const downloadPath = await save({
      filters: [{ name: "*.txt,*.TXT", extensions: ["txt", "TXT"] }],
      defaultPath: (await downloadDir()) + "/" + filename
    });

    if (downloadPath) await writeTextFile(downloadPath, text);
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
