"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { surahs } from "@/lib/surahs";

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg shadow-black/20 text-emerald-400 bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-all"
        onClick={() => setOpen(true)}
        title="Surah Index"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
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
            <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="trangray-x-full"
                  enterTo="trangray-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="trangray-x-0"
                  leaveTo="trangray-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-gray-900 py-6 border-l border-white/10 shadow-2xl">
                      <div className="px-4 sm:px-6 mb-6">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-white text-center font-english">
                          Surah Index
                        </Dialog.Title>
                      </div>
                      <div className="relative flex-1 px-4 sm:px-6">
                        {surahs.map((chapter: any) => (
                          <Link
                            key={chapter.id}
                            href={`/${chapter.id}`}
                            className="w-full cursor-pointer flex flex-col justify-center items-center group"
                            onClick={() => setOpen(false)}
                          >
                            <div className="flex justify-between rounded-xl w-full px-4 py-3 transition-all hover:bg-gray-800 text-gray-400 hover:text-white border border-transparent hover:border-gray-700 mb-2">
                              <div className="text-gray-600 font-english text-sm font-bold group-hover:text-emerald-500 transition-colors">
                                {chapter.id}
                              </div>
                              <div className="font-english text-xl">سورة {chapter.arabic}</div>
                            </div>
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
