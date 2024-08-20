const spoolEnd = "!! END OF JES SPOOL FILE !!";

const carriageControlMap = new Map<string, string>([
  ["0", "\n"], // double-spaced
  ["1", "\f\n"], // new page
  ["-", "\n\n"], // triple-spaced
  [" ", ""] // single-spaced
]);

// Handles the interpretation of carriage control characters.
export const formatJobContent = (text: string) =>
  text
    .split("\n")
    .map((line) => {
      if (line.slice(1) === spoolEnd) return "";

      const carriageControl = line[0];
      const whitespace = carriageControlMap.get(carriageControl) ?? "";

      return whitespace + line.slice(1) + "\n";
    })
    .join("");
