interface PlainTextContentProps {
  text: string;
  className?: string;
}

export default function PlainTextContent({ text, className = '' }: PlainTextContentProps) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const paragraphs = trimmed.split(/\n\n+/);

  if (paragraphs.length === 1) {
    return (
      <div className={`whitespace-pre-line leading-relaxed ${className}`.trim()}>
        {trimmed}
      </div>
    );
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
