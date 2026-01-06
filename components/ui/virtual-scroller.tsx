
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

interface VirtualScrollerProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: string | number;
    renderItem: (item: T, index: number) => React.ReactNode;
    overscan?: number;
    className?: string;
}

export function VirtualScroller<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 5,
    className = ""
}: VirtualScrollerProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerActualHeight, setContainerActualHeight] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerActualHeight(containerRef.current.offsetHeight);
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setContainerActualHeight(entry.contentRect.height);
                }
            });
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const { visibleItems, totalHeight } = useMemo(() => {
        const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const visibleEnd = Math.min(
            items.length,
            Math.ceil((scrollTop + (typeof containerHeight === 'number' ? containerHeight : containerActualHeight)) / itemHeight) + overscan
        );

        return {
            visibleItems: items.slice(visibleStart, visibleEnd).map((item, index) => ({
                item,
                index: visibleStart + index
            })),
            totalHeight: items.length * itemHeight
        };
    }, [items, scrollTop, itemHeight, containerHeight, containerActualHeight, overscan]);

    return (
        <div
            ref={containerRef}
            className={`overflow-auto relative ${className}`}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
                {visibleItems.map(({ item, index }) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: index * itemHeight,
                            left: 0,
                            right: 0,
                            height: itemHeight
                        }}
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>
        </div>
    );
}
