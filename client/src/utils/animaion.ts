import {motion, AnimatePresence, MotionProps} from "framer-motion" ;

export const slideLeft = {
  initial: {x: "50%", opacity: 0},
  animate: {x: 0, opacity: 1},
  exit: {x: "-50%", opacity: 0},
  transition: {duration: 0.7},
};

export const flipCard : MotionProps = {initial: {rotateY: 180, opacity: 0},
  animate: {rotateY: 0, opacity: 1},
  exit: {rotateY: -180, opacity: 0},
  transition: {duration: 1,ease: "easeInOut"},
};

