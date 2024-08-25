import { type FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ListJobsMutation, Credentials } from "@/utils/types";
import { downloadFile } from "@/utils/download-file";
import { formatJobContent } from "@/utils/format-job-content";
import { parseJobsList } from "@/utils/parse-jobs-list";
import { FTPdelete, FTPget, logout } from "@/utils/api";
import LoadingSpinner from "@/components/misc/LoadingSpinner/LoadingSpinner";

type Props = {
  credentials: Credentials;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
  jobsList: string[];
  setJobsList: React.Dispatch<React.SetStateAction<string[]>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  listJobsQuery: ListJobsMutation;
};

const Dashboard: FC<Props> = ({
  credentials,
  setCredentials,
  jobsList,
  setJobsList,
  setLoggedIn,
  listJobsQuery
}) => {
  // Tracks where to put the loading spinner
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  // Manages state of delete requests
  const deleteJobsQuery = useMutation({
    mutationKey: ["delete-jobs"],
    mutationFn: async (deleteList: string[]) => {
      if (!deleteList.length) return;

      const data = await FTPdelete(credentials, deleteList);

      if (data?.success) {
        const newJobsList = parseJobsList(data.result);

        // If all of the previous items are still present
        if (jobsList.every((job) => newJobsList.includes(job))) {
          // Then we wait half a second for the server to update
          await new Promise((res) => {
            setTimeout(
              async () => res(await listJobsQuery.mutateAsync({ credentials })),
              500
            );
          });
        } else {
          setJobsList(newJobsList);
        }
      } else {
        // Reattempt authentication upon failure
        listJobsQuery.mutate({ credentials });
        throw new Error();
      }
    }
  });

  // Manages state of download requests
  const downloadJobQuery = useMutation({
    mutationKey: ["download-job"],
    mutationFn: async (job: string) => {
      const data = await FTPget(credentials, job);

      if (data?.success) {
        downloadFile(`${job}.txt`, formatJobContent(data.result));
      } else {
        // Reattempt authentication upon failure
        listJobsQuery.mutate({ credentials });
        throw new Error();
      }
    }
  });

  const loading =
    listJobsQuery.isPending ||
    deleteJobsQuery.isPending ||
    downloadJobQuery.isPending;

  const downloadError =
    downloadJobQuery.isError && lastClicked?.startsWith("download-");
  const deleteError =
    deleteJobsQuery.isError && lastClicked?.startsWith("delete-");

  return (
    <div className="dark:text-white">
      <header className="flex min-h-10 items-center justify-between bg-white px-4 py-2 shadow-lg transition-colors dark:bg-neutral-700 dark:shadow-gray-500">
        <h1 className="w-min text-center text-2xl font-semibold xs:w-auto">
          Retrieve <span className="text-red-700 dark:text-red-400">Jobs</span>
        </h1>
        <div className="flex flex-col items-center justify-between gap-2 text-center text-lg xs:flex-row">
          <span>{credentials.username.toUpperCase()}</span>
          <button
            className="btn border px-4 py-1 font-semibold hover:bg-gray-100 dark:hover:bg-neutral-600"
            onClick={() => {
              setLoggedIn(false);
              setCredentials({
                host: "",
                username: "",
                password: ""
              });

              logout();
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="p-4 py-8 xs:p-10">
        <div className="rounded bg-white p-8 shadow-xl transition-colors dark:bg-neutral-700 dark:shadow-gray-500">
          <div className="flex items-center justify-between">
            <h2 className="w-min text-center text-2xl font-semibold xs:w-auto">
              Job List
            </h2>
            <div className="flex flex-col gap-2 text-lg xs:flex-row">
              <div className="relative">
                {loading && lastClicked === "refresh" && (
                  <div className="absolute inset-x-9 inset-y-1 xs:inset-x-7">
                    <LoadingSpinner />
                  </div>
                )}
                <button
                  className={`btn w-full border px-2 py-1 font-semibold xs:w-auto ${
                    loading && lastClicked === "refresh"
                      ? "cursor-auto opacity-50"
                      : "hover:bg-gray-100 dark:hover:bg-neutral-600"
                  }`}
                  onClick={() => {
                    if (loading) return;

                    listJobsQuery.mutate({ credentials });
                    setLastClicked("refresh");
                  }}
                >
                  Refresh
                </button>
              </div>
              <div className="relative">
                {loading && lastClicked === "delete-all" && (
                  <div className="absolute inset-x-9 inset-y-1">
                    <LoadingSpinner />
                  </div>
                )}
                <button
                  className={`btn border px-2 py-1 font-semibold text-red-700 dark:text-red-400 ${
                    loading && lastClicked === "delete-all"
                      ? "cursor-auto opacity-50"
                      : "hover:bg-red-100 dark:hover:bg-red-900"
                  }`}
                  onClick={() => {
                    if (loading || !jobsList.length) return;

                    deleteJobsQuery.mutate(jobsList);
                    setLastClicked("delete-all");
                  }}
                >
                  Purge All
                </button>
              </div>
            </div>
          </div>
          <div className="min-h-10">
            {(downloadError || deleteError) && (
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                {downloadError ? "Download failed." : "Purge failed."}
              </p>
            )}
          </div>
          <div className="pb-8">
            {jobsList.length ? (
              <table className="w-full xs:text-lg">
                <thead>
                  <tr className="border-b border-black dark:border-white">
                    <th className="py-2">Job ID</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsList.map((job) => (
                    <tr
                      key={job}
                      className="border-b border-black dark:border-white"
                    >
                      <td className="py-2 text-center">{job}</td>
                      <td className="py-2">
                        <div className="mx-auto flex w-min flex-col justify-center gap-1 xs:flex-row">
                          <div className="relative">
                            {loading && lastClicked === `download-${job}` && (
                              <div className="absolute inset-x-9 inset-y-0.5 xs:inset-x-11 xs:inset-y-1">
                                <LoadingSpinner />
                              </div>
                            )}
                            <button
                              id={`download-${job}`}
                              className={`btn border px-1 font-semibold xs:px-2 ${
                                loading && lastClicked === `download-${job}`
                                  ? "cursor-auto opacity-50"
                                  : "hover:bg-gray-100 dark:hover:bg-neutral-600"
                              }`}
                              onClick={() => {
                                if (loading) return;

                                downloadJobQuery.mutate(job);
                                setLastClicked(`download-${job}`);
                              }}
                            >
                              Download
                            </button>
                          </div>
                          <div className="relative">
                            {loading && lastClicked === `delete-${job}` && (
                              <div className="absolute inset-x-9 inset-y-0.5 xs:inset-x-7 xs:inset-y-1">
                                <LoadingSpinner />
                              </div>
                            )}
                            <button
                              id={`delete-${job}`}
                              className={`btn w-full border px-1 font-semibold text-red-700 xs:w-auto xs:px-2 dark:text-red-400 ${
                                loading && lastClicked === `delete-${job}`
                                  ? "cursor-auto opacity-50"
                                  : "hover:bg-red-100 dark:hover:bg-red-900"
                              }`}
                              onClick={() => {
                                if (loading) return;

                                deleteJobsQuery.mutate([job]);
                                setLastClicked(`delete-${job}`);
                              }}
                            >
                              Purge
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg">No jobs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
