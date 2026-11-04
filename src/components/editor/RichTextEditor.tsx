import { useEffect, useId } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Eraser,
  ListBullets,
  ListNumbers,
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from "@phosphor-icons/react";
import { richTextContent, sanitizeRichText } from "../../lib/rich-text";

const extensions = [StarterKit.configure({
  heading: false,
  code: false,
  codeBlock: false,
  blockquote: false,
  horizontalRule: false,
  link: false,
})];

interface RichTextValue {
  readonly text: string;
  readonly html: string | null;
}

interface Props {
  readonly label: string;
  readonly value: RichTextValue;
  readonly onChange: (value: RichTextValue) => void;
}

export function RichTextEditor({ label, value, onChange }: Props) {
  const labelId = useId();
  const content = richTextContent(value);
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "rich-text min-h-24 px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/20",
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
      },
      transformPastedHTML: sanitizeRichText,
    },
    onUpdate: ({ editor: current }) => {
      onChange({
        text: current.getText(),
        html: current.isEmpty ? "" : sanitizeRichText(current.getHTML()),
      });
    },
  });
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => current ? {
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      strike: current.isActive("strike"),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      undo: current.can().undo(),
      redo: current.can().redo(),
    } : null,
  });

  useEffect(() => {
    if (editor && sanitizeRichText(editor.getHTML()) !== content) {
      if (editor.isEmpty && (content === "" || content === "<p></p>")) return;
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  const actions = [
    { label: "Tebal", icon: TextB, active: state?.bold, run: () => editor?.chain().focus().toggleBold().run() },
    { label: "Miring", icon: TextItalic, active: state?.italic, run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Garis bawah", icon: TextUnderline, active: state?.underline, run: () => editor?.chain().focus().toggleUnderline().run() },
    { label: "Coret", icon: TextStrikethrough, active: state?.strike, run: () => editor?.chain().focus().toggleStrike().run() },
    { label: "Daftar poin", icon: ListBullets, active: state?.bulletList, run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Daftar bernomor", icon: ListNumbers, active: state?.orderedList, run: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Undo", icon: ArrowCounterClockwise, disabled: !state?.undo, run: () => editor?.chain().focus().undo().run() },
    { label: "Redo", icon: ArrowClockwise, disabled: !state?.redo, run: () => editor?.chain().focus().redo().run() },
    { label: "Hapus format", icon: Eraser, run: () => editor?.chain().focus().clearNodes().unsetAllMarks().run() },
  ];

  return (
    <div>
      <div id={labelId} className="mb-1 text-xs font-semibold text-slate-500">{label}</div>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div role="group" aria-label={`Format ${label}`} className="flex flex-wrap gap-1 border-b border-border bg-muted/60 p-1">
          {actions.map(({ label: actionLabel, icon: Icon, active, disabled, run }) => (
            <button
              key={actionLabel}
              type="button"
              title={actionLabel}
              aria-label={actionLabel}
              aria-pressed={active}
              disabled={!editor || disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={run}
              className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8 ${active ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-primary/5"}`}
            >
              <Icon size={16} weight="bold" />
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
