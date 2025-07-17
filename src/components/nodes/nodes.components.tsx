import { Position, Handle, type NodeProps, type Node } from '@xyflow/react';
import OverlayLoader from "overlay-loading-react";

export function TelegramApiNode() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="bg-blue-500 w-3 h-3 rounded-full"
      />
      <div className="h-5 p-8 border border-[#1a192b] rounded-sm mb-2 flex justify-center items-center cursor-grab">
          Telegram API Node
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="bg-blue-500 w-3 h-3 rounded-full"
      />
    </>
  )
}

export function OutputWebhookNode({ data }: NodeProps<Node<{ loading: boolean, description: string }>>) {
  return (
    <>
      <Handle
          type="target"
          position={Position.Left}
          className="bg-blue-500 w-3 h-3 rounded-full"
        />
      <div className={`h-5 p-8 border rounded-sm mb-2 flex-col flex justify-center items-center cursor-grab ${data.loading ? 'border-green-500' : 'border-[#1a192b]'}`}>
          Output Webhook Node
          {data.loading && <span className="text-green-500 text-xs"><OverlayLoader active={data.loading}/></span>}
          {!data.loading && (
            <span className="text-green-600 text-xs ml-2">{data.description}</span>
          )}
      </div>
    </>
  )
}
