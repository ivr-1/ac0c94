'use client'

import { useState, useEffect } from 'react';
import { Node as FlowNode } from '@xyflow/react';

interface PrefillMapping {
  fieldName: string;
  sourceForm?: string;
  sourceField?: string;
}

interface PrefillPanelProps {
  node: FlowNode;
  onClose: () => void;
  upstreamNodes: {
    direct: FlowNode[];
    all: FlowNode[];
  };
  mappings: PrefillMapping[];
  onMappingsChange: (newMappings: PrefillMapping[]) => void;
}

export default function PrefillPanel({
  node,
  onClose,
  upstreamNodes,
  mappings,
  onMappingsChange,
}: PrefillPanelProps) {
  const [prefillMappings, setPrefillMappings] = useState<PrefillMapping[]>(mappings);
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    setPrefillMappings(mappings);
  }, [mappings]);

  const clearMapping = (fieldName: string) => {
    const newMappings = prefillMappings.map((mapping) =>
      mapping.fieldName === fieldName ? { fieldName } : mapping
    );
    setPrefillMappings(newMappings);
    onMappingsChange(newMappings);
  };

  const openConfigModal = (fieldName: string) => {
    setSelectedField(fieldName);
    setShowModal(true);
  };

  const setMapping = (fieldName: string, sourceForm: string, sourceField: string) => {
    const newMappings = prefillMappings.map((mapping) =>
      mapping.fieldName === fieldName
        ? { fieldName, sourceForm, sourceField }
        : mapping
    );
    setPrefillMappings(newMappings);
    onMappingsChange(newMappings);
    setShowModal(false);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Prefill for {node.data.label}</h2>
        <button onClick={onClose} className="text-gray-500">×</button>
      </div>

      <p className="text-sm mb-4">Prefill fields for this form</p>

      <div className="space-y-2">
        {prefillMappings.map((mapping) => (
          <div key={mapping.fieldName} className="flex items-center justify-between">
            <div
              className="flex-1 cursor-pointer p-2 border-b border-gray-100"
              onClick={() => !mapping.sourceField && openConfigModal(mapping.fieldName)}
            >
              {mapping.fieldName}
              {mapping.sourceForm && mapping.sourceField && (
                <span className="ml-2 text-blue-500">
                  : {mapping.sourceForm}.{mapping.sourceField}
                </span>
              )}
            </div>
            {mapping.sourceField && (
              <button
                onClick={() => clearMapping(mapping.fieldName)}
                className="text-gray-500 ml-2"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {showModal && selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Choose a field to prefill {selectedField}
            </h3>

            {/* Direct Dependencies */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Direct Dependencies</h4>
              <div className="space-y-1">
                {upstreamNodes.direct.length > 0 ? (
                  upstreamNodes.direct.map((upNode) => (
                    <div key={upNode.id} className="ml-2">
                      <h5 className="font-medium">{upNode.data.label}</h5>
                      <div className="ml-2">
                        {upNode.data.fieldNames.map((field: string) => (
                          <div
                            key={field}
                            className="cursor-pointer p-1 hover:bg-gray-100"
                            onClick={() => setMapping(selectedField, upNode.data.label, field)}
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="ml-2 text-gray-500">No direct dependencies</p>
                )}
              </div>
            </div>

            {/* Transitive Dependencies */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Transitive Dependencies</h4>
              <div className="space-y-1">
                {upstreamNodes.all
                  .filter((node) => !upstreamNodes.direct.some((direct) => direct.id === node.id))
                  .length > 0 ? (
                  upstreamNodes.all
                    .filter((node) =>
                      !upstreamNodes.direct.some((direct) => direct.id === node.id)
                    )
                    .map((upNode) => (
                      <div key={upNode.id} className="ml-2">
                        <h5 className="font-medium">{upNode.data.label}</h5>
                        <div className="ml-2">
                          {upNode.data.fieldNames.map((field: string) => (
                            <div
                              key={field}
                              className="cursor-pointer p-1 hover:bg-gray-100"
                              onClick={() =>
                                setMapping(selectedField, upNode.data.label, field)
                              }
                            >
                              {field}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="ml-2 text-gray-500">No transitive dependencies</p>
                )}
              </div>
            </div>

            {/* Global Data */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Global Data</h4>
              <div className="space-y-1 ml-2">
                {['userId', 'companyName', 'currentDate'].map((field) => (
                  <div
                    key={field}
                    className="cursor-pointer p-1 hover:bg-gray-100"
                    onClick={() => setMapping(selectedField, 'Global', field)}
                  >
                    {field}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}