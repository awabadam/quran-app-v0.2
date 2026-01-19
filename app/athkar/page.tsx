"use client";
import Thikr from "@/components/Thikr";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default function page() {
  const athkar = [
    {
      thikr_text:
        "اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ  سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.",
      count: 1,
    },
    { thikr_text: "thikr", count: 1 },
    { thikr_text: "thikr", count: 6 },
    { thikr_text: "thikr", count: 6 },
  ];

  return (
    <main dir="rtl">
      <div className="min-h-[92vh] flex justify-center text-slate-700 text-xl tracking-wider font-Scheherazade_New leading-loose">
        <Tabs className={"w-[60vw] flex flex-col items-center text-slate-300"}>
          <TabList className={"flex gap-4 p-8"}>
            <Tab className={" p-4"}>أذكار الصباح</Tab>
            <Tab>Title 2</Tab>
          </TabList>

          <TabPanel>
            {athkar.map((wird, index) => (
              <Thikr thikr={wird.thikr_text} Count={wird.count} />
            ))}
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
    </main>
  );
}
