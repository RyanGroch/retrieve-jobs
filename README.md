# Retrieve Jobs

This is an application that fetches job output from mainframes. Retrieve Jobs makes FTP requests in order to list, download, and delete jobs that the user has submitted.

There are two different versions of Retrieve Jobs in this repository. One version is a web app that can be deployed to a variety of hosts with zero configuration. The other is a cross-platform desktop app which should be able to run on most major operating systems with no issues. Both versions share the same user interface.

A deployed web version of Retrieve Jobs can be found [here](https://retrieve-jobs.vercel.app/).

The desktop version of Retrieve Jobs is downloadable from the [releases page](https://github.com/RyanGroch/retrieve-jobs/releases).

## Running the Web Version

As mentioned previously, an "official" deployment of the web application is available [here](https://retrieve-jobs.vercel.app/) for anyone to use.

However, you may find value in deploying your own instance of the web app. After all, any single instance could run into host-imposed rate limits or get IP banned by the mainframe if the app gets misused.

Fortunately, anyone who has found their way to this GitHub repository is also able to deploy their own instance of Retrieve Jobs. You don’t need to mess with the code, nor do you need to install anything; you just need a GitHub account.

### Hosting

Retrieve Jobs is written in the [Next.js](https://nextjs.org/) framework, and as such the web version can run on any server that supports Node.js apps.

Additionally, some hosts directly support Next.js. Any such host will be able to run the web version of this app with absolutely no configuration. A few of these hosts are listed below:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Render](https://render.com/)

All of the hosts listed above have generous free tiers, and you do not need to provide them with payment information in order to get started.

### Deployment

Assuming that you have a GitHub account and have selected one of the hosts above, the general process to deploying the web app are roughly as follows:

1. Fork this repository. You can keep your fork public or private; it's up to you.
2. Sign into your selected host with your GitHub account.
3. Give your host access to your forked repository.
4. Through your host, deploy your repository as a new project. Generally you can leave all settings at their default values.

While the process may vary by the specific host, I have found it to be reasonably straightforward for all the hosts listed in the section above.

### Password Encryption

This app has a "stay signed in" feature which works by storing the user’s password in the browser. Passwords _should_ generally be hashed, but we can’t use hashing here because Retrieve Jobs needs to be able to send the plaintext password to the mainframe on each request. Therefore, this app instead encrypts the password and stores the ciphertext in the browser.

The encryption key is stored on the server as an environment variable named `ENCRYPTION_KEY`. This should be set to a Base64 string which is 32 bytes in length. One possible way to generate a string which meets these requirements is by running the following code in NodeJS:

```js
const { randomBytes } = require("crypto");
randomBytes(32).toString("base64");
```

You do not need to provide a key yourself. If you do not provide a key, then Retrieve Jobs will use a key generated at build time. The disadvantage to this is that users will be “signed out” on each new redeployment.

## Running the Desktop Version

The latest binaries for Windows, MacOS, and Linux are available on the [releases page](https://github.com/RyanGroch/retrieve-jobs/releases) of this repository. The desktop version of Retrieve Jobs should provide roughly the same experience as the web version.

The main benefit to using the desktop app is that it does not depend on an intermediary server to send the FTP requests to the mainframe. This means that the desktop app does not risk running into host-imposed rate limits. Additionally, an IP ban issued by Marist will affect only a single user if the user is on the desktop version; an IP ban against a web server will affect every user of that server. Therefore, the desktop version of Retrieve Jobs should be regarded as the safer option for users that are able to run it.

### Choosing the Appropriate Binary File

You can determine which binary file is appropriate for your device by referencing the table below:

| Operating System / Architecture | Available Binaries                  |
| ------------------------------- | ----------------------------------- |
| Windows                         | `-setup.exe`, `.msi`                |
| MacOS / Intel                   | `x64.dmg`, `x64.app.tar.gz`         |
| MacOS / Apple silicon           | `aarch64.dmg`, `aarch64.app.tar.gz` |
| RHEL-based Linux Distros        | `.rpm`, `.AppImage`                 |
| Debian-based Linux Distros      | `.deb`, `.AppImage`                 |
| Any Linux Distro                | `.AppImage`                         |

## Local Development

This section is for users who wish to use a development version of this app. **This is not necessary for most users.** However, it may be useful for users who wish to make their own modifications to Retrieve Jobs.

### Tools Required

You will need to install the following software to set up a development environment:

- [Node.js](https://nodejs.org)
- [Rust](https://www.rust-lang.org/) - only necessary for desktop development

### Setting up the Development Environment

Assuming you have installed the software listed above, follow the steps below:

1. Run a `git clone` on this repository.
2. Open a terminal and navigate to the project root of the cloned repository.
3. Run `npm install`.
4. Run the command `npm run dev` to run the web-based version; run `npm run tauri dev` to run the desktop version.

Depending on your operating system, you may need to install additional tools to run the desktop app in development mode. Refer to the [Tauri Documentation](https://tauri.app/v1/guides/getting-started/prerequisites) for more details on the subject.

## Technologies Used

This app was developed using the following technologies:

- [TypeScript](https://www.typescriptlang.org/)
- [React.js](https://react.dev), with [TanStack Query / React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Rust](https://www.rust-lang.org/)
- [Tauri](https://tauri.app/)
