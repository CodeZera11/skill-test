"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ExternalLink } from "lucide-react";
import useMeasure from "react-use-measure";
import Link from "next/link";
import { RssNewsItem } from "@/types/rss";

const NewsTape = () => {
  const [latestNews, setLatestNews] = useState<RssNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const FAST_DURATION = 75; // Fast scrolling speed
  const SLOW_DURATION = 75; // Slow scrolling speed

  const [duration, setDuration] = useState(FAST_DURATION);
  const [ref, { width }] = useMeasure(); // Measure the width of the tape
  const xTranslation = useMotionValue(0); // Motion value for x-axis translation
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTickerNews = async () => {
      try {
        const response = await fetch("/api/rss-news?perFeedLimit=2");
        const data = await response.json();
        if (isMounted) {
          setLatestNews(Array.isArray(data?.items) ? data.items : []);
        }
      } catch {
        if (isMounted) {
          setLatestNews([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTickerNews();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let controls;
    const finalPosition = -width / 2 - 8; // Final position for seamless looping

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [rerender, xTranslation, duration, width, mustFinish]);


  if (isLoading || !latestNews.length) {
    return null; // Return nothing if news is not loaded yet
  }

  // Repeat the news items 3 times to ensure the tape looks full
  const repeatedTapeItems = Array(10)
    .fill(latestNews)
    .flat()
    .map((newsItem: RssNewsItem, index: number) => (
      <div
        key={`${newsItem.title}-${index}`}
        className="flex items-center gap-2 whitespace-nowrap px-4"
      >
        {newsItem.link ? (
          <Link
            href={newsItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline flex items-center gap-1"
          >
            {newsItem.title}
            <ExternalLink className="h-4 w-4" />
          </Link>
        ) : (
          <span>{newsItem.title}</span>
        )}
      </div>
    ));

  return (
    <div className="relative border-t border-b border-gray-300 overflow-hidden h-10 flex items-center justify-center">
      <motion.div
        className="absolute left-0 flex gap-4"
        style={{ x: xTranslation }}
        ref={ref}
        onHoverStart={() => {
          setMustFinish(true);
          setDuration(SLOW_DURATION);
        }}
        onHoverEnd={() => {
          setMustFinish(true);
          setDuration(FAST_DURATION);
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
