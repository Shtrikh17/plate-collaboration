'use client'
import React, {useEffect, useRef, useState} from "react"
import {Plate, PlateContent, usePlateEditor} from "@udecode/plate-core/react";
import {Editor} from "@/components/plate-ui/editor"
import {CodeBlockPlugin, CodeSyntaxPlugin, CodeLinePlugin} from "@udecode/plate-code-block/react";
import {BoldPlugin} from "@udecode/plate-basic-marks/react";
import {CodeBlockElement} from "@/components/plate-ui/code-block-element";
import {ParagraphElement} from "@/components/plate-ui/paragraph-element"
import {HeadingPlugin} from "@udecode/plate-heading/react";
import {HEADING_KEYS, UnknownObject} from "@udecode/plate";
import {cn, withProps} from "@udecode/cn";
import {HeadingElement} from "@/components/plate-ui/heading-element";
import {AutoformatPlugin} from "@udecode/plate-autoformat/react";
import {autoformatRules} from "@/lib/autoformat";
import Prism from 'prismjs';
import {CodeSyntaxLeaf} from "@/components/plate-ui/code-syntax-leaf";
import {
    isCodeBlockEmpty,
    isSelectionAtCodeBlockStart,
    unwrapCodeBlock,
} from '@udecode/plate-code-block';
import {withPlaceholders} from "@/components/plate-ui/placeholder";
import {TrailingBlockPlugin} from "@udecode/plate-trailing-block";
import {KbdPlugin} from "@udecode/plate/react";
import {CodeLineElement} from "@/components/plate-ui/code-line-element";
import {IndentPlugin} from "@udecode/plate/react";
import {ExitBreakPlugin, SoftBreakPlugin} from "@udecode/plate-break/react";
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';

// import { createPlateEditor, PlateLeaf } from '@udecode/plate-common/react';
// import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
// import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
// import { LinkPlugin } from '@udecode/plate-link/react';
// import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
// import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
// import { TogglePlugin } from '@udecode/plate-toggle/react';
// import { ColumnPlugin, ColumnItemPlugin } from '@udecode/plate-layout/react';
// import { CaptionPlugin } from '@udecode/plate-caption/react';
// import { MentionPlugin, MentionInputPlugin } from '@udecode/plate-mention/react';
// import { TablePlugin, TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin } from '@udecode/plate-table/react';
// import { TodoListPlugin } from '@udecode/plate-list/react';
// import { DatePlugin } from '@udecode/plate-date/react';
// import { ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin, SubscriptPlugin, SuperscriptPlugin } from '@udecode/plate-basic-marks/react';
// import { FontColorPlugin, FontBackgroundColorPlugin, FontSizePlugin } from '@udecode/plate-font';
// import { HighlightPlugin } from '@udecode/plate-highlight/react';
// import { AlignPlugin } from '@udecode/plate-alignment';
// import { IndentListPlugin } from '@udecode/plate-indent-list/react';
// import { LineHeightPlugin } from '@udecode/plate-line-height';
// import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
// import { DndPlugin } from '@udecode/plate-dnd';
// import { EmojiPlugin } from '@udecode/plate-emoji/react';
// import { NodeIdPlugin } from '@udecode/plate-node-id';
// import { DeletePlugin } from '@udecode/plate-select';
// import { TabbablePlugin } from '@udecode/plate-tabbable/react';
// import { CommentsPlugin } from '@udecode/plate-comments/react';
// import { DocxPlugin } from '@udecode/plate-docx';
// import { CsvPlugin } from '@udecode/plate-csv';
// import { MarkdownPlugin } from '@udecode/plate-markdown';
// import { JuicePlugin } from '@udecode/plate-juice';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
//
// import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
// import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element';
// import { HrElement } from '@/components/plate-ui/hr-element';
// import { ImageElement } from '@/components/plate-ui/image-element';
// import { LinkElement } from '@/components/plate-ui/link-element';
// import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar';
// import { ToggleElement } from '@/components/plate-ui/toggle-element';
// import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
// import { ColumnElement } from '@/components/plate-ui/column-element';
// import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
// import { MentionElement } from '@/components/plate-ui/mention-element';
// import { MentionInputElement } from '@/components/plate-ui/mention-input-element';
// import { TableElement } from '@/components/plate-ui/table-element';
// import { TableRowElement } from '@/components/plate-ui/table-row-element';
// import { TableCellElement, TableCellHeaderElement } from '@/components/plate-ui/table-cell-element';
// import { TodoListElement } from '@/components/plate-ui/todo-list-element';
// import { DateElement } from '@/components/plate-ui/date-element';
// import { CodeLeaf } from '@/components/plate-ui/code-leaf';
// import { CommentLeaf } from '@/components/plate-ui/comment-leaf';
// import { CommentsPopover } from '@/components/plate-ui/comments-popover';
// import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
// import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
// import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
// import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
// import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar';
// import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons';
// import { withDraggables } from '@/components/plate-ui/with-draggables';
// import { TooltipProvider } from '@/components/plate-ui/tooltip';
// import { EmojiInputElement } from '@/components/plate-ui/emoji-input-element';
import {YjsAboveEditable, YjsPlugin} from '@udecode/plate-yjs/react';
import {ParagraphPlugin} from "@udecode/plate-common/react";
import {CursorOverlay, DragOverCursorPlugin} from "@/components/plate-ui/cursor-overlay";
import {useDecorateRemoteCursors} from "@slate-yjs/react";
import {relativeRangeToSlateRange} from "@slate-yjs/core";
import {StatesArray} from "@hocuspocus/provider/src/types";

