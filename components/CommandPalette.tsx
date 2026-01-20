"use client";

import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { surahs } from "@/lib/surahs";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen } = useSettings();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredSurahs =
    query === ""
      ? []
      : surahs.filter((surah) => {
          return (
            surah.name.toLowerCase().includes(query.toLowerCase()) ||
            surah.arabic.includes(query) ||
            surah.id.toString() === query
          );
        });

  return (
    <Transition.Root show={isSearchOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={setIsSearchOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-950 bg-opacity-80 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-800 overflow-hidden rounded-xl bg-gray-900 shadow-2xl ring-1 ring-white/10 transition-all">
              <Combobox
                onChange={(surah: any) => {
                  if (surah) {
                    setIsSearchOpen(false);
                    router.push(`/${surah.id}`);
                  }
                }}
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100 placeholder:text-gray-500 focus:ring-0 sm:text-sm font-english outline-none"
                    placeholder="Search Surah..."
                    onChange={(event) => setQuery(event.target.value)}
                    autoComplete="off"
                  />
                </div>

                {filteredSurahs.length > 0 && (
                  <Combobox.Options static className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                    {filteredSurahs.map((surah) => (
                      <Combobox.Option
                        key={surah.id}
                        value={surah}
                        className={({ active }) =>
                          `flex cursor-pointer select-none rounded-xl p-3 transition-colors ${
                            active ? "bg-gray-800" : ""
                          }`
                        }
                      >
                        {({ active }) => (
                          <>
                            <div className="flex flex-auto items-center gap-3">
                                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gray-800 text-gray-400 ring-1 ring-white/10 font-english">
                                    {surah.id}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-100 font-english text-left">{surah.name}</span>
                                    <span className="text-xs text-gray-500 font-english text-left">{surah.arabic}</span>
                                </div>
                            </div>
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
                
                {query !== "" && filteredSurahs.length === 0 && (
                  <p className="p-4 text-sm text-gray-500 text-center font-english">No surah found.</p>
                )}
                
                {query === "" && (
                    <div className="py-14 px-6 text-center text-sm sm:px-14">
                        <p className="mt-4 font-semibold text-gray-200 font-english">Search for a Surah</p>
                        <p className="mt-2 text-gray-500 font-english">Type the name or number of the Surah.</p>
                    </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
