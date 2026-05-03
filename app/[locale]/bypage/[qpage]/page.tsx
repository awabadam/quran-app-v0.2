import Qpage from "@/components/Qpage";
import React from "react";
import { setRequestLocale } from "next-intl/server";

export default async function Page(props: any) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="text-white flex justify-center items-center border-2">
      <Qpage surah={params.qpage} />
    </div>
  );
}
