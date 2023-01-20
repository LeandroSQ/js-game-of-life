export class FontLoader {

	public static fontFamily = "'Rubik', cursive";

	public static async load() {
		// Define the sizes on which the font will be used, to preload
		const sizes = [12, 20, 40];

		// For each size, check if already loaded, if not wait until it loads
		const promises = sizes.map(async size => {
			const font = `${size}pt ${FontLoader.fontFamily}`;
			if (!document.fonts.check(font)) {
				await document.fonts.load(font);
			}
		});

		// Waits in parallel
		await Promise.all(promises);
	}

}