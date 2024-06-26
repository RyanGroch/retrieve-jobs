import type { UseMutationResult } from "@tanstack/react-query";

export type Credentials = {
  host: string;
  username: string;
  password: string;
};

export type ListJobsParams = {
  credentials: Credentials;
  saveCredentials?: boolean;
};

export type ListJobsMutation = UseMutationResult<
  void,
  Error,
  ListJobsParams,
  unknown
>;
