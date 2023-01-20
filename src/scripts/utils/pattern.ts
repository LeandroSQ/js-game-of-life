import { Cell } from "../enums/cell";
import { Log } from "./log";

export class PatternLoader {

	private static parse(data: string): Cell[][] {
		// Split the data into lines
		const lines = data.split("\n").map(x => x.trim());

		// Get the number of lines and columns
		const lineCount = lines.length;
		const columnCount = Math.max(...lines.map(x => x.length));

		// Create the grid
		const cells: Cell[][] = [];
		for (let row = 0; row < lineCount; row++) {
			cells[row] = [];
			for (let col = 0; col < columnCount; col++) {
				if (lines[row][col] === "X") {
					cells[row][col] = Cell.Alive;
				} else {
					cells[row][col] = Cell.Dead;
				}
			}
		}

		console.groupCollapsed("Loading pattern");
		console.table(cells);
		Log.debug("Pattern loader", `${lineCount} rows and ${columnCount} columns.`);
		console.groupEnd();

		return cells;
	}

	public static async load(filename: string): Promise<Cell[][]> {
		const response = await fetch(filename);
		const data = await response.text();

		return PatternLoader.parse(data);
	}

}