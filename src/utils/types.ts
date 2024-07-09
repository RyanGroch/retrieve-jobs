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

export type FTPSuccessResult = { success: true; result: string };
export type FTPFailResult = { success: false };
export type FTPResult = FTPSuccessResult | FTPFailResult;
