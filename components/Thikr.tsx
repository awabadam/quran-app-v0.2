import { useState } from "react";
export default function Thikr({ Count, thikr }: any) {
  const [thikrCount, setThikrCount] = useState(0);

  const handelCount = () => {
    if (thikrCount !== Count) {
      setThikrCount(thikrCount + 1);
    }
  };
  return (
    <div className="flex gap-4 py-8 border-b border-slate-800">
      <div className="p-2 flex flex-col items-center justify-center border-slate-800 border w-48">
        <div
          className=" flex items-center justify-center w-full h-full bg-slate-900"
          onClick={handelCount}
        >
          {thikrCount}/{Count}
        </div>
        <div onClick={() => setThikrCount(0)}>reset</div>
      </div>
      <div>{thikr}</div>
    </div>
  );
}
