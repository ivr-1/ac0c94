'use client'

import { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Node as FlowNode,
  Edge as FlowEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PrefillPanel from './prefillpanel';
import { GraphData } from './types';

interface GraphProps {
  data: GraphData;
}

export default function Graph({ data }: GraphProps) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [mappings, setMappings] = useState<{ [nodeId: string]: PrefillMapping[] }>({});

  useEffect(() => {
    if (data && data.nodes && data.edges && data.forms) {
      const formFieldMap: { [formId: string]: string[] } = {};
      data.forms.forEach((form) => {
        formFieldMap[form.id] = Object.keys(form.field_schema.properties);
      });

      const newNodes: FlowNode[] = data.nodes.map((node) => {
        const fieldNames = formFieldMap[node.data.component_id] || [];
        return {
          id: node.id,
          type: 'default',
          position: { x: node.position.x, y: node.position.y },
          data: {
            label: node.data.name,
            fieldNames,
          },
          targetPosition: 'left',
          sourcePosition: 'right',
        };
      });

      const newEdges: FlowEdge[] = data.edges.map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [data]);

  useEffect(() => {
    if (selectedNode && !mappings[selectedNode.id]) {
      const initialMappings = selectedNode.data.fieldNames.map((fieldName: string) => ({
        fieldName,
      }));
      setMappings((prev) => ({ ...prev, [selectedNode.id]: initialMappings }));
    }
  }, [selectedNode, mappings]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: any, node: FlowNode) => {
    setSelectedNode(node);
  }, []);

  const findUpstreamNodes = useCallback(
    (nodeId: string) => {
      const directDependencies = edges
        .filter((edge) => edge.target === nodeId)
        .map((edge) => nodes.find((node) => node.id === edge.source))
        .filter(Boolean) as FlowNode[];

      const allUpstream: FlowNode[] = [...directDependencies];
      const visited = new Set<string>();

      const findTransitive = (currentId: string) => {
        if (visited.has(currentId)) return;
        visited.add(currentId);
        const parents = edges
          .filter((edge) => edge.target === currentId)
          .map((edge) => edge.source);
        parents.forEach((parentId) => {
          const parentNode = nodes.find((node) => node.id === parentId);
          if (parentNode && !allUpstream.some((node) => node.id === parentId)) {
            allUpstream.push(parentNode);
            findTransitive(parentId);
          }
        });
      };

      directDependencies.forEach((dep) => findTransitive(dep.id));

      return {
        direct: directDependencies,
        all: allUpstream,
      };
    },
    [nodes, edges]
  );

  return (
    <div className="flex h-screen w-screen">
      {selectedNode && (
        <PrefillPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          upstreamNodes={findUpstreamNodes(selectedNode.id)}
          mappings={mappings[selectedNode.id] || []}
          onMappingsChange={(newMappings) =>
            setMappings((prev) => ({ ...prev, [selectedNode.id]: newMappings }))
          }
        />
      )}
      <div className="h-screen w-screen bg-green-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}