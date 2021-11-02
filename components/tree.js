import React, { useState } from "react";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import useForceUpdate from "./use-force-update";
import { LinkVertical } from "@visx/shape";

const defaultMargin = { top: 64, left: 60, right: 60, bottom: 128 };

export default function TreeNode({
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  data = [],
  onClick,
  activeNodeId,
  hoveredNode,
  setHoveredNode,
}) {
  const forceUpdate = useForceUpdate();

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  const origin = { x: 0, y: 0 };
  const sizeWidth = innerWidth;
  const sizeHeight = innerHeight;

  return totalWidth < 10 ? null : (
    <div className="relative">
      <svg width={totalWidth} height={totalHeight}>
        <rect width={totalWidth} height={totalHeight} fill="black" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(data, (d) => (d.isExpanded ? null : d.children))}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {(tree) => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => (
                  <LinkVertical
                    key={i}
                    data={link}
                    percent={0.5}
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  const width = 50;
                  const height = 20;
                  const top = node.y;
                  const left = node.x;

                  return (
                    <Group top={top} left={left} key={key}>
                      <rect
                        className="cursor-pointer"
                        height={height}
                        width={width}
                        y={-height / 2}
                        x={-width / 2}
                        fill={
                          activeNodeId === node.data.id ||
                          hoveredNode?.data?.id === node.data.id
                            ? "white"
                            : "black"
                        }
                        stroke="white"
                        strokeWidth={1}
                        onClick={() => {
                          if (
                            node.data.children &&
                            activeNodeId === node.data.id
                          ) {
                            node.data.isExpanded = !node.data.isExpanded;
                            forceUpdate();
                          }
                          onClick(node);
                        }}
                        onMouseOver={() => setHoveredNode(node)}
                        onMouseOut={() => setHoveredNode(null)}
                      />
                      <text
                        dy="3px"
                        className="pointer-events-none"
                        fontSize={9}
                        fontFamily={"Menlo"}
                        textAnchor="middle"
                        fill={
                          activeNodeId === node.data.id ||
                          hoveredNode?.data?.id === node.data.id
                            ? "black"
                            : "white"
                        }
                      >
                        {node.data.shortId || ""}
                      </text>
                    </Group>
                  );
                })}
              </Group>
            )}
          </Tree>
        </Group>
      </svg>
    </div>
  );
}
