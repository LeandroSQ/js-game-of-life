import "./extensions";
import { Log } from "./utils/log";
import { Grid } from "./models/grid";
import { Theme } from "./utils/theme";
import { FontLoader } from "./utils/font";
import { DensityCanvas } from "./components/density-canvas";
import { PatternLoader } from "./utils/pattern";

export class Main {

	// Graphics
	public canvas = new DensityCanvas("canvas");

	public ctx = this.canvas.context;

	// Frame time
	private targetFPS = 15;

	private targetFrameTime = 1 / this.targetFPS;

	private frameTimer = 0;

	private lastFrameTime = performance.now();

	private frameCounter = 0;

	private fpsTimer = 0;

	public fps = 0;

	// State
	private isPaused = false;

	private grid: Grid = new Grid();

	constructor() {
		Log.info("Game of life", "Starting up...");
		this.attachHooks();

		// Setup theme controller
		Theme.setup(this);
	}

	private attachHooks() {
		Log.info("Checkers", "Attaching hooks...");
		window.addLoadEventListener(this.onLoad.bind(this));
		window.addEventListener("resize", this.onResize.bind(this));
		window.addVisibilityChangeEventListener(this.onVisibilityChange.bind(this));
	}

	// #region Event listeners
	private async onLoad() {
		Log.debug("Game of life", "Window loaded");

		// Attach the canvas element to the container element
		const container = document.getElementById("container");
		if (!container) throw new Error("Could not find container element");
		this.canvas.attachToElement(container);

		// Force layout
		this.onLayout();

		// Load the font
		await FontLoader.load();

		// Load default pattern
		await this.loadPattern("glider");

		// Request the first frame
		this.requestNextFrame();
	}

	private onResize() {
		Log.debug("Game of life", "Window resized");
		this.onLayout();
	}

	private onVisibilityChange(isVisible: boolean) {
		Log.debug("Game of life", `Window visibility changed to ${isVisible}` ? "visible" : "hidden");
		this.isPaused = !isVisible;
		if (isVisible) this.requestNextFrame();
	}

	private onLayout() {
		Log.debug("Game of life", "Window layout changed");

		// Get available space
		const container = document.getElementById("container") ?? document.body;
		const width = container.clientWidth;
		const height = container.clientHeight;

		// Resize the grid
		this.grid.onLayout(width, height);

		// Resize the canvas
		this.canvas.setSize(this.grid.cellWidth * this.grid.cols, this.grid.cellHeight * this.grid.rows);
	}
	// #endregion

	// #region Game loop
	private requestNextFrame() {
		if (this.isPaused) return;

		this.lastFrameTime = performance.now();
		requestAnimationFrame(this.onFrame.bind(this));
	}

	private onFrame(time) {
		// Ignore frames when the page is not visible
		if (this.isPaused) return;

		// Calculate the delta time
		let deltaTime = (time - this.lastFrameTime) / 1000.0;
		this.frameTimer += deltaTime;
		this.fpsTimer += deltaTime;

		while (this.frameTimer >= this.targetFrameTime) {
			this.frameTimer -= this.targetFrameTime;
			deltaTime = this.targetFrameTime;

			// Handle fps counter
			this.frameCounter++;
			if (this.fpsTimer >= 1.0) {
				this.fpsTimer -= 1.0;
				this.fps = this.frameCounter;
				this.frameCounter = 0;

				Log.debug("Game of life", `FPS: ${this.fps}`);
			}

			// Update the game state
			this.update();
		}

		// Render the game state
		this.render();

		// Request the next frame
		this.requestNextFrame();
	}

	private renderDebugOverlay() {
		if (!DEBUG) return;

		this.ctx.font = `12px ${FontLoader.fontFamily}`;
		this.ctx.fillStyle = Theme.foreground;
		this.ctx.fillText(`FPS: ${this.fps}`, 10, 22.5);
	}

	private update() {
		this.grid.update();
	}

	private render() {
		this.canvas.clear();
		this.grid.render(this.ctx);
		this.renderDebugOverlay();
	}
	// #endregion

	// #region UI
	public async loadPattern(filename) {
		// Load the pattern
		const pattern = await PatternLoader.load(`./../assets/pattern-${filename}.txt`);
		this.grid.load(pattern);
	}

	public async randomPattern() {
		// Generate the random pattern
		this.grid.random();
	}
	// #endregion

}

// Start the game
window._instance = new Main();