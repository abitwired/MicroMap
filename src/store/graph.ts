import { CanvasElement } from "../canvas/types";
import { Node as VisualNode } from "../canvas/graph/node";
import { Edge as VisualEdge } from "../canvas/graph/edge";
import { Curve } from "../canvas/graph/curve";
import { VisualGraph } from "../canvas/graph/visual-graph";

/**
 * Represents a vertex in a graph.
 */
export type Node = {
  /** The unique identifier of the vertex. */
  id: string;
  /** The x-coordinate of the vertex. */
  x: number;
  /** The y-coordinate of the vertex. */
  y: number;
  /** The label of the vertex. */
  label: string;
  /** The color of the vertex. */
  color: string;
  /** The width of the vertex. */
  width: number;
  /** The height of the vertex. */
  height: number;
};

/**
 * Represents a connection between two vertices in a graph.
 */
export type Edge = {
  /** The from vertex of the connection. */
  from: string;
  /** The to vertex of the connection. */
  to: string;
};

/**
 * Represents a graph.
 */
export class Graph {
  nodes: Node[] = [];
  edges: Edge[] = [];

  /**
   * Creates a new instance of the graph.
   * @param nodes - The vertices of the graph.
   */
  constructor(nodes: Node[] = [], edges: Edge[] = []) {
    this.nodes = nodes;
    this.edges = edges;
  }

  /**
   * Adds a vertex to the graph.
   * @param node - The vertex to add.
   */
  addNode(node: Node) {
    this.nodes.push(node);
  }

  /**
   * Removes a vertex from the graph.
   * @param node - The vertex to remove.
   */
  removeNode(node: Node) {
    const index = this.nodes.indexOf(node);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }

    this.edges = this.edges.filter(
      (edge) => edge.from !== node.id && edge.to !== node.id
    );
  }

  /**
   * Removes a vertex from the graph.
   * @param nodeId - The vertex to remove.
   */
  removeNodeById(nodeId: string) {
    const index = this.nodes.findIndex((node) => node.id === nodeId);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }

    this.edges = this.edges.filter(
      (edge) => edge.from !== nodeId && edge.to !== nodeId
    );
  }

  /**
   * Adds a connection to the graph.
   * @param edge - The connection to add.
   */
  addEdge(edge: Edge) {
    this.edges.push(edge);
  }

  /**
   * Removes a connection from the graph.
   * @param edge - The connection to remove.
   */
  removeEdge(edge: Edge) {
    const index = this.edges.indexOf(edge);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  isConnected(from: string, to: string): boolean {
    return this.edges.some((edge) => edge.from === from && edge.to === to);
  }

  /**
   * Serializes the graph to a JSON string.
   * @returns The JSON representation of the graph.
   */
  toJSON(): string {
    return JSON.stringify(this.nodes);
  }

  static fromVisualGraph(graph: VisualGraph) {
    const nodes = graph.nodes.map((node: VisualNode) => {
      return {
        id: node.id,
        x: node.x,
        y: node.y,
        label: node.label,
        color: node.color,
        width: node.width,
        height: node.height,
      };
    });

    const edges = graph.edges.map((edge: VisualEdge) => {
      return {
        from: edge.start.id,
        to: edge.end.id,
      };
    });

    return new Graph(nodes, edges);
  }

  convertGraphToCanvasElements(): CanvasElement[] {
    const canvasElements: CanvasElement[] = this.nodes.map((node) => {
      return new VisualNode({
        id: node.id,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        label: node.label,
        color: node.color,
        fontColor: "#fff",
      });
    });

    this.edges.forEach((connection) => {
      const fromVertex = this.nodes.find(
        (vertex) => vertex.id === connection.from
      );
      const toVertex = this.nodes.find((vertex) => vertex.id === connection.to);

      canvasElements.push(
        new Curve({
          id: `${connection.from}-${connection.to}`,
          startX: fromVertex.x,
          startY: fromVertex.y,
          controlPoint1X: fromVertex.x + 50,
          controlPoint1Y: fromVertex.y,
          controlPoint2X: toVertex.x - 50,
          controlPoint2Y: toVertex.y,
          endX: toVertex.x,
          endY: toVertex.y,
          color: "#fff",
          width: 3,
          dash: [],
        })
      );
    });

    return canvasElements;
  }

  /**
   * Converts a JSON string to a graph.
   * @param json - The JSON string to convert.
   * @returns The graph representation of the JSON string.
   */
  static fromJSON(json: string): Graph {
    const graphJson = JSON.parse(json);
    const graph = new Graph();
    graph.nodes = graphJson.vertices ?? [];
    graph.edges = graphJson.connections ?? [];
    return graph;
  }

  static convertCanvasElementsToGraph(elements: CanvasElement[]): Graph {
    const vertices: Node[] = elements
      .filter((el): el is VisualNode => el instanceof VisualNode)
      .map((element: VisualNode): Node => {
        return {
          id: element.id,
          x: element.x,
          y: element.y,
          label: element.label,
          color: element.color,
          width: element.width,
          height: element.height,
        };
      });

    const connections: Edge[] = elements
      .filter((el): el is VisualNode => el instanceof VisualNode)
      .map((element: VisualNode): Edge => {
        return {
          from: element.id,
          to: element.id,
        };
      });

    return new Graph(vertices, connections);
  }
}
