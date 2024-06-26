// Defines which hosts the app is allowed to make requests to
export const hostsList = ["zos.kctr.marist.edu", "184.105.60.27"];

// Defines valid characters for usernames
export const usernamePattern = /^[a-zA-Z0-9@#$]+$/;

// Defines valid characters for passwords
export const passwordPattern =
  /^[a-zA-Z0-9`~!@#$%^&*()\-_=+\[\]{}\\|:;'",<.>\/?]+$/;

// Defines valid characters for job IDs
export const jobPattern = /^[a-zA-Z0-9]+$/;
