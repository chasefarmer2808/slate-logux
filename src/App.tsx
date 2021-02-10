import { LoguxReduxStore, useSubscription } from '@logux/redux';
import React, { useCallback, useState } from 'react';
import { useMemo } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { createEditor, NodeEntry, Text, Range, Path } from 'slate';
import { Editable, ReactEditor, RenderLeafProps, Slate, withReact } from 'slate-react';
import './App.css';
import Caret from './Caret';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Note></Note>
        {/* <Counter></Counter> */}
      </header>
    </div>
  );
}

const Note = () => {
  const noteContent = useSelector((state: any) => state.noteContent);
  const dispatch = useDispatch() as any;
  const store = useStore();
  const isSubscribing = useSubscription(['note']);
  const editor = useMemo(() => {
    const editor = withReact(createEditor());

    return withCursors(editor, dispatch, (store as LoguxReduxStore).client.clientId);
  }, [dispatch, store]);
  const [value, setValue] = useState(noteContent);
  const [cursors, setCursors] = useState<Record<string, any>>({});

  const cursorDecorator = useCallback(([node, path]: NodeEntry) => {
    const ranges: Range[] = [];

    if (Text.isText(node) && Object.keys(cursors).length) {
      Object.keys(cursors).forEach(userId => {
        const currCursor = cursors[userId];
        
        if (Range.includes((currCursor as Range), path)) {
          const { focus, anchor } = currCursor;

          const isFocusNode = Path.equals(focus.path, path);
          const isAnchorNode = Path.equals(anchor.path, path);
          const isForward = Range.isForward({ anchor, focus });
          const anchorOffset = isAnchorNode 
            ? anchor.offset
            : isForward
            ? 0
            : node.text.length;
          const focusOffset = isFocusNode
            ? focus.offset
            : isForward
            ? node.text.length
            : 0;

          ranges.push({
            isForward,
            isCaret: isFocusNode,
            anchor: {
              path,
              offset: anchorOffset
            },
            focus: {
              path,
              offset: focusOffset
            }
          });
        }
      });
    }

    return ranges;
  }, [cursors]);


  store.subscribe(() => {
    setValue(store.getState().noteContent);
    setCursors(store.getState().cursors);
  });

  const handleChange = (newValue: any) => {
    setValue(newValue);
    dispatch.sync({ type: 'EDIT_NOTE', noteContent: newValue });
  }

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [cursorDecorator]);

  if (isSubscribing) {
    return <p>Loading</p>;
  } else {
    return (
      <Slate
        editor={editor}
        value={value}
        onChange={newValue => handleChange(newValue)}
        >
          <Editable 
            renderLeaf={renderLeaf}
            decorate={cursorDecorator} />
        </Slate>
    )
  }
}

const withCursors = (editor: ReactEditor, dispatch: any, userId: string): ReactEditor => {
  const { onChange } = editor;

  editor.onChange = () => {
    const anchor = editor.selection?.anchor;
    const focus = editor.selection?.focus;
    setTimeout(() => dispatch.sync({ type: 'CHANGE_CURSOR', cursor: {userId, anchor, focus} }), 0);

    if (onChange) {
      onChange();
    }
  }
  
  return editor;
}

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      style={{
        position: "relative",
      }}>
        {leaf.isCaret ? <Caret {...(leaf as any)} /> : null}
        {children}
      </span>
  );
};

export default App;
