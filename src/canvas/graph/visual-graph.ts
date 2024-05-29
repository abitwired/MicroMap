import { Graph } from "../../store/graph";
import { Edge } from "./edge";
import { Node } from "./node";

/**
 * Represents a visual graph that consists of vertices and connections.
 */
export class VisualGraph {
  static fromGraph(graph: Graph): VisualGraph {
    const nodes = graph.nodes.map(
      (vertex) =>
        new Node({
          id: vertex.id,
          x: vertex.x,
          y: vertex.y,
          width: vertex.width,
          height: vertex.height,
          color: vertex.color,
          label: vertex.label,
          fontColor: "#fff",
          serviceDefinition: vertex.serviceDefinition,
        })
    );

    const connections = graph.edges.map(
      (connection) =>
        new Edge({
          start: nodes.find((vertex) => vertex.id === connection.from)!,
          end: nodes.find((vertex) => vertex.id === connection.to)!,
        })
    );

    return new VisualGraph(nodes, connections);
  }
  /**
   * The array of vertices in the graph.
   */
  nodes: Node[] = [];

  /**
   * The array of connections between vertices in the graph.
   */
  edges: Edge[] = [];

  /**
   * Creates a new instance of the VisualGraph class.
   * @param vertices - An array of vertices to initialize the graph with (default: []).
   * @param connections - An array of connections to initialize the graph with (default: []).
   */
  constructor(nodes: Node[] = [], connections: Edge[] = []) {
    this.nodes = nodes;
    this.edges = connections;
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
      (edge) => edge.start.id !== node.id && edge.end.id !== node.id
    );
  }

  /**
   * Removes a vertex from the graph by its ID.
   * @param nodeId - The ID of the vertex to remove.
   */
  removeNodeById(nodeId: string) {
    const index = this.nodes.findIndex((node) => node.id === nodeId);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }

    this.edges = this.edges.filter(
      (edge) => edge.start.id !== nodeId && edge.end.id !== nodeId
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
   * @param connection - The connection to remove.
   */
  removeEdge(connection: Edge) {
    const index = this.edges.indexOf(connection);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  removeEdgeById(edgeId: string) {
    const index = this.edges.findIndex((edge) => edge.id === edgeId);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  hasConnection(from: string, to: string): boolean {
    return this.edges.some(
      (edge) => edge.start.id === from && edge.end.id === to
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.edges.forEach((edge) => {
      edge.draw(ctx);
    });

    this.nodes.forEach((node) => {
      node.draw(ctx);
    });
  }
}
