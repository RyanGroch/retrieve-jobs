// A minimum number of spaces that will definitely be present between
// each job, but will not be present in the "no items" message.
const jobDelimiter = " ".repeat(5);

// A number of spaces between each column of the jobs in the list
const jobColumnDelimiter = " ".repeat(2);

// The FTPlist call returns the list as a single string.
// We need to manually parse it into an array.
// This function parses the raw string into an array,
// but depends on assumtions about the number of characters
// separating each item. Also assumes that the default
// "no items" message will not contain a delimiter.
export const parseJobsList = (rawJobs: string): string[] => {
  // No items found
  if (!rawJobs.includes(jobDelimiter)) return [];

  // At least one item, with delimiters after each item
  return (
    rawJobs
      .split(jobDelimiter)

      // Remove items that are only whitespace
      .filter((job) => {
        const allWhitespace = job
          .split("")
          .every((char) => char === " " || char === "\n");
        return !allWhitespace;
      })

      // Return only the ID, not the whole row
      .map((job) => {
        const jobColumns = job.trim().split(jobColumnDelimiter);
        const jobID = jobColumns[1];
        return jobID;
      })
  );
};
