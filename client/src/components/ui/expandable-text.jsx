import { useMemo, useState } from "react";
import Button from "./button";

const ExpandableText = ({
  text = "",
  previewChars = 220,
  className = "",
  preserveWhitespace = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const content = useMemo(() => {
    const safeText = String(text || "");
    if (expanded || safeText.length <= previewChars) {
      return safeText;
    }
    return `${safeText.slice(0, previewChars).trimEnd()}...`;
  }, [expanded, previewChars, text]);

  if (!text) {
    return null;
  }

  const canExpand = String(text).length > previewChars;

  return (
    <div>
      <p className={`${preserveWhitespace ? "whitespace-pre-wrap" : ""} break-words ${className}`}>{content}</p>
      {canExpand ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-1 h-auto px-0 text-teal-700 hover:text-teal-900"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      ) : null}
    </div>
  );
};

export default ExpandableText;
