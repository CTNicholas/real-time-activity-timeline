import { useMutation } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/core";
import { nanoid } from "nanoid";
import { Toolbar, useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Trash2 } from "lucide-react";

export function CustomEditor({ field }: { field: string }) {
  const liveblocks = useLiveblocksExtension({ field, comments: false });

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit,
      Placeholder.configure({
        placeholder: "Enter text…",
      }),
    ],
  });

  const deleteEditor = useMutation(
    ({ storage }) => {
      const index = storage
        .get("actions")
        .findIndex((item) => item.get("field" as any) === field);
      storage.get("actions").delete(index);
    },
    [field]
  );

  return (
    <div className="lb-root my-4 relative rounded-lg bg-white border border-neutral-300  z-10 text-[var(--lb-foreground-secondary)]">
      <div className="flex items-center justify-between mb-2 border-b py-1.5 pt-2 p-2">
        <Toolbar editor={editor} className="!p-0">
          <Toolbar.SectionInline />
          <Toolbar.Separator />
          <Toolbar.BlockSelector />
        </Toolbar>
        <button className="lb-button" onClick={deleteEditor}>
          <span className="sr-only">Delete editor</span>
          <span className="p-px">
            <Trash2 className="w-4 h-4" />
          </span>
        </button>
      </div>

      <EditorContent
        className="*:outline-0 text-sm p-3 pb-2.5 pt-px"
        editor={editor}
      />

      <div className="absolute top-2.5 right-2.5"></div>
    </div>
  );
}

export function AddEditor() {
  const addEditor = useMutation(({ storage, self }) => {
    storage.get("actions").push(
      new LiveObject({
        type: "action",
        kind: "editor",
        userId: self.id,
        timestamp: Date.now(),
        field: nanoid(),
      })
    );
  }, []);

  return (
    <button
      className="relative cursor-pointer bg-neutral-100 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors border rounded-lg py-2 text-sm font-medium w-full mt-0"
      onClick={addEditor}
    >
      Add editor
    </button>
  );
}
