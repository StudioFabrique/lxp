import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createImageNode, ImageNode, INSERT_IMAGE_COMMAND } from '../nodes/ImageNode';
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from 'lexical';
import { useEffect } from 'react';

export default function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}