"use client";
import { motion } from "framer-motion";
import ContinueReading from "./ContinueReading";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function FeatureCards() {
  return (
    <motion.div
      className="max-w-lg mx-auto mb-14"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <ContinueReading />
    </motion.div>
  );
}
