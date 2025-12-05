import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function InfiniteScrollList({ 
  items, 
  renderItem, 
  pageSize = 12,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gap = "gap-6",
  loadingText = "Carregando mais..."
}) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setDisplayedItems(items.slice(0, pageSize));
    setPage(1);
    setHasMore(items.length > pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, items, page]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const start = 0;
      const end = nextPage * pageSize;
      const newItems = items.slice(start, end);
      
      setDisplayedItems(newItems);
      setPage(nextPage);
      setHasMore(end < items.length);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div>
      <div className={`grid ${gridCols} ${gap}`}>
        {displayedItems.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.3) }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-white/50">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingText}</span>
          </div>
        </div>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="text-center py-8 text-white/40">
          Todos os itens carregados
        </div>
      )}
    </div>
  );
}