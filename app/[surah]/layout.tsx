import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <div className="flex flex-row justify-center bg-gray-900 h-full">
        <div>{children}</div>
        <Sidebar />
      </div>
    </>
  );
}
