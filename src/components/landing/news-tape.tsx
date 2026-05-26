"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ExternalLink } from "lucide-react";
import useMeasure from "react-use-measure";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";

const NewsTape = () => {
  const latestNews = useQuery(api.tickerTape.getPublishedTickerTapeItems);
  const tickerConfig = useQuery(api.tickerTape.getTickerTapeConfig);

  const baseDuration = tickerConfig?.speed ?? 500;
  const slowDuration = baseDuration * 1.5;

  const [duration, setDuration] = useState(baseDuration);
  const [ref, { width }] = useMeasure();
  const xTranslation = useMotionValue(0);
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    setDuration(baseDuration);
  }, [baseDuration]);

  useEffect(() => {
    if (!latestNews?.length) {
      return;
    }

    const finalPosition = -width / 2 - 8;
    if (!Number.isFinite(finalPosition) || finalPosition === 0) {
      return;
    }

    const controls = mustFinish
      ? animate(xTranslation, [xTranslation.get(), finalPosition], {
          ease: "linear",
          duration: duration * (1 - xTranslation.get() / finalPosition),
          onComplete: () => {
            setMustFinish(false);
            setRerender((value) => !value);
          },
        })
      : animate(xTranslation, [0, finalPosition], {
          ease: "linear",
          duration,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        });

    return controls.stop;
  }, [rerender, xTranslation, duration, width, mustFinish, latestNews]);

  const repeatedTapeItems = useMemo(() => {
    if (!latestNews?.length) {
      return [];
    }

    return Array(10)
      .fill(latestNews)
      .flat()
      .map((newsItem, index) => (
        <div
          key={`${newsItem._id}-${index}`}
          className="flex items-center gap-2 whitespace-nowrap px-4"
        >
          {newsItem.link ? (
            <Link
              href={newsItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline"
            >
              {newsItem.title}
              <ExternalLink className="h-4 w-4" />
            </Link>
          ) : (
            <span>{newsItem.title}</span>
          )}
        </div>
      ));
  }, [latestNews]);

  if (!latestNews?.length) {
    return null;
  }

  return (
    <div className="relative flex h-10 items-center justify-center overflow-hidden border-b border-t border-gray-300">
      <motion.div
        className="absolute left-0 flex gap-4"
        style={{ x: xTranslation }}
        ref={ref}
        onHoverStart={() => {
          setMustFinish(true);
          setDuration(slowDuration);
        }}
        onHoverEnd={() => {
          setMustFinish(true);
          setDuration(baseDuration);
        }}
      >
        {[...repeatedTapeItems, ...repeatedTapeItems].map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </motion.div>
    </div>
  );
};

export default NewsTape;
