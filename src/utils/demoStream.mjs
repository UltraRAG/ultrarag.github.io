/** Start a sample response and return a cancellation function for both phases. */
export function startDemoStream(response, {onChunk, onComplete}) {
  let cancelled = false;
  let interval;
  const timeout = setTimeout(() => {
    if (cancelled) return;
    let position = 0;
    onChunk({...response, content: '', isStreaming: true});
    interval = setInterval(() => {
      if (cancelled) return;
      position += 3;
      if (position >= response.content.length) {
        clearInterval(interval);
        onComplete(response);
      } else {
        onChunk({...response, content: response.content.slice(0, position), isStreaming: true});
      }
    }, 18);
  }, 800);

  return () => {
    cancelled = true;
    clearTimeout(timeout);
    clearInterval(interval);
  };
}
