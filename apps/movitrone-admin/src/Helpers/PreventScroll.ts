'use client';
export const preventScroll = (state: boolean): void => {
  document.body.style.overflowY = state ? 'hidden' : 'scroll';
};
