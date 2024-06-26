import React from "react";
import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center text-center text-lg">
      <h1 className="px-2 pb-4 text-2xl font-semibold">
        404 - Page Does Not Exist
      </h1>
      <p className="px-2 pb-4 text-center">
        This is not the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="btn border-2 bg-white p-2 font-semibold hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-600"
      >
        Return Home
      </Link>
    </div>
  );
};

export default PageNotFound;
