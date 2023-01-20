import { Main } from "./main";

// Signatures
declare global {

    interface Window {
        _instance: Main;
        addLoadEventListener: (listener: () => void) => void;
        addVisibilityChangeEventListener: (listener: (isVisible: boolean) => void) => void;
    }

    interface CanvasRenderingContext2D {
        drawLine: (x1: number, y1: number, x2: number, y2: number) => void;
        drawCircle: (x: number, y: number, radius: number) => void;
    }

    interface HTMLCanvasElement {
        screenshot: () => void;
    }

    interface String {
        toCamelCase: () => string;
    }

    const DEBUG: boolean;

}

// Definitions
window.addLoadEventListener = function(listener) {
	let fired = false;

	const _func = () => {
		if (fired) return;
		fired = true;

		listener();
	};

	window.addEventListener("DOMContentLoaded", _func);
	window.addEventListener("load", _func);
	document.addEventListener("load", _func);
	window.addEventListener("ready", _func);
	setTimeout(_func, 1000);
};

window.addVisibilityChangeEventListener = function(listener) {
	const prefixes = ["webkit", "moz", "ms", ""];

	let fired = false;

	const _func = () => {
		if (fired) return;
		fired = true;

		const isDocumentHidden = prefixes
			.map((x) => (x && x.length > 0 ? `${x}Hidden` : "hidden"))
			.map((x) => document[x]).reduce((a, b) => a || b, false);

		listener(!isDocumentHidden);

		setTimeout(() => {
			fired = false;
		}, 100);
	};

	for (const prefix of prefixes) document.addEventListener(`${prefix}visibilitychange`, _func);
	document.onvisibilitychange = _func;
};

CanvasRenderingContext2D.prototype.drawLine = function(x1, y1, x2, y2) {
	this.beginPath();
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.stroke();
};

CanvasRenderingContext2D.prototype.drawCircle = function(x, y, radius) {
	this.beginPath();
	this.arc(x, y, radius, 0, 2 * Math.PI);
};

HTMLCanvasElement.prototype.screenshot = function(filename = "download.png") {
	const a = document.createElement("a");
	a.download = filename;
	a.href = this.toDataURL("image/png;base64");
	a.style.visibility = "hidden";
	a.style.display = "none";
	document.body.appendChild(a);

	setTimeout(() => {
		a.click();
		document.body.removeChild(a);
	}, 100);
};

String.prototype.toCamelCase = function() {
	return this.replace("--", "")
		.replace(/-./g, (x) => x[1].toUpperCase())
		.trim();
};

export { };