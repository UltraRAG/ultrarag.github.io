import React, { useState, useEffect } from 'react';
import OriginalTOCItems from '@theme-original/TOCItems';
import { useLanguage } from '@site/src/context/LanguageContext';

/**
 * 递归过滤 TOC 项：只保留在 DOM 中实际存在的标题
 * 这样当 <En>/<Zh> 组件隐藏某些标题时，TOC 也会同步过滤
 */
function filterTocByDOM(items) {
  if (typeof document === 'undefined') return items;
  return items
    .filter(item => document.getElementById(item.id))
    .map(item => ({
      ...item,
      children: item.children ? filterTocByDOM(item.children) : [],
    }));
}

export default function TOCItems({ toc, ...props }) {
  const { lang } = useLanguage();
  // The other language has no DOM anchors during SSR or before hydration.
  const [filteredToc, setFilteredToc] = useState([]);

  useEffect(() => {
    // 等待 DOM 更新后再过滤
    const timer = requestAnimationFrame(() => {
      setFilteredToc(filterTocByDOM(toc));
    });
    return () => cancelAnimationFrame(timer);
  }, [lang, toc]);

  return <OriginalTOCItems toc={filteredToc} {...props} />;
}
