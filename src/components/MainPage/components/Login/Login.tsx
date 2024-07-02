import { useState, type FC } from "react";
import { usernamePattern, passwordPattern, hostsList } from "@/utils/allowed";
import type { ListJobsMutation, Credentials } from "@/utils/types";
import LoadingSpinner from "@/components/misc/LoadingSpinner/LoadingSpinner";
import Checkbox from "@/components/misc/Checkbox/Checkbox";

type Props = {
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
  listJobsQuery: ListJobsMutation;
  mounted: boolean;
};

const Login: FC<Props> = ({ setCredentials, listJobsQuery, mounted }) => {
  const [host, setHost] = useState(hostsList[0]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  // Specifically for invalid characters
  const [validationError, setValidationError] = useState(false);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="relative w-[min(24rem,100%)]">
        {listJobsQuery.isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8 opacity-50">
            <LoadingSpinner />
          </div>
        )}
        <div
          className={`rounded bg-white p-8 shadow-xl transition-colors dark:bg-neutral-700 dark:shadow-gray-500 ${
            listJobsQuery.isPending ? "opacity-50" : ""
          }`}
        >
          <h1 className="text-center text-2xl font-semibold dark:text-white">
            Retrieve{" "}
            <span className="text-red-700 dark:text-red-400">Jobs</span>
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (listJobsQuery.isPending || !mounted) return;

              // Only send the request if the
              // user entered valid characters
              if (
                !usernamePattern.test(username) ||
                !passwordPattern.test(password)
              ) {
                setValidationError(true);
              } else {
                setValidationError(false);
                setCredentials({ host, username, password });
                listJobsQuery.mutate({
                  credentials: { host, username, password },
                  saveCredentials: stayLoggedIn
                });
              }
            }}
          >
            <div className="flex flex-col pb-2">
              <label
                className="cursor-pointer text-lg dark:text-white"
                htmlFor="host"
              >
                Host
              </label>
              <select
                id="host"
                className="w-full cursor-pointer rounded border-2 border-gray-400 bg-gray-100 transition-bg-border dark:border-gray-500 dark:bg-neutral-600 dark:text-white"
                value={host}
                onChange={(e) => setHost(e.currentTarget.value)}
              >
                {hostsList.map((hostName) => (
                  <option key={hostName}>{hostName}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col pb-2">
              <label
                className="cursor-pointer text-lg dark:text-white"
                htmlFor="username"
              >
                ID / Username
              </label>
              <input
                id="username"
                className="w-full rounded border-2 border-gray-400 bg-gray-100 pl-1 transition-bg-border dark:border-gray-500 dark:bg-neutral-600 dark:text-white"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                type="text"
              />
            </div>
            <div className="flex flex-col pb-4">
              <label
                className="cursor-pointer text-lg dark:text-white"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                className="w-full rounded border-2 border-gray-400 bg-gray-100 pl-1 transition-bg-border dark:border-gray-500 dark:bg-neutral-600 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                autoComplete="on"
                required
                type="password"
              />
            </div>
            <div className="flex items-center pb-6 text-lg">
              <div className="h-7 w-7">
                <Checkbox
                  id="stay-logged-in"
                  checked={stayLoggedIn}
                  mounted={mounted}
                  onChange={() => setStayLoggedIn(!stayLoggedIn)}
                />
              </div>
              <label
                className="cursor-pointer pl-3 pt-1 dark:text-white"
                htmlFor="stay-logged-in"
              >
                Stay Logged In
              </label>
            </div>
            <button className="btn w-full border-2 p-2 font-semibold hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-600">
              Login
            </button>
            <div className="min-h-10">
              {(listJobsQuery.isError || validationError) && (
                <p className="pt-2 text-center text-lg font-bold text-red-700 dark:text-red-400">
                  {validationError
                    ? "Invalid characters."
                    : "Authentication failed."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
