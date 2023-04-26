

const useDOMParser = (text, lastIndex) => {
   const parser = new DOMParser();
   const htmlDoc = parser.parseFromString(text, 'text/html');
   const textContent = htmlDoc.body.textContent || "";
   const truncatedText = textContent.slice(0, lastIndex) + (textContent.length > 90 ? "..." : "");

   return truncatedText;
}

export default useDOMParser
