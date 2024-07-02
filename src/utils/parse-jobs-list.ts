// The FTPlist call returns the list as a single string.
// We need to manually parse it into an array.
// This function parses the raw string into an array,
// but depends on some dubious assumtions about the
// formatting of the list. This function may require
// later revision if those assumptions turn out to be false.
export const parseJobsList = (rawJobs: string): string[] =>
  rawJobs
    // Each job is separated by a newline
    .split("\n")

    // Assume at least one space between each column.
    // Assume Job ID is always in second column.
    .map((row) => row.split(" ").filter((col) => col)[1])

    // Assume Job ID is always exactly 8 characters.
    // Assume - perhaps dangerously - that the second word of the
    // "no jobs found" message will not have exactly 8 characters.
    // Finally, remove TSU jobs.
    .filter((jobID) => jobID && jobID.length === 8 && !jobID.startsWith("TSU"));
