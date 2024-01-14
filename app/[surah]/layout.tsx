import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <div className="flex flex-row justify-center h-full min-h-[91vh]">
        <div>{children}</div>
        <Sidebar />
      </div>
    </>
  );
}
