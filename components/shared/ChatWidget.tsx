"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatUI } from "./chatwidget";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Launcher Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg"
        style={{
          clipPath: "circle(50% at 50% 50%)",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed z-40 bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
              expanded
                ? "top-0 left-0 right-0 bottom-0 rounded-none"
                : "bottom-25 right-6 w-80 h-96 rounded-2xl"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-100">
              <span className="font-bold text-sm">Chatbot</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-amber-600 hover:underline"
                >
                  {expanded ? "Shrink ↘" : "Expand ↗"}
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setExpanded(false);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className=" flex-1  text-sm bg-amber-300 text-gray-600">
              {/* Replace this with your actual chatbot UI */}
              <ChatUI />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
