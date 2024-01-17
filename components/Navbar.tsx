import Link from "next/link";
import Image from "next/image";
import QLogo from "./QLogo";

export default function Navbar() {
  return (
    <header
      dir="rtl"
      className="bg-slate-900 z-30 text-gray-200 w-full md:h-auto py-4 flex justify-center sticky top-0 border-b border-slate-800 h-20"
    >
      <div className="flex flex-row items-center w-[94vw] justify-between gap-2">
        <Link href={"/"} className="text-xl font-bold font-english  ">
          <div className="md:h-12 h-8 fill-slate-300">
            <QLogo />
          </div>
        </Link>
        <div className="gap-4 flex text-slate-400">
          <Link href={"/"}>الرئيسية</Link>
          <Link href={"/about"}>عن المشروع</Link>
        </div>
      </div>
    </header>
  );
}
