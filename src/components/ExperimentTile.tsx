import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExperimentTile({
  name,
  path,
  icon,
}: ExperimentTileProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, translateX: 20, rotate: -2 }}
      className="mb-2"
    >
      <Link className="flex items-center justify-center" href={path}>
        <Image
          src={icon}
          alt="Experiment Logo"
          width={32}
          height={32}
          className="mr-2"
        />
        <p className="text text-black text-2xl"> {name}</p>
      </Link>
    </motion.div>
  );
}
type ExperimentTileProps = {
  name: string;
  path: string;
  icon: string;
};
