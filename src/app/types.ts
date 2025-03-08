export interface Position {
    x: number;
    y: number;
  }
  
  export interface NodeData {
    name: string;
    formFields: string[];
  }
  
  export interface Node {
    id: string;
    position: Position;
    data: NodeData;
  }
  
  export interface Edge {
    source: string;
    target: string;
  }
  
  export interface GraphData {
    nodes: Node[];
    edges: Edge[];
  }