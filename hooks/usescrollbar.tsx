import { useState } from 'react';

const UseScrollBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const handleScroll = (event) => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
  };

  const handleLayout = (event) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  const scrollBarHeight = scrollViewHeight * (scrollViewHeight / contentHeight);
  const scrollBarPosition = (scrollPosition / contentHeight) * scrollViewHeight;

  return {
    handleScroll,
    handleContentSizeChange,
    handleLayout,
    scrollBarHeight,
    scrollBarPosition,
  };
};

export default UseScrollBar;