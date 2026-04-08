import ReactMarkdown, {type Components} from "react-markdown";
import remarkGfm from "remark-gfm";

export const markdownComponents: Components = {
  h1: ({children}) => (
    <h2 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
      {children}
    </h2>
  ),
  h2: ({children}) => (
    <h3 className="mb-6 text-2xl leading-tight font-semibold text-black sm:text-3xl sm:leading-tight dark:text-white">
      {children}
    </h3>
  ),
  p: ({children}) => (
    <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
      {children}
    </p>
  ),
  a: ({href, children}) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  ),
  strong: ({children}) => <strong className="font-semibold text-black dark:text-white">{children}</strong>,
  ul: ({children}) => <ul className="mb-10 ml-6 list-disc space-y-2 text-body-color">{children}</ul>,
  ol: ({children}) => <ol className="mb-10 ml-6 list-decimal space-y-2 text-body-color">{children}</ol>,
  li: ({children}) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({children}) => (
    <blockquote className="mb-10 border-l-4 border-primary/40 pl-4 italic text-body-color">
      {children}
    </blockquote>
  ),
  code: ({children, className}) => (
    <code className={`rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.95em] text-black dark:bg-white/10 dark:text-white ${className ?? ""}`}>
      {children}
    </code>
  ),
};

type MarkdownProps = {
  content: string;
  className?: string;
  components?: Components;
};

const mergeComponents = (overrides?: Components): Components => ({
  ...markdownComponents,
  ...overrides,
});

const Markdown = ({content, className, components}: MarkdownProps) => {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mergeComponents(components)}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;

