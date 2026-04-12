"use client";
import { motion } from "framer-motion";
import ContinueReading from "./ContinueReading";

export default function FeatureCards() {
  return (
    <motion.div
      className="max-w-md mx-auto mb-16"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <ContinueReading />
    </motion.div>
  );
}
