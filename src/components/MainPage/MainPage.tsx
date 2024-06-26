"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ListJobsParams, Credentials } from "@/utils/types";
import { parseJobsList } from "@/utils/parse-jobs-list";
import { FTPlist } from "@/utils/ftp";
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
        password &&
        (await FTPlist({ host, username, password }));

      if (data?.success) {
        setLoggedIn(true);
        setJobsList(parseJobsList(data.result));

        // If the user checked "stay logged in"
        if (saveCredentials) {
          localStorage.setItem("host", host);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        }
      } else {
        setLoggedIn(false);
        setJobsList([]);

        localStorage.removeItem("host");
        localStorage.removeItem("username");
        localStorage.removeItem("password");

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
    const storedPassword = localStorage.getItem("password");

    if (storedHost && storedUsername && storedPassword) {
      const storedCreds = {
        host: storedHost,
        username: storedUsername,
        password: storedPassword
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
          mounted={mounted}
          setCredentials={setCredentials}
          listJobsQuery={listJobsQuery}
        />
      )}
    </>
  );
};

export default HomeMain;
