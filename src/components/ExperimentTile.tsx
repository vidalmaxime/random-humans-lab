import React from "react";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ExperimentTile({ name }: ExperimentTileProps) {
  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <Link href="/experiment_1">
        <p className="text text-black"> {name}</p>
      </Link>
    </motion.div>
  );
}
type ExperimentTileProps = {
  name: string;
};
