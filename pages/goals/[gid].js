import { useState, useEffect } from "react";
import Link from "next/link";

import { fetchGoal } from "../../utils/fetch-helpers";
import ResizeContainer from "../../components/resize-container";
import {
  searchTree,
  removeChildren,
  transformGoals,
} from "../../utils/goal-helpers";
import Logo from "../../components/logo";
import Tree from "../../components/tree";

const SIDEBAR_WIDTH = 360;

export async function getServerSideProps({ params }) {
  const res = await fetchGoal(params.gid);
  let json = await res.json();

  json = removeChildren(transformGoals(json));

  if (!json) {
    return {
      notFound: true,
    };
  }

  return {
    props: { key: json?.id, goal: json },
  };
}

const Goal = ({ goal }) => {
  const [data, setData] = useState(goal);
  const [activeNodeId, setActiveNodeId] = useState(goal.id);
  const [activeNode, setActiveNode] = useState();
  const [hoveredNode, setHoveredNode] = useState(null);

  const onClick = async (node) => {
    const {
      data: { id },
    } = node;

    if (!node.data.children) {
      const res = await fetch(`${window.location.origin}/api/goal?id=${id}`);
      let json = await res.json();

      json = removeChildren(transformGoals(json));

      let copy = { ...data };
      const el = searchTree(copy, id);

      el.children = json.children;
      el.parentGoal = json.parentGoal;
      el.owners = json.owners;

      setData(copy);
    }

    setActiveNodeId(id);
  };

  useEffect(() => {
    setActiveNode(searchTree(data, activeNodeId));
  }, [activeNodeId, data]);

  return (
    <div>
      <Logo />
      <div className="relative">
        <ResizeContainer className="w-full">
          {({ width, height }) =>
            goal.error ? (
              <div className="flex items-center justify-center h-screen px-4">
                <p className="text-9xl">Goal not found :(</p>
              </div>
            ) : (
              <div className="relative flex">
                <div
                  className="py-4 flex flex-col relative min-h-screen"
                  style={{ width: SIDEBAR_WIDTH }}
                >
                  {activeNode?.parentGoal && (
                    <>
                      <div className="px-4">
                        <Link
                          href={`/goals/${activeNode.parentGoal.id}`}
                          prefetch={false}
                        >
                          <a
                            className={`flex border ${
                              hoveredNode?.data?.id === activeNode.parentGoal.id
                                ? "border-white"
                                : "border-gray-600"
                            }`}
                          >
                            <span className="p-4 font-light">
                              {activeNode.parentGoal.name}
                            </span>
                            <span className="block ml-auto">
                              <span
                                className="block font-mono text-gray-400 border-l border-b border-gray-600 p-1"
                                style={{ fontSize: 9 }}
                              >
                                {activeNode.parentGoal.shortId}
                              </span>
                            </span>
                          </a>
                        </Link>
                      </div>
                      <div className="w-px h-4 border-l border-gray-600 mx-auto" />
                    </>
                  )}
                  <div className="px-4">
                    <div className="bg-white text-black p-4">
                      <span className="flex items-center">
                        <span className="uppercase text-xs tracking-widest font-light">
                          Objective
                        </span>
                        <span className="block ml-auto">
                          <span
                            className="block font-mono bg-white text-black p-1"
                            style={{ fontSize: 9 }}
                          >
                            {activeNode?.shortId}
                          </span>
                        </span>
                      </span>
                      <h2 className="text-3xl mt-1">
                        {activeNode?.name}
                        {activeNode?.owners?.length && (
                          <div className="flex mt-2">
                            <span className="block text-xs ml-auto">
                              —{" "}
                              {activeNode?.owners.map((o) => o.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </h2>
                    </div>
                  </div>
                  {!!activeNode?.numChildren && (
                    <div className="flex-grow mx-4 pl-4">
                      <ul className="border-l border-gray-600 pt-1 pl-5">
                        {activeNode?.children?.map((c, i, arr) => (
                          <li key={c.id} className="relative my-4">
                            <span className="absolute w-5 h-px inset-y-0 my-auto -ml-5 bg-gray-600" />
                            {i === arr.length - 1 && (
                              <span className="absolute bottom-0 block w-6 h-1/2 bg-black -ml-6 -mb-px"></span>
                            )}
                            <Link href={`/goals/${c.id}`} prefetch={false}>
                              <a
                                className={`relative flex border hover:border-white ${
                                  c.id === hoveredNode?.data?.id
                                    ? "border-white"
                                    : "border-gray-600"
                                }`}
                              >
                                <span className="p-4 font-light">{c.name}</span>
                                <span className="block ml-auto">
                                  <span
                                    className="block font-mono text-gray-400 border-gray-600 border-l border-b p-1"
                                    style={{ fontSize: 9 }}
                                  >
                                    {c.shortId}
                                  </span>
                                </span>
                              </a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Tree
                  width={width - SIDEBAR_WIDTH}
                  height={height}
                  data={data}
                  onClick={onClick}
                  activeNodeId={activeNodeId}
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                />
              </div>
            )
          }
        </ResizeContainer>
      </div>
    </div>
  );
};

export default Goal;
