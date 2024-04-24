"use client";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";

export default function page() {
  const [Count, setCount] = useState(1);

  return (
    <main dir="rtl">
      <div className="min-h-[92vh] flex justify-center text-slate-700 text-xl tracking-wider font-Scheherazade_New leading-loose">
        <Tabs className={"w-[60vw] flex flex-col items-center text-slate-300"}>
          <TabList className={"flex gap-4 p-8"}>
            <Tab className={" p-4"}>أذكار الصباح</Tab>
            <Tab>Title 2</Tab>
          </TabList>

          <TabPanel>
            <div>
              <ul>
                <li className="flex gap-4 py-8 border-b border-slate-800">
                  <div className="p-2 flex flex-col items-center justify-center border-slate-800 border w-48">
                    <div
                      className=" flex items-center justify-center w-full h-full bg-slate-900"
                      onClick={() => setCount(Count + 1)}
                    >
                      {Count}
                    </div>
                    <div onClick={() => setCount(0)}>reset</div>
                  </div>
                  <div>
                    <p>أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ</p>
                    <p className="mt-4">
                      اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ
                      تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ
                      وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ
                      إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا
                      خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ
                      بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ
                      وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
    </main>
  );
}
