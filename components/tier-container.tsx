"use client"

import type { DragItem, RatingItem } from "@/model/types"
import { memo, useRef } from "react"
import { useDrop } from "react-dnd"
import { RatingItemComponent } from "./rating-item"

interface TierContainerProps {
    tier: string
    label: string
    color: string
    items: RatingItem[]
    moveItem: (dragIndex: number, hoverIndex: number, sourceTier: string, targetTier: string) => void
}

export const TierContainer = memo(function TierContainer({ tier, label, color, items, moveItem }: TierContainerProps) {
    const ref = useRef<HTMLDivElement>(null)

    const [{ isOver }, drop] = useDrop({
        accept: "RATING_ITEM",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        drop(item: DragItem, monitor) {
            // If dropped directly on the container (not on an item)
            if (!monitor.didDrop() && ref.current) {
                // Place at the end of this tier
                moveItem(item.index, items.length, item.tier, tier)
                return { moved: true }
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current || item.tier === tier) {
                return
            }

            // If hovering over an empty container
            if (items.length === 0) {
                moveItem(item.index, 0, item.tier, tier)
                item.index = 0
                item.tier = tier
            }
        },
    })

    drop(ref)

    return (
        <div className="flex">
            <div className={`${color} flex items-center justify-center w-16 self-stretch text-white font-bold text-xl`}>
                {label}
            </div>
            <div
                ref={ref}
                className={`flex-1 min-h-16 bg-gray-100 p-2 flex flex-wrap gap-2 transition-colors ${
                    isOver ? "bg-gray-200" : ""
                }`}
                style={{ minHeight: "80px" }}
            >
                {items.map((item, index) => (
                    <RatingItemComponent key={item.id} index={index} item={item} moveItem={moveItem} />
                ))}
            </div>
        </div>
    )
})
