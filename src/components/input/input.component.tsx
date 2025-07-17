import { Position, Handle, useReactFlow, type NodeProps, type Node } from '@xyflow/react';

export function TextTelegramNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2 bg-gray-50">
      <div className="flex items-start gap-2 flex-col">
        <Handle
          type="target"
          position={Position.Left}
          className="bg-blue-500 w-3 h-3 rounded-full" 
        />
        <label htmlFor="text" className="font-medium text-gray-700">
          Telegram Message:
        </label>
        <input
          id="text"
          name="text"
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text || ''}
          className="nodrag border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="bg-blue-500 w-3 h-3 rounded-full" 
        />
      </div>
    </div>
  );
}

export function TextTelegramToken({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2 bg-gray-50">
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="text" className="font-medium text-gray-700">
          Telegram Token:
        </label>
        <input
          id="text"
          name="text"
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text || ''}
          className="nodrag border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="bg-blue-500 w-3 h-3 rounded-full" 
        />
      </div>
    </div>
  );
}
