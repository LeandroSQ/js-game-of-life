export class Color {

	public static isColorLight(hex: string): boolean {
		// Remove the # if present
		let tmp = `0x${hex.trim().slice(1)}`;

		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		if (tmp.length < 5) tmp = tmp.replace(/./g, "$&$&");

		// Convert to integer
		const color = parseInt(tmp, 16);

		// Decode the color channels
		const r = color >> 16;
		const g = (color >> 8) & 255;
		const b = color & 255;

		// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
		const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

		return hsp > 127.5;
	}

}