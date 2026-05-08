import { describe, it, expect } from "vitest";
import { parseJobsList } from "./parse-jobs-list";

describe("parseJobsList", () => {
  it("parses a typical FTP list response into JobListItem[]", () => {
    const raw = [
      "KC03NNNA  JOB07602  OUTPUT    3 Spool Files",
      "TRAINERA  JOB07603  OUTPUT    3 Spool Files",
      "SOME$IDA  JOB07604  OUTPUT    3 Spool Files"
    ].join("\n");

    expect(parseJobsList(raw)).toEqual([
      { userID: "KC03NNNA", jobID: "JOB07602" },
      { userID: "TRAINERA", jobID: "JOB07603" },
      { userID: "SOME$IDA", jobID: "JOB07604" }
    ]);
  });

  it("filters out TSU jobs", () => {
    const raw = [
      "KC03NNNA  JOB07602  OUTPUT    3 Spool Files",
      "KC03NNNA  TSU07700  OUTPUT    1 Spool Files"
    ].join("\n");

    expect(parseJobsList(raw)).toEqual([
      { userID: "KC03NNNA", jobID: "JOB07602" }
    ]);
  });

  it("filters out rows whose Job ID is not exactly 8 characters", () => {
    const raw = [
      "USERID    JOBNAME",
      "KC03NNNA  JOB07602  OUTPUT    3 Spool Files",
    ].join("\n");

    expect(parseJobsList(raw)).toEqual([
      { userID: "KC03NNNA", jobID: "JOB07602" }
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseJobsList("")).toEqual([]);
  });

  it("returns an empty array when no jobs are found", () => {
    const raw = "No jobs found on Held queue\n";

    expect(parseJobsList(raw)).toEqual([]);
  });

  it("tolerates extra trailing newline", () => {
    const raw = "KC03NNNA  JOB07602  OUTPUT    3 Spool Files\n\n";

    expect(parseJobsList(raw)).toEqual([
      { userID: "KC03NNNA", jobID: "JOB07602" }
    ]);
  });
});
