import React, { useEffect, useRef } from "react";
import styles from "./ScrollObserver.module.css";
import { ScrollObserverProps } from "./utils";

const ScrollObserver: React.FC<ScrollObserverProps> = ({
  onLoadMore,
  hasMore,
  loadingMore,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, onLoadMore]);

  if (!hasMore && !loadingMore) {
    return (
      <div className={styles.endMessage}>
        <span>✨ Загружены все соревнования</span>
      </div>
    );
  }

  return (
    <div ref={observerRef} className={styles.observer}>
      {loadingMore && (
        <div className={styles.loadingMore}>
          <div className={styles.spinner}></div>
          <span>Загрузка дополнительных соревнований...</span>
        </div>
      )}
    </div>
  );
};

export default ScrollObserver;
