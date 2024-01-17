"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const [chaptersList, setChaptersList] = useState([] as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quran.com/api/v4/chapters?language=en"
        );
        const data = await response.json();
        setChaptersList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!chaptersList || chaptersList.length === 0) {
    return (
      <div className="bg-black/50 w-full h-full absolute">جار التحديث...</div>
    );
  }

  return (
    <div>
      <button
        className="fixed bottom-10 right-10 p-4 rounded-xl shadow-lg shadow-black text-slate-400 bg-slate-900 border border-slate-700 flex flex-col gap-1.5"
        onClick={() => setOpen(true)}
      >
        <div className="w-6 h-[2px] bg-slate-400"></div>
        <div className="w-6 h-[2px] bg-slate-400"></div>
        <div className="w-6 h-[2px] bg-slate-400"></div>
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    {/* <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-slate-300 hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-50"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <span>X</span>
                        </button>
                      </div>
                    </Transition.Child> */}

                    <div className="flex h-full flex-col overflow-y-scroll bg-slate-900 py-6  border-l border-slate-800">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base text-center font-semibold leading-6 text-slate-300">
                          فهرس السور
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {chaptersList.chapters.map((chapter: any) => (
                          <Link
                            href={`/${chapter.id}`}
                            className="w-full cursor-pointer flex flex-col justify-center items-center"
                            scroll={false}
                          >
                            <div className="flex ml-4 justify-between rounded w-full pr-16 pl-4 duration-500 transition-all py-2.5 hover:bg-slate-800 text-slate-500 hover:text-slate-300">
                              <div className="text-slate-600 ml-2">
                                {chapter.id}
                              </div>
                              <div className="">سورة {chapter.name_arabic}</div>
                            </div>
                            <hr className="my-2 ml-4 border-0.5 w-full border-slate-800/50 " />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
