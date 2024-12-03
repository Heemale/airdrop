import React, { useState, useRef, useEffect } from 'react';

interface Item {
  id: number;
  title: string;
}

const ScrollableComponent = ({ items }: { items: Item[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 更新活动项，根据滚动的位置计算
  const handleScroll = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scrollLeft = containerRef.current.scrollLeft;
      const index = Math.floor(scrollLeft / containerWidth);
      setActiveIndex(index);
    }
  };

  // 添加事件监听器来处理滚动
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div>
      {/* 滚动容器 */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollBehavior: 'smooth',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            style={{
              width: '300px', // 每个项的宽度
              height: '200px', // 每个项的高度
              marginRight: '20px',
              background: '#f0f0f0',
              textAlign: 'center',
              lineHeight: '200px',
              borderRadius: '10px',
              border: '1px solid #ccc',
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* 底部的点 */}
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
      >
        {items.map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              margin: '0 5px',
              backgroundColor: activeIndex === index ? 'blue' : 'transparent',
              border: '2px solid blue',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollableComponent;
