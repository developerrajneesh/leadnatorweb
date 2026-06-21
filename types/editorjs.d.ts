declare module "@editorjs/embed" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Embed: BlockToolConstructable;
  export default Embed;
}

declare module "@editorjs/link" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const LinkTool: BlockToolConstructable;
  export default LinkTool;
}

declare module "@editorjs/header" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Header: BlockToolConstructable;
  export default Header;
}

declare module "@editorjs/list" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const List: BlockToolConstructable;
  export default List;
}

declare module "@editorjs/image" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const ImageTool: BlockToolConstructable;
  export default ImageTool;
}

declare module "@editorjs/quote" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Quote: BlockToolConstructable;
  export default Quote;
}

declare module "@editorjs/delimiter" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Delimiter: BlockToolConstructable;
  export default Delimiter;
}

declare module "@editorjs/paragraph" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Paragraph: BlockToolConstructable;
  export default Paragraph;
}

declare module "@editorjs/checklist" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Checklist: BlockToolConstructable;
  export default Checklist;
}

declare module "@editorjs/warning" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Warning: BlockToolConstructable;
  export default Warning;
}

declare module "@editorjs/code" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Code: BlockToolConstructable;
  export default Code;
}

declare module "@editorjs/marker" {
  import type { InlineToolConstructable } from "@editorjs/editorjs";
  const Marker: InlineToolConstructable;
  export default Marker;
}

declare module "@editorjs/inline-code" {
  import type { InlineToolConstructable } from "@editorjs/editorjs";
  const InlineCode: InlineToolConstructable;
  export default InlineCode;
}
