"use client";
import { motion } from "framer-motion";
import ContinueReading from "./ContinueReading";

export default function FeatureCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ContinueReading />
    </motion.div>
  );
}
