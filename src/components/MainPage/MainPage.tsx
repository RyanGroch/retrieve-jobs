"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ListJobsParams, Credentials } from "@/utils/types";
import { parseJobsList } from "@/utils/parse-jobs-list";
import { FTPlist, logout } from "@/utils/api";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";

const HomeMain = () => {
  // Stores the credentials the user logged in with;
  // these are used for every request after logging in
  const [credentials, setCredentials] = useState<Credentials>({
    host: "",
    username: "",
    password: ""
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [jobsList, setJobsList] = useState<string[]>([]);

  // Lock login attempts until we can check whether the user
  // asked to stay logged in the last time; also ensures
  // that we can check color theme for checkbox
  const [mounted, setMounted] = useState(false);

  // Manages the state of requests to list jobs;
  // doubles as authentication
  const listJobsQuery = useMutation({
    mutationKey: ["query-jobs"],
    mutationFn: async ({ credentials, saveCredentials }: ListJobsParams) => {
      const { host, username, password } = credentials;

      const data =
        host &&
        username &&
        (await FTPlist({ host, username, password }, saveCredentials ?? false));

      if (data && data.success) {
        setLoggedIn(true);
        setJobsList(parseJobsList(data.result));

        // If the user checked "stay logged in"
        if (saveCredentials) {
          localStorage.setItem("host", host);
          localStorage.setItem("username", username);
        }
      } else {
        setLoggedIn(false);
        setJobsList([]);

        logout();

        throw new Error();
      }
    }
  });

  // If the user previously wanted to stay logged in,
  // then we make a login attempt as soon as the app loads
  useEffect(() => {
    // Only run once
    if (mounted) return;

    const storedHost = localStorage.getItem("host");
    const storedUsername = localStorage.getItem("username");

    if (storedHost && storedUsername) {
      const storedCreds = {
        host: storedHost,
        username: storedUsername,
        password: ""
      };

      listJobsQuery.mutate({ credentials: storedCreds });
      setCredentials(storedCreds);
    }

    // Unlock login attempts
    setMounted(true);
  }, [mounted, listJobsQuery]);

  return (
    <>
      {loggedIn ? (
        <Dashboard
          credentials={credentials}
          setCredentials={setCredentials}
          jobsList={jobsList}
          setJobsList={setJobsList}
          setLoggedIn={setLoggedIn}
          listJobsQuery={listJobsQuery}
        />
      ) : (
        <Login
          credentials={credentials}
          setCredentials={setCredentials}
          mounted={mounted}
          listJobsQuery={listJobsQuery}
        />
      )}
    </>
  );
};

export default HomeMain;
