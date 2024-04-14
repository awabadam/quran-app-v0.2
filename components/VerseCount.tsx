import React from "react";

export default function VerseCount({ count }: { count: any }) {
  return (
    <span className="text-gray-300 font-extrabold rounded-full text-sm mx-1 px-2 py-2 relative inline-flex items-center justify-center">
      {count}
      <span className="absolute text-4xl text-gray-700 inline-block">۝</span>
    </span>
  );
}