const init = [
    {
        type: 'p',
        children: [
            {text: 'Hello, world'}
        ]
    }
]

const resetBlockTypesCodeBlockRule = {
    types: [CodeBlockPlugin.key],
    defaultType: ParagraphPlugin.key,
    onReset: unwrapCodeBlock,
};

function DecoratedEditable() {
    const decorate = useDecorateRemoteCursors();
    return (
        <div>{JSON.stringify(decorate)}</div>
    );
}

export const Test = ({username, color}: {username: string, color: string}) => {
    const [state, setState] = useState(JSON.stringify(init))
    const containerRef = useRef(null);

    const [cursor, setCursor]: Record<string, any> = useState({})
    const onAwarenessUpdate = (x: {states: StatesArray}) => {
        handleStates(x.states)
    }

    const handleStates = (states: StatesArray) => {
        let cursors: Record<string, any> = {}
        for(let i = 0; i < states.length; i++){
            let item = states[i]
            if(item?.data?.name && item?.cursor && item.data.name !== username){
                let p = relativeRangeToSlateRange(editor.sharedRoot, editor, item.cursor)
                if(p){
                    cursors[item.clientId] = {key: item.clientId, data: item.data, selection: p}
                    cursors[item.clientId].data.style.width = 2
                }
            }
        }
        setCursor(cursors)
    }




    //@ts-ignore
    const editor = usePlateEditor({
        value: JSON.parse(state),
        plugins: [
            AutoformatPlugin.configure({
                options: {
                    rules: autoformatRules,
                    enableUndoOnDelete: true
                }
            }),
            BoldPlugin,
            HeadingPlugin,
            CodeBlockPlugin.configure({
                options: {
                    prism: Prism
                }
            }),
            CodeLinePlugin,
            CodeSyntaxPlugin,
            ResetNodePlugin.configure({
                options: {
                    rules: [
                        {
                            ...resetBlockTypesCodeBlockRule,
                            hotkey: 'Enter',
                            predicate: isCodeBlockEmpty,
                        },
                        {
                            ...resetBlockTypesCodeBlockRule,
                            hotkey: 'Backspace',
                            predicate: isSelectionAtCodeBlockStart,
                        },
                    ]
                }
            }),
            TrailingBlockPlugin,
            KbdPlugin,
            IndentPlugin.extend({
                inject: {
                    targetPlugins: [
                        CodeBlockPlugin.key,
                        ParagraphPlugin.key
                    ]
                }
            }),
            ExitBreakPlugin.configure({
                options: {
                    rules: [
                        {
                            hotkey: 'mod+enter',
                        },
                        {
                            before: true,
                            hotkey: 'mod+shift+enter',
                        },
                        {
                            hotkey: 'enter',
                            level: 1,
                            query: {
                                allow: ['h1', 'h2', 'h3'],
                                end: true,
                                start: true,
                            },
                            relative: true,
                        },
                    ],
                },
            }),
            SoftBreakPlugin.configure({
                options: {
                    rules: [
                        { hotkey: 'shift+enter' },
                        {
                            hotkey: 'enter',
                            query: {
                                allow: ['code_block', 'blockquote', 'td', 'th'],
                            },
                        },
                    ],
                },
            }),
            YjsPlugin.configure({
                options:{
                    hocuspocusProviderOptions: {
                        url: 'http://192.168.10.120:1234',
                        name: 'test',
                        onAwarenessUpdate: onAwarenessUpdate,
                    },
                    cursorOptions:{
                        autoSend: true,
                        data: {name: username, style: {backgroundColor: color || 'red', color: 'white'}},
                        cursorStateField: 'cursor'
                    },
                },
            }),
            DragOverCursorPlugin
        ],
        override: {
            components: withPlaceholders({
                [HEADING_KEYS.h1]: withProps(HeadingElement, {variant: 'h1'}),
                [CodeBlockPlugin.key]: CodeBlockElement,
                [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
                [ParagraphPlugin.key]: ParagraphElement,
                [CodeLinePlugin.key]: CodeLineElement
            })
        },
    })



    return <div className={"test"}>
        <Plate editor={editor} onChange={(x) => setState(JSON.stringify(x.value))}>
            <div
                ref={containerRef}
                id={'wrapper'}
                className={cn(
                    'relative flex max-h-[800px] w-full overflow-x-auto',
                    // block selection area
                    '[&_.slate-selected]:!bg-primary/20 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary [&_.slate-selection-area]:bg-primary/10'
                )}
                data-plate-selectable
            >
                <Editor placeholder={"Type something..."} />
                <CursorOverlay
                    containerRef={containerRef}
                    cursors={cursor}
                />
            </div>
        </Plate>
    </div>
}
