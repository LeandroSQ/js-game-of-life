import { Cell } from "../enums/cell";
import { Log } from "./log";

export class PatternLoader {

	/**
	 * Resolves and expands an image to absolute path
	 *
	 * @param {string} identifier Specifies the file to be loaded
	 * @return {string} The resolved path of the file
	 */
	private static resolvePath(identifier) {
		const locationRoot = window.location.href.indexOf("http://localhost")
			? window.location.href
			: window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
		const relativePath = "/assets/";

		return locationRoot + relativePath + identifier;
	}

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
		const response = await fetch(this.resolvePath(filename));
		const data = await response.text();

		return PatternLoader.parse(data);
	}

}