class Node {
  constructor(x, y, solid) {
    this.x = x;
    this.y = y;
    this.solid = solid;
    this.g = 0; // Costo acumulado desde el inicio
    this.h = 0; // Heurística (estimación de costo hasta el destino)
    this.f = 0; // Suma de g y h
    this.parent = null; // Nodo padre en la ruta
  }
}

class Pathfinder {
  constructor(map, start, goal) {
    this.map = map;
    this.start = start;
    this.goal = goal;
    this.openList = [];
    this.closedList = [];
  }

  findPath(map, start, goal) {
    this.map = map;
    this.start = start;
    this.goal = goal;

    const startNode = new Node(this.start.x, this.start.y, false);
    const goalNode = new Node(this.goal.x, this.goal.y, false);

    this.openList.push(startNode);

    while (this.openList.length > 0) {
      // Buscar el nodo con menor valor f en la lista abierta
      let currentNode = this.openList[0];
      let currentIndex = 0;
      for (let i = 1; i < this.openList.length; i++) {
        if (this.openList[i].f < currentNode.f) {
          currentNode = this.openList[i];
          currentIndex = i;
        }
      }

      // Mover el nodo actual de la lista abierta a la lista cerrada
      this.openList.splice(currentIndex, 1);
      this.closedList.push(currentNode);

      // Si el nodo actual es el nodo objetivo, se ha encontrado la ruta
      if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
        let path = [];
        let current = currentNode;
        while (current !== null) {
          path.unshift({ x: current.x, y: current.y });
          current = current.parent;
        }
        return path;
      }

      // Generar los vecinos del nodo actual
      let neighbors = this.generateNeighbors(currentNode);

      for (let neighbor of neighbors) {
        // Si el vecino es un nodo sólido o está en la lista cerrada, ignorarlo
        if (neighbor.solid || this.isInClosedList(neighbor)) {
          continue;
        }

        // Calcular los nuevos valores de g, h y f para el vecino
        let gScore = currentNode.g + 1;
        let hScore = this.calculateHeuristic(neighbor, goalNode);
        let fScore = gScore + hScore;

        // Si el vecino está en la lista abierta pero con un f mayor, ignorarlo
        if (this.isInOpenList(neighbor) && fScore >= neighbor.f) {
          continue;
        }

        // Actualizar los valores del vecino y establecer el nodo actual como padre
        neighbor.g = gScore;
        neighbor.h = hScore;
        neighbor.f = fScore;
        neighbor.parent = currentNode;

        // Si el vecino no está en la lista abierta, agregarlo
        if (!this.isInOpenList(neighbor)) {
          this.openList.push(neighbor);
        }
      }
    }

    // No se encontró una ruta válida
    return null;
  }

  generateNeighbors(node) {
    const neighbors = [];
    const directions = [
      { dx: -1, dy: 0 }, // Izquierda
      { dx: 1, dy: 0 }, // Derecha
      { dx: 0, dy: -1 }, // Arriba
      { dx: 0, dy: 1 }, // Abajo
    ];

    for (let direction of directions) {
      const nx = node.x + direction.dx;
      const ny = node.y + direction.dy;

      // Verificar si el vecino está dentro de los límites del mapa
      if (
        nx >= 0 &&
        nx < this.map[0].length &&
        ny >= 0 &&
        ny < this.map.length
      ) {
        const neighbor = new Node(nx, ny, this.map[ny][nx] === 1);
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  calculateHeuristic(node, goalNode) {
    // Distancia de Manhattan como heurística
    return Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);
  }

  isInOpenList(node) {
    return this.openList.some((n) => n.x === node.x && n.y === node.y);
  }

  isInClosedList(node) {
    return this.closedList.some((n) => n.x === node.x && n.y === node.y);
  }
}

export default Pathfinder;

// Ejemplo de uso
// const map = [
//   [1, 1, 1, 1, 1, 1],
//   [1, 0, 0, 0, 0, 1],
//   [1, 0, 1, 1, 0, 1],
//   [1, 0, 0, 0, 0, 1],
//   [1, 1, 1, 1, 1, 1],
// ];

// const start = { x: 1, y: 1 };
// const goal = { x: 4, y: 3 };

// const pathfinder = new Pathfinder(map, start, goal);
// const path = pathfinder.findPath();

// console.log(path);
