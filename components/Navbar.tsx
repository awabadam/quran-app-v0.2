import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-gradient-to-b z-50 from-gray-900 via-gray-900/80 to-transparent text-gray-200 w-full h-auto py-[2%] flex justify-center sticky top-0">
      <div className="flex flex-row items-center justify-center">
        <Link href={"/"} className="text-xl font-bold font-Scheherazade_New ">
          القرآن الكريم
        </Link>
      </div>
    </header>
  );
}
