import { Handle, Position } from "@xyflow/react"
import { FunctionComponent } from "react"
import OverlayLoader from "overlay-loading-react";

type NodeType = {
    dotLeft?: boolean,
    dotRight?: boolean,
    isLoading: boolean,
    isDone: boolean,
    text: String,
    description?: String
    
}
export const NodeStructure: FunctionComponent<NodeType> = ({
    isDone = false,
    isLoading, 
    dotLeft,
    dotRight,
    description,
    text
}) => {
    return (
        <div>
            {
                dotLeft && 
                <Handle
                    type="target"
                    position={Position.Left}
                    className="bg-blue-500 w-3 h-3 rounded-full"
                />
            }
            <div className={`h-5 p-8 border rounded-sm mb-2 flex-col flex justify-center items-center cursor-grab ${isDone ? 'border-green-500' : 'border-[#1a192b]'}`}>
                {text}
                {isLoading && <OverlayLoader active={isLoading}/>}
                {description && <span className="text-green-600 text-xs ml-2">{description}</span>}
            </div>
            {
                dotRight && 
                <Handle
                    type="source"
                    position={Position.Right}
                    className="bg-blue-500 w-3 h-3 rounded-full"
                />
            }
        </div>
    )
}