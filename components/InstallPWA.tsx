"use client";
import { useState } from "react";
import { useInstallPWA } from "@/hooks/useInstallPWA";
import { useTranslations } from "next-intl";

export default function InstallPWA() {
  const { installState, install } = useInstallPWA();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const t = useTranslations("install");

  // Don't render if already installed or no install option
  if (installState === "installed" || installState === "idle") return null;

  // iOS — show share sheet instructions
  if (installState === "ios") {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-emerald-500/10 hover:bg-emerald-500/15
            border border-emerald-500/20 hover:border-emerald-500/30
            text-emerald-400 hover:text-emerald-300
            transition-all duration-200"
        >
          <DownloadIcon />
          <span className="hidden sm:inline text-[13px] font-english">
            {t("install")}
          </span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full sm:max-w-sm mx-auto bg-[hsl(240,6%,10%)] border border-white/[0.06]
                rounded-t-2xl sm:rounded-2xl p-6 space-y-4 safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-english font-medium">
                  {t("iosTitle")}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <ol className="space-y-3 text-sm text-gray-400 font-english">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium">
                    1
                  </span>
                  <span>
                    {t("iosStep1")}{" "}
                    <ShareIcon className="inline w-4 h-4 text-blue-400 -mt-0.5" />
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium">
                    2
                  </span>
                  <span>{t("iosStep2")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium">
                    3
                  </span>
                  <span>{t("iosStep3")}</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </>
    );
  }

  // Android / Desktop — trigger native install prompt
  return (
    <button
      onClick={install}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-emerald-500/10 hover:bg-emerald-500/15
        border border-emerald-500/20 hover:border-emerald-500/30
        text-emerald-400 hover:text-emerald-300
        transition-all duration-200"
    >
      <DownloadIcon />
      <span className="hidden sm:inline text-[13px] font-english">
        {t("install")}
      </span>
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
      />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M12 15V2.25m0 0l3 3m-3-3l-3 3"
      />
    </svg>
  );
}
