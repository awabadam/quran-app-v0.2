import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <div className="flex flex-row justify-center bg-gray-800 h-full">
        <div>{children}</div>
        <Sidebar />
      </div>
    </>
  );
}
