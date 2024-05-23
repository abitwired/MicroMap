import { CanvasElement } from "../canvas/types";
import { Text } from "../canvas/text";

/**
 * Represents a vertex in a graph.
 */
export type Vertex = {
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
  /** The connections of the vertex. */
  connections: string[];
};

/**
 * Represents a graph.
 */
export class Graph {
  vertices: Vertex[] = [];

  /**
   * Creates a new instance of the graph.
   * @param vertices - The vertices of the graph.
   */
  constructor(vertices: Vertex[] = []) {
    this.vertices = vertices;
  }

  /**
   * Adds a vertex to the graph.
   * @param vertex - The vertex to add.
   */
  addVertex(vertex: Vertex) {
    this.vertices.push(vertex);
  }

  /**
   * Removes a vertex from the graph.
   * @param vertex - The vertex to remove.
   */
  removeVertex(vertex: Vertex) {
    const index = this.vertices.indexOf(vertex);
    if (index !== -1) {
      this.vertices.splice(index, 1);
    }
  }

  /**
   * Adds a connection between two vertices.
   * @param vertex1 - The first vertex.
   * @param vertex2 - The second vertex.
   */
  addConnection(vertex1: Vertex, vertex2: Vertex) {
    vertex1.connections.push(vertex2.id);
    vertex2.connections.push(vertex1.id);
  }

  /**
   * Removes a connection between two vertices.
   * @param vertex1 - The first vertex.
   * @param vertex2 - The second vertex.
   */
  removeConnection(vertex1: Vertex, vertex2: Vertex) {
    vertex1.connections = vertex1.connections.filter((id) => id !== vertex2.id);
    vertex2.connections = vertex2.connections.filter((id) => id !== vertex1.id);
  }

  /**
   * Serializes the graph to a JSON string.
   * @returns The JSON representation of the graph.
   */
  toJSON(): string {
    return JSON.stringify(this.vertices);
  }

  convertGraphToCanvasElements(): CanvasElement[] {
    const canvasElements = this.vertices.map((vertex) => {
      return new Text({
        id: vertex.id,
        x: vertex.x,
        y: vertex.y,
        width: vertex.width,
        height: vertex.height,
        text: vertex.label,
        color: vertex.color,
        fontColor: "#fff",
      });
    });

    canvasElements.forEach((element) => {
      const vertex = this.vertices.find((vertex) => vertex.id === element.id);
      if (vertex) {
        element.outConnections = vertex.connections.map((id) => {
          return canvasElements.find((element) => element.id === id);
        });
      }
    });

    return canvasElements;
  }

  /**
   * Converts a JSON string to a graph.
   * @param json - The JSON string to convert.
   * @returns The graph representation of the JSON string.
   */
  static fromJSON(json: string): Graph {
    const graph = new Graph();
    graph.vertices = JSON.parse(json);
    return graph;
  }

  static convertCanvasElementsToGraph(elements: CanvasElement[]) {
    const vertices = elements.map((element) => {
      const el = this.downCastCanvasElement(element);

      return {
        id: el.id,
        x: el.x,
        y: el.y,
        label: el.text,
        color: el.color,
        width: el.width,
        height: el.height,
        connections: el.outConnections.map((connection) => {
          return connection.id;
        }),
      };
    });

    return new Graph(vertices);
  }

  static downCastCanvasElement(element: CanvasElement): Text {
    if (element instanceof Text) {
      return element as Text;
    } else {
      throw new Error("Element is not a Text element");
    }
  }
}
