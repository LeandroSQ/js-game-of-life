import { Theme } from "./../utils/theme";
import { Cell } from "./../enums/cell";
import { DensityCanvas } from "../components/density-canvas";

export class Grid {

	// Define sizing
	public rows = 32;

	public cols = 32;

	public cellWidth = 0;

	public cellHeight = 0;

	// Define properties
	public cells: Cell[][] = [];

	// Misc
	private canvasBuffer = new DensityCanvas("grid-buffer");

	private isDirty = false;

	// #region Lifecycle
	private setupCells() {
		this.cells = [];
		for (let row = 0; row < this.rows; row++) {
			this.cells[row] = [];
			for (let col = 0; col < this.cols; col++) {
				this.cells[row][col] = Cell.Dead;
			}
		}
	}

	public load(pattern: Cell[][]) {
		const center = { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) };

		// Clear the grid
		this.setupCells();

		// Load the pattern
		const patternWidth = pattern[0].length;
		const patternHeight = pattern.length;
		for (let row = 0; row < patternHeight; row++) {
			for (let col = 0; col < patternWidth; col++) {
				this.setCell(
					Math.floor(center.y + row - patternHeight / 2),
					Math.floor(center.x + col - patternWidth / 2),
					pattern[row][col]
				);
			}
		}
	}

	public random() {
		this.cells = [];
		for (let row = 0; row < this.rows; row++) {
			this.cells[row] = [];
			for (let col = 0; col < this.cols; col++) {
				this.cells[row][col] = Math.random() <= 0.25 ? Cell.Alive : Cell.Dead;
			}
		}
	}

	public onLayout(width: number, height: number) {
		// Calculate the cell size
		const minAxis = Math.min(width, height);
		this.cellHeight = minAxis / this.rows;
		this.cellWidth = minAxis / this.cols;

		// Resize the canvas buffer
		this.canvasBuffer.setSize(width, height);
		this.isDirty = true;
	}
	// #endregion

	// #region Utility
	private getCell(row: number, col: number) {
		if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return Cell.Dead;

		return this.cells[row][col];
	}

	private setCell(row: number, col: number, cell: Cell) {
		if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
		this.cells[row][col] = cell;
	}

	private getNeighborCount(row: number, col: number) {
		let count = 0;

		// Top
		if (this.getCell(row - 1, col) === Cell.Alive) count++;
		// Top left
		if (this.getCell(row - 1, col - 1) === Cell.Alive) count++;
		// Left
		if (this.getCell(row, col - 1) === Cell.Alive) count++;
		// Top right
		if (this.getCell(row - 1, col + 1) === Cell.Alive) count++;
		// Right
		if (this.getCell(row, col + 1) === Cell.Alive) count++;
		// Bottom
		if (this.getCell(row + 1, col) === Cell.Alive) count++;
		// Bottom left
		if (this.getCell(row + 1, col - 1) === Cell.Alive) count++;
		// Bottom right
		if (this.getCell(row + 1, col + 1) === Cell.Alive) count++;

		return count;
	}
	// #endregion

	public invalidate() {
		this.isDirty = true;
	}

	public render(originalCtx: CanvasRenderingContext2D) {
		if (this.isDirty) {
			this.isDirty = false;
			const ctx = this.canvasBuffer.context;
			this.canvasBuffer.clear();

			// Draw the lines
			ctx.strokeStyle = Theme.containerBorder;
			ctx.lineWidth = 1;

			// Horizontal lines
			for (let row = 0; row < this.rows; row++)
				ctx.drawLine(0, row * this.cellHeight, ctx.canvas.width, row * this.cellHeight);
			// Vertical lines
			for (let col = 0; col < this.cols; col++)
				ctx.drawLine(col * this.cellWidth, 0, col * this.cellWidth, ctx.canvas.height);
		}

		this.renderCells(originalCtx);

		// Draw the buffer to the original canvas
		this.canvasBuffer.drawTo(0, 0, originalCtx);
	}

	private renderCells(ctx: CanvasRenderingContext2D) {
		// Draw the cells
		ctx.fillStyle = Theme.cellAlive;
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				if (this.cells[row][col] === Cell.Alive) {
					ctx.fillRect(col * this.cellWidth, row * this.cellHeight, this.cellWidth, this.cellHeight);
				}
			}
		}
	}

	public update() {
		/*
           Rules:
           1- Any live cell with fewer than two live neighbors dies, as if by underpopulation.
           2- Any live cell with two or three live neighbors lives on to the next generation.
           3- Any live cell with more than three live neighbors dies, as if by overpopulation.
           4- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
        */

		const buffer: Cell[][] = [];
		for (let row = 0; row < this.rows; row++) {
			buffer[row] = [];

			for (let col = 0; col < this.cols; col++) {
				const cell = this.getCell(row, col);
				const neighbors = this.getNeighborCount(row, col);

				if (cell == Cell.Alive) {
					if (neighbors < 2) {
						// Rule 1
						buffer[row][col] = Cell.Dead;
					} else if (neighbors === 2 || neighbors === 3) {
						// Rule 2
						buffer[row][col] = Cell.Alive;
					} else if (neighbors > 3) {
						// Rule 3
						buffer[row][col] = Cell.Dead;
					}
				} else if (neighbors === 3) {
					// Rule 4
					buffer[row][col] = Cell.Alive;
				}
			}
		}

		this.cells = buffer;
	}

}