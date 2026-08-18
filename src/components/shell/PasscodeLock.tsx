"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Delete, ShieldCheck } from "lucide-react";

const PASSCODE = "1234";
const SESSION_KEY = "okn_unlocked";
const MAX_ATTEMPTS = 5;

interface PasscodeLockProps {
  onUnlock: () => void;
}

const NUMPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

export const PasscodeLock: React.FC<PasscodeLockProps> = ({ onUnlock }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Countdown timer when locked out
  useEffect(() => {
    if (lockCountdown <= 0) return;
    const t = setTimeout(() => {
      setLockCountdown((c) => {
        if (c <= 1) {
          setLocked(false);
          setAttempts(0);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [lockCountdown]);

  const handleDigit = useCallback(
    (key: string) => {
      if (locked || success) return;

      if (key === "⌫") {
        setDigits((prev) => prev.slice(0, -1));
        setErrorMsg("");
        return;
      }

      if (digits.length >= 4) return;

      const next = [...digits, key];
      setDigits(next);

      // Auto-check when 4 digits entered
      if (next.length === 4) {
        const entered = next.join("");
        setTimeout(() => {
          if (entered === PASSCODE) {
            setSuccess(true);
            sessionStorage.setItem(SESSION_KEY, "1");
            setTimeout(() => onUnlock(), 700);
          } else {
            setShake(true);
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= MAX_ATTEMPTS) {
              setLocked(true);
              setLockCountdown(30);
              setErrorMsg(`Too many attempts. Locked for 30 seconds.`);
            } else {
              setErrorMsg(
                `Incorrect passcode. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts !== 1 ? "s" : ""} remaining.`
              );
            }

            setTimeout(() => {
              setShake(false);
              setDigits([]);
            }, 600);
          }
        }, 100);
      }
    },
    [digits, locked, success, attempts, onUnlock]
  );

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      if (e.key === "Backspace") handleDigit("⌫");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleDigit]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#050609] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[100px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-xs mx-auto px-6 flex flex-col items-center"
      >
        {/* Logo & Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <Image
              src="/assets/brand/OKN_coin_transparent.png"
              alt="OKN"
              fill
              sizes="64px"
              className="object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.6)]"
            />
          </div>
          <div className="text-center">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-blue-400 font-bold mb-0.5">
              OKN SOCIAL OS
            </div>
            <div className="text-white font-semibold text-base tracking-tight">
              Command Center
            </div>
          </div>
        </div>

        {/* Lock label */}
        <div className="mb-6 text-center">
          <p className="text-sm text-slate-400 font-medium">
            {locked
              ? `🔒 Locked — retry in ${lockCountdown}s`
              : success
              ? "✓ Access Granted"
              : "Enter Passcode"}
          </p>
        </div>

        {/* 4-Dot PIN indicator */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          {[0, 1, 2, 3].map((i) => {
            const filled = i < digits.length;
            const isSuccess = success && i < 4;

            return (
              <motion.div
                key={i}
                animate={
                  isSuccess
                    ? { scale: [1, 1.3, 1], backgroundColor: "#10B981" }
                    : filled
                    ? { scale: [0.8, 1.1, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.2 }}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  isSuccess
                    ? "bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                    : filled
                    ? "bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "bg-transparent border-slate-600"
                }`}
              />
            );
          })}
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs text-center font-medium"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Numpad */}
        <div
          className={`w-full grid grid-cols-3 gap-3 ${locked || success ? "opacity-40 pointer-events-none" : ""}`}
        >
          {NUMPAD.flat().map((key, idx) => {
            if (key === "") return <div key={idx} />;

            const isDelete = key === "⌫";

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleDigit(key)}
                disabled={locked || success}
                className={`
                  relative h-16 rounded-2xl flex flex-col items-center justify-center
                  text-white font-semibold select-none transition-all
                  ${isDelete
                    ? "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
                    : "bg-white/[0.07] hover:bg-blue-600/20 active:bg-blue-600/30 border border-white/[0.08] hover:border-blue-500/40 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  }
                `}
              >
                {isDelete ? (
                  <Delete className="w-4 h-4 text-slate-400" />
                ) : (
                  <>
                    <span className="text-xl leading-none font-semibold text-white">
                      {key}
                    </span>
                    {/* Sub-label letters */}
                    {["2", "3", "4", "5", "6", "7", "8", "9"].includes(key) && (
                      <span className="text-[8px] text-slate-500 font-normal mt-0.5 tracking-widest">
                        {
                          {
                            "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL",
                            "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ",
                          }[key]
                        }
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Success overlay pulse */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs text-emerald-400 font-semibold">
                Access Granted
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="mt-10 text-[10px] text-slate-600 font-mono text-center">
          SECURED · OKN SOCIAL OS v1.0
        </p>
      </motion.div>
    </div>
  );
};
