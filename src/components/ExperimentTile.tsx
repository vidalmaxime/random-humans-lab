import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExperimentTile({ name }: ExperimentTileProps) {
  return (
    <motion.div className="flex items-center justify-center" whileHover={{ scale: 1.1 }}>
      <Image
        src="/world-icon.svg"
        alt="Experiment Logo"
        width={36}
        height={36}
        className="mr-4"
      />
      <Link href="/experiment_1">
        <p className="text text-black text-4xl"> {name}</p>
      </Link>
    </motion.div>
  );
}
type ExperimentTileProps = {
  name: string;
};
